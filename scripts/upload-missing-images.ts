/**
 * Upload missing images from Downloaded_Images folder to Supabase Storage
 * Run with: npx tsx scripts/upload-missing-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = "parts-images";
const IMAGE_DIR =
  "docs/auto part workflow/Parts/Winni Parts/Helper/Downloaded_Images";

interface UploadResult {
  partId: string;
  status: "uploaded" | "failed" | "not_found";
  oldUrl?: string;
  newUrl?: string;
  error?: string;
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
  };
  return mimeTypes[ext] || "image/jpeg";
}

async function uploadImage(partId: string, localPath: string): Promise<string> {
  const fileBuffer = fs.readFileSync(localPath);
  const ext = path.extname(localPath);
  const storagePath = `parts/${partId}${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: getMimeType(localPath),
      upsert: true,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);

  return data.publicUrl;
}

async function main() {
  console.log("=== Upload Missing Images to Supabase Storage ===\n");

  // Read the missing images CSV
  const csvPath =
    "docs/auto part workflow/Clean Data for import/Clean Uploaded images/MISSING_IMAGES.csv";
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.trim().split("\n").slice(1); // Skip header

  const missingParts = lines.map((line) => {
    const [partId, url] = line.split(",");
    return { partId: partId.trim(), url: url?.replace(/"/g, "").trim() };
  });

  console.log(`Found ${missingParts.length} parts in MISSING_IMAGES.csv`);
  console.log(`Checking for images in: ${IMAGE_DIR}\n`);

  const results: UploadResult[] = [];
  let uploaded = 0;
  let notFound = 0;
  let failed = 0;

  for (const part of missingParts) {
    // Check for image file with various extensions
    const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
    let localPath: string | null = null;

    for (const ext of extensions) {
      const testPath = path.join(IMAGE_DIR, `${part.partId}.${ext}`);
      if (fs.existsSync(testPath)) {
        localPath = testPath;
        break;
      }
    }

    if (!localPath) {
      console.log(`❌ Not found: ${part.partId}`);
      results.push({
        partId: part.partId,
        status: "not_found",
        oldUrl: part.url,
      });
      notFound++;
      continue;
    }

    try {
      console.log(`⬆️  Uploading: ${part.partId}...`);
      const newUrl = await uploadImage(part.partId, localPath);

      // Update database with new URL
      const { error: updateError } = await supabase
        .from("parts")
        .update({ image: newUrl })
        .eq("id", part.partId);

      if (updateError) {
        throw new Error(`DB update failed: ${updateError.message}`);
      }

      results.push({
        partId: part.partId,
        status: "uploaded",
        oldUrl: part.url,
        newUrl: newUrl,
      });
      uploaded++;
      console.log(`✅ Uploaded: ${part.partId}`);
    } catch (err) {
      results.push({
        partId: part.partId,
        status: "failed",
        oldUrl: part.url,
        error: err instanceof Error ? err.message : String(err),
      });
      failed++;
      console.log(`❌ Failed: ${part.partId} - ${err}`);
    }
  }

  // Summary
  console.log("\n=== UPLOAD COMPLETE ===");
  console.log(`Total parts: ${missingParts.length}`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Not found locally: ${notFound}`);
  console.log(`Failed: ${failed}`);

  // Save report
  const reportPath =
    "docs/auto part workflow/Clean Data for import/Clean Uploaded images/MISSING_IMAGES_UPLOAD_REPORT.json";
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        summary: {
          total: missingParts.length,
          uploaded,
          notFound,
          failed,
          timestamp: new Date().toISOString(),
        },
        results,
      },
      null,
      2,
    ),
  );
  console.log(`\nReport saved: ${reportPath}`);

  // List parts still missing
  const stillMissing = results.filter((r) => r.status === "not_found");
  if (stillMissing.length > 0) {
    console.log("\n⚠️  Parts still missing images:");
    stillMissing.forEach((r) => console.log(`   - ${r.partId}`));
  }
}

main().catch(console.error);
