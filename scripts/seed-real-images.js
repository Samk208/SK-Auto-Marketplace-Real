
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
// Load environment variables manually
const envLocalPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envLocalPath)) {
    let envContent
    try {
        envContent = fs.readFileSync(envLocalPath, 'utf8')
        // Check for null bytes which indicate utf16le read as utf8
        if (envContent.includes('\u0000')) {
            envContent = fs.readFileSync(envLocalPath, 'utf16le')
        }
    } catch (e) {
        envContent = fs.readFileSync(envLocalPath, 'utf16le')
    }

    envContent.split(/\r?\n/).forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
            const key = match[1].trim()
            let value = match[2].trim()
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1)
            }
            process.env[key] = value
        }
    })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials in .env.local')
    process.exit(1)
}

if (!PEXELS_API_KEY && !UNSPLASH_ACCESS_KEY) {
    console.error('Missing Image API keys (PEXELS_API_KEY or UNSPLASH_ACCESS_KEY) in .env.local')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function searchPexels(query) {
    if (!PEXELS_API_KEY) return null
    try {
        const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        })
        const data = await response.json()
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large
        }
    } catch (error) {
        console.error(`Error searching Pexels for ${query}:`, error)
    }
    return null
}

async function searchUnsplash(query) {
    if (!UNSPLASH_ACCESS_KEY) return null
    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`, {
            headers: {
                Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
            }
        })
        const data = await response.json()
        if (data.results && data.results.length > 0) {
            return data.results[0].urls.regular
        }
    } catch (error) {
        console.error(`Error searching Unsplash for ${query}:`, error)
    }
    return null
}

async function uploadToSupabase(imageUrl, fileName) {
    try {
        // Fetch image buffer
        const response = await fetch(imageUrl)
        const arrayBuffer = await response.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Save locally
        const localDir = path.join(process.cwd(), 'Images')
        if (!fs.existsSync(localDir)) {
            fs.mkdirSync(localDir, { recursive: true })
        }
        const localPath = path.join(localDir, fileName.replace('/', '_'))
        fs.writeFileSync(localPath, buffer)
        console.log(`Saved locally to ${localPath}`)

        // Upload to Supabase
        const { data, error } = await supabase.storage
            .from('car-images')
            .upload(fileName, buffer, {
                contentType: response.headers.get('content-type') || 'image/jpeg',
                upsert: true
            })

        if (error) {
            console.error(`Error uploading ${fileName}:`, error)
            return null
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('car-images')
            .getPublicUrl(fileName)

        return publicUrlData.publicUrl
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error)
        return null
    }
}

async function main() {
    console.log('Starting image seeding...')

    // 0. Ensure bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.find(b => b.name === 'car-images')

    if (!bucketExists) {
        console.log('Creating car-images bucket...')
        const { error: createError } = await supabase.storage.createBucket('car-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
        })
        if (createError) {
            console.error('Error creating bucket:', createError)
            return
        }
    }

    // 1. Fetch listings
    const { data: listings, error } = await supabase
        .from('car_listings')
        .select('id, brand, model, year, exterior_color')

    if (error) {
        console.error('Error fetching listings:', error)
        return
    }

    console.log(`Found ${listings.length} listings.`)

    for (const listing of listings) {
        const query = `${listing.year} ${listing.brand} ${listing.model} ${listing.exterior_color || ''} car`
        console.log(`Processing: ${query}...`)

        // Try Pexels first, then Unsplash
        let imageUrl = await searchPexels(query)
        if (!imageUrl) {
            imageUrl = await searchUnsplash(query)
        }

        if (imageUrl) {
            console.log(`Found image: ${imageUrl}`)
            const fileName = `${listing.id}/main.jpg`
            const publicUrl = await uploadToSupabase(imageUrl, fileName)

            if (publicUrl) {
                console.log(`Uploaded to Supabase: ${publicUrl}`)

                // Update listing
                const { error: updateError } = await supabase
                    .from('car_listings')
                    .update({
                        primary_image_url: publicUrl,
                        image_urls: [publicUrl]
                    })
                    .eq('id', listing.id)

                if (updateError) {
                    console.error(`Error updating listing ${listing.id}:`, updateError)
                } else {
                    console.log(`Updated listing ${listing.id}`)
                }
            }
        } else {
            console.log(`No image found for ${query}`)
        }

        // Simple rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log('Done!')
}

main().catch(console.error)
