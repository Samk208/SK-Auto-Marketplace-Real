import { createSupabaseServerClient } from '@/lib/auth/supabase-auth-server';
import { analyzeVehicleCondition } from '@/lib/gemini';
import { NextResponse } from 'next/server';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createSupabaseServerClient();
        const listingId = params.id;

        // 1. Auth Check (Simplification: Allow any auth user to trigger for now, or restrict to dealer)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Check if report already exists
        // Explicitly cast the table check
        const { data: existingReport } = await supabase
            .from('ai_condition_reports' as any)
            .select('*')
            .eq('listing_id', listingId)
            .single();

        if (existingReport) {
            return NextResponse.json(existingReport);
        }

        // 3. Fetch Listing Images
        const { data: listingData, error: listingError } = await supabase
            .from('car_listings')
            .select('make:brand, model, year, mileage, image_urls, primary_image_url') // Aliasing brand to make
            .eq('id', listingId)
            .single();

        if (listingError || !listingData) {
            return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
        }

        // Explicit Cast to avoid 'never'
        const listing = listingData as unknown as {
            make: string;
            model: string;
            year: number;
            mileage: number;
            image_urls: string[] | null;
            primary_image_url: string | null;
        };

        // Collect images
        let images: string[] = [];
        if (listing.image_urls && Array.isArray(listing.image_urls)) {
            images = listing.image_urls;
        } else if (listing.primary_image_url) {
            images = [listing.primary_image_url];
        }

        if (images.length === 0) {
            return NextResponse.json({ error: 'No images available for analysis' }, { status: 400 });
        }

        // 4. Analyze with Gemini
        const flags = await analyzeVehicleCondition(images, {
            make: listing.make,
            model: listing.model,
            year: listing.year,
            mileage: listing.mileage
        });

        // Calculate score (simple heuristic based on severity)
        // 100 - (critical * 20) - (warning * 10)
        let score = 95; // Base score
        let criticalCount = 0;

        flags.forEach(f => {
            if (f.severity === 'critical') {
                score -= 20;
                criticalCount++;
            } else if (f.severity === 'warning') {
                score -= 10;
            }
        });
        score = Math.max(0, Math.min(100, score));

        // Determine grade
        let grade = 'excellent';
        if (criticalCount > 0 || score < 60) grade = 'poor';
        else if (score < 80) grade = 'fair';
        else if (score < 90) grade = 'good';

        // 5. Save Report
        const reportData = {
            listing_id: listingId,
            overall_score: score,
            condition_grade: grade,
            summary: `AI Analysis based on ${images.length} images. ${flags.length} findings reported.`,
            flags: flags
        };

        const { data: newReport, error: saveError } = await supabase
            .from('ai_condition_reports' as any)
            .insert(reportData)
            .select()
            .single();

        if (saveError) {
            console.error('Failed to save report:', saveError);
            // Return report anyway without saving if error (e.g. race condition)
            return NextResponse.json(reportData);
        }

        return NextResponse.json(newReport);

    } catch (error) {
        console.error('Analysis API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
