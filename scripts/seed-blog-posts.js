
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBlogPosts() {
    console.log("🌱 Seeding sample blog posts...");

    // 1. Get a valid user ID to use as author
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError || !users || users.users.length === 0) {
        console.error("❌ No users found. Please use the fix script first.");
        process.exit(1);
    }

    const authorId = users.users[0].id; // Use the first admin user

    const samplePosts = [
        {
            title: "Why Korean Cars Are Perfect for African Roads",
            slug: "why-korean-cars-are-perfect-for-african-roads",
            summary: "Discover why Kia, Hyundai, and Genesis vehicles are conquering African terrain with their durability, fuel efficiency, and available parts.",
            content: `<h1>Why Korean Cars Are Perfect for African Roads</h1>
<p>In recent years, the automotive landscape across Africa has shifted dramatically. While Japanese vehicles traditionally held the top spot, <strong>Korean cars have become the smart choice for African drivers</strong>. Brands like Hyundai, Kia, and Genesis are not just cheaper alternatives anymore; they are engineering powerhouses building vehicles specifically suited for durability, heat resistance, and rough terrain.</p>
<p>But what exactly makes these vehicles stand out? Beyond the attractive price tags, it comes down to a combination of simplified engineering, readily available parts, and robust suspension systems designed to handle the diverse road conditions found from Lagos to Nairobi.</p>

<h2>Step 1: Choose the Right Vehicle for Your Terrain</h2>
<p>Not all Korean cars are created equal. When importing a vehicle, your first consideration should be the specific environment where you will be driving. City driving in Accra requires a very different machine than cross-country trips in Tanzania.</p>

<h3>Road Conditions and Ground Clearance</h3>
<p>The most critical factor for longevity is how well a car handles unpaved or potholed roads. Korean manufacturers have started tuning the suspension of their export models to be slightly stiffer, which translates to better durability on uneven surfaces.</p>
<p>For rural areas, refrain from low-slung sedans. Instead, opt for <strong>crossovers and SUVs</strong> which naturally offer higher ground clearance. The added height protects the undercarriage from damaging debris and speed bumps that are common on secondary roads.</p>

<div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
  <p class="font-bold text-blue-900 text-lg mb-2">💡 Pro Tip: The Suspension Secret</p>
  <p class="text-blue-800 leading-relaxed">The <strong>Hyundai Santa Fe</strong> and <strong>Kia Sorento</strong> are widely praised for their multi-link rear suspension systems. Unlike rigid axle setups, these systems allow each wheel to move independently, absorbing shocks from potholes much more effectively and keeping your ride smooth.</p>
</div>

<h3>Fuel Availablity and Engine Choice</h3>
<p>Fuel quality varies significantly across the continent. While modern GDI (Gasoline Direct Injection) engines are powerful, they can be sensitive to impure fuel. </p>
<p>For maximum reliability, many African importers prefer the older, naturally aspirated MPI (Multi-Point Injection) engines found in models like the Hyundai Elantra. Alternatively, <strong>Turbo Diesel (CRDi)</strong> engines are excellent for torque and fuel economy, provided you have access to low-sulfur diesel in your region.</p>

<h2>Step 2: Reliability and Maintenance Cost</h2>
<p>One of the biggest fears for any car owner is the unavailability of spare parts. This is where Korean cars truly shine. Because Hyundai and Kia share many platforms and components (part of the Hyundai Motor Group), parts are interchangeable and widely available.</p>

<ul>
  <li><strong>Shared Parts Network:</strong> An oil filter for a Kia Rio likely fits a Hyundai Accent, making stock easy to find.</li>
  <li><strong>Simple Diagnostics:</strong> Korean cars generally use standard OBD-II protocols without simplified proprietary locks, allowing local mechanics to diagnose issues easily.</li>
  <li><strong>Affordable Replacements:</strong> Unlike German luxury cars where a single sensor can cost hundreds of dollars, Korean OEM parts remain budget-friendly.</li>
</ul>

<h2>Step 3: Understanding Import Regulations</h2>
<p>Before you ship your car, you must navigate the complex web of local import laws. Failing to do so can result in your vehicle being seized or incurring massive penalties.</p>

<h3>Nigeria: The 15-Year Rule</h3>
<p>Nigeria enforces strict age limits to prevent the dumping of "end-of-life" vehicles. Currently, you generally cannot import non-commercial vehicles older than 15 years. Additionally, <strong>right-hand drive vehicles are strictly prohibited</strong>, so ensure you suffer sourcing from LHD markets like South Korea, the US, or Europe.</p>

<h3>Kenya: The 8-Year Limit</h3>
<p>Kenya is even stricter with its <strong>8-year age limit</strong>. If a car is even one month older than 8 years from its date of manufacture, it will be denied entry. Furthermore, all vehicles must undergo a pre-export inspection (QISJ) to ensure they are roadworthy and radiation-free.</p>

<h3>Ghana: The Over-Age Penalty</h3>
<p>Ghana allows older cars but penalizes them heavily. While you can import a car older than 10 years, you will pay a significant "over-age penalty" duty. It is often more cost-effective to buy a slightly newer vehicle (e.g., 5-7 years old) to avoid these extra taxes and benefit from better reliability.</p>`,
            cover_image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1000",
            status: "published",
            is_featured: true,
            published_at: new Date().toISOString(),
            tags: ["Guides", "Importing"],
            author_id: authorId,
            seo_title: "Why Korean Cars Are Perfect for African Roads | SK AutoSphere",
            seo_description: "Discover why Korean cars like Hyundai and Kia are ideal for African roads. Learn about durability, parts availability, and import tips.",
            focus_keyword: "Korean cars African roads"
        },
        {
            title: "Top 5 Fuel-Efficient Korean SUVs in 2025",
            slug: "top-5-fuel-efficient-korean-suvs-2025",
            summary: "Save money at the pump without sacrificing power. Here are the top 5 Korean SUVs that offer the best fuel economy for African drivers.",
            content: `<h1>Top 5 Fuel-Efficient Korean SUVs in 2025</h1>
<p>With global fuel prices remaining volatile, "miles per gallon" has become just as important as "horsepower." For African drivers, this is doubly true, where long distances between cities and traffic congestion in urban hubs can drain a tank quickly.</p>
<p>Fortunately, Korean manufacturers have mastered the art of efficient engineering. By utilizing lightweight materials, aerodynamic designs, and advanced hybrid powertrains, they offer SUVs that sip fuel without feeling underpowered. Here is our curated list of the top performers for 2025.</p>

<h2>1. Kia Niro Hybrid: The City Champion</h2>
<p>If your daily life involves navigating the busy streets of Lagos or Nairobi, the <strong>Kia Niro</strong> is unbeatable. It is a dedicated hybrid, meaning it generates its own electricity through braking and coasting—no plug required.</p>
<p>It achieves an astonishing <strong>50+ MPG (4.7L/100km)</strong>. The real magic happens in stop-and-go traffic; the electric motor takes over at low speeds, meaning you burn zero fuel while inching forward in a jam. It's not the largest SUV, but for urban fuel savings, it stands alone.</p>

<h2>2. Hyundai Tucson Diesel (2.0 CRDi)</h2>
<p>For those who do heavy highway driving or carry full loads of passengers and cargo, the Tucson Diesel is the king. The <strong>2.0L CRDi engine</strong> offers massive torque, allowing it to climb hills effortlessly without revving the engine high.</p>

<blockquote>
  <p class="italic text-slate-700">"The Tucson drinks fuel like a bird but runs like a cheetah. We consistently see it achieving over 800km on a single tank during highway cruising." — AutoDaily Africa</p>
</blockquote>

<p>The diesel variant is also renowned for its longevity. These engines are built with stronger blocks to withstand high compression, often lasting 300,000km+ with basic maintenance.</p>

<h2>3. Kia Sportage (Smartstream)</h2>
<p>The all-new Sportage features Kia's "Smartstream" engine technology. This system uses computer-controlled variable valve duration to maximize efficiency in real-time. Whether you are accelerating hard to pass a truck or coasting down a hill, the engine adjusts its breathing to use the minimum amount of fuel necessary.</p>
<p>It strikes the perfect balance between the rugged utility needed for African roads and the futuristic tech desired by modern drivers. The 1.6L Turbo Hybrid option is particularly impressive, offering the power of a V6 with the consumption of a compact car.</p>

<h2>4. Hyundai Kona Electric / Hybrid</h2>
<p>The <strong>Hyundai Kona</strong> is compact, agile, and incredibly efficient. It is perfect for navigating narrow streets and fits into tight parking spaces with ease. While the fully electric version is gaining traction in areas with reliable charging, the Hybrid variant is the volume seller.</p>
<p>Its lightweight chassis means the engine doesn't have to work hard to get it moving. It feels zippy and responsive, making it a fun drive that doesn't punish your wallet at the pump.</p>

<h2>5. Genesis GV70: Luxury Without Guilt</h2>
<p>Who says luxury has to be wasteful? The <strong>Genesis GV70</strong> proves you can have premium leather, advanced safety tech, and a whisper-quiet cabin without achieving single-digit mileage.</p>
<p>Using an advanced 8-speed transmission and aerodynamic streamlining, the GV70 glides through the air with minimal resistance. For the executive who wants to arrive in style but values efficiency, the 2.2L Diesel variant is the ultimate choice.</p>

<h2>Conclusion</h2>
<p>Choosing any of these vehicles ensures you spend less time at the petrol station and more time on the road. The initial investment in a modern, fuel-efficient Korean SUV pays dividends for years in reduced operating costs. <a href="/shop">Check out our latest listings</a> to find your perfect match today!</p>`,
            cover_image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1000",
            status: "published",
            is_featured: false,
            published_at: new Date(Date.now() - 86400000).toISOString(),
            tags: ["Reviews", "SUVs"],
            author_id: authorId,
            seo_title: "Top 5 Fuel-Efficient Korean SUVs in 2025 | SK AutoSphere",
            seo_description: "Find the most fuel-efficient Korean SUVs for 2025. Save on fuel with top picks from Kia and Hyundai suitable for African driving.",
            focus_keyword: "Fuel efficient SUVs"
        }
    ];

    for (const post of samplePosts) {
        const { data: existing } = await supabase
            .from('blog_posts')
            .select('id')
            .eq('slug', post.slug)
            .single();

        if (existing) {
            console.log(`⚠️ Post "${post.title}" already exists. Updating...`);
            const { error } = await supabase
                .from('blog_posts')
                .update(post)
                .eq('slug', post.slug);

            if (error) console.error(`Error updating post: ${error.message}`);
            else console.log(`✅ Updated: ${post.title}`);
        } else {
            const { error } = await supabase
                .from('blog_posts')
                .insert([post]);

            if (error) {
                console.error(`❌ Error creating post "${post.title}":`, error.message);
            } else {
                console.log(`✅ Created: ${post.title}`);
            }
        }
    }
    console.log("✨ Seeding complete!");
}

seedBlogPosts();
