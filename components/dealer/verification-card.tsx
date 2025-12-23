'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    FileText,
    Loader2,
    Upload,
    XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface VerificationCardProps {
    status: 'unverified' | 'pending' | 'verified' | 'rejected' | string;
    notes?: string | null;
    licenseUrl?: string | null;
}

export function DealerVerificationCard({ status, notes, licenseUrl }: VerificationCardProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);

        try {
            const user = (await supabase.auth.getUser()).data.user;
            if (!user) throw new Error('Not authenticated');

            const fileExt = file.name.split('.').pop();
            const fileName = `business_license_${Date.now()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('dealer-documents')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Update dealers table
            const { error: updateError } = await supabase
                .from('dealers')
                // @ts-ignore - Supabase type mismatch possible if types not regenerated
                .update({
                    business_license_url: filePath,
                    verification_status: 'pending'
                })
                .eq('user_id', user.id);

            if (updateError) throw updateError;

            router.refresh();
            setFile(null);
            alert('Document uploaded successfully! Verification is now pending.');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload document. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    // If verified, show nothing (or a small badge elsewhere) to keep dashboard clean
    if (status === 'verified') return null;

    return (
        <Card className={`border-l-4 ${status === 'rejected' ? 'border-l-red-500' :
            status === 'pending' ? 'border-l-yellow-500' : 'border-l-blue-500'
            }`}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Account Verification</CardTitle>
                    <StatusBadge status={status} />
                </div>
                <CardDescription>
                    {status === 'pending'
                        ? "Your document is under review by our admin team."
                        : "Upload your business license to verify your account."}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {status === 'rejected' && (
                    <div className="bg-red-50 text-red-800 p-3 rounded-md mb-4 text-sm flex gap-2 items-start">
                        <XCircle className="h-5 w-5 shrink-0" />
                        <div>
                            <p className="font-semibold">Verification Rejected</p>
                            <p>{notes || "Please check your document and try again."}</p>
                        </div>
                    </div>
                )}

                {status === 'pending' && (
                    <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-50 p-3 rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <p>We are reviewing your document: <strong>{licenseUrl?.split('/').pop()}</strong></p>
                    </div>
                )}

                {(status === 'unverified' || status === 'rejected' || !status) && (
                    <div className="space-y-4">
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="license">Business License / Registration (PDF/Image)</Label>
                            <Input
                                id="license"
                                type="file"
                                accept=".pdf,image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        {file && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <FileText className="h-4 w-4" />
                                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            {(status === 'unverified' || status === 'rejected' || !status) && (
                <CardFooter>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Submit for Verification
                            </>
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'verified':
            return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
        case 'pending':
            return <Badge className="bg-yellow-500 hover:bg-yellow-600"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Pending</Badge>;
        case 'rejected':
            return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
        default:
            return <Badge variant="outline"><AlertTriangle className="w-3 h-3 mr-1" /> Unverified</Badge>;
    }
}
