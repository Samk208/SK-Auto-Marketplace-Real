const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
);

async function inspectListings() {
  const { data, error } = await supabase
    .from("car_listings")
    .select("id, title, search_vector")
    .limit(5);

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Sample Listings:", JSON.stringify(data, null, 2));
  }
}

inspectListings();
