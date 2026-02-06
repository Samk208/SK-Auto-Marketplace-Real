const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

// Source directory for images
const IMAGES_DIR = path.join(process.cwd(), "Images");
const BUCKET_NAME = "car-images";

async function hydrateImages() {
  console.log("🚀 Starting Image Hydration...");

  // 1. Ensure Bucket Exists
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets.find((b) => b.name === BUCKET_NAME)) {
    console.log(`Creating bucket: ${BUCKET_NAME}`);
    await supabase.storage.createBucket(BUCKET_NAME, { public: true });
  }

  // 2. Read Files
  const files = fs.readdirSync(IMAGES_DIR).filter((f) => f.endsWith(".jpg"));
  console.log(`Found ${files.length} images to upload.`);

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);

    // Extract ID (assuming format UUID_main.jpg)
    const uuid = file.split("_")[0];

    // Upload path
    const storagePath = `${uuid}/${file}`;

    console.log(`\nProcessing: ${file}`);
    console.log(`  Target Listing ID: ${uuid}`);

    // 3. Upload to Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error(`  ❌ Upload failed: ${uploadError.message}`);
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

    console.log(`  ✅ Uploaded: ${publicUrl}`);

    // 4. Update Database
    const { error: dbError } = await supabase
      .from("car_listings")
      .update({
        primary_image_url: publicUrl,
        image_urls: [publicUrl], // simplistic, puts single image in array
        status: "active", // Ensure it's active so it shows in shop
      })
      .eq("id", uuid);

    if (dbError) {
      console.error(`  ❌ DB Update failed: ${dbError.message}`);
    } else {
      console.log(`  ✨ DB Updated successfully`);
    }
  }

  console.log("\n🏁 Hydration Complete!");
}

hydrateImages();
