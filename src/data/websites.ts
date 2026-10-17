import type { Website } from "@/lib/types";

/**
 * Hand-curated seed entries. Image fields (screenshots, OG image, favicon) are
 * filled in from `captures.json`, which `npm run capture` generates.
 *
 * To add a website: append an entry here, then run `npm run capture -- <slug>`.
 */
export type WebsiteSeed = Omit<
  Website,
  "id" | "previewImage" | "fullPageImage" | "mobileImage" | "ogImage" | "favicon"
>;

export const websiteSeeds: WebsiteSeed[] = [
  // SaaS
  { slug: "linear", name: "Linear", websiteUrl: "https://linear.app", category: "saas", industry: "Productivity", tags: ["dark", "minimal", "product-shots"], description: "Issue tracking presented with restraint: near-black canvas, precise type and product shots that carry the story.", dateAdded: "2026-10-14", featured: true, viewCount: 48210 },
  { slug: "raycast", name: "Raycast", websiteUrl: "https://www.raycast.com", category: "saas", industry: "Productivity", tags: ["dark", "3d", "product-shots"], description: "A launcher for macOS sold through glossy 3D renders, keyboard motifs and dense, well-organised feature sections.", dateAdded: "2026-10-09", featured: true, viewCount: 31877 },
  { slug: "attio", name: "Attio", websiteUrl: "https://attio.com", category: "saas", industry: "CRM", tags: ["light", "minimal", "product-shots"], description: "A CRM site that leans on soft greys, crisp UI crops and generous spacing to feel calm rather than corporate.", dateAdded: "2026-09-28", featured: false, viewCount: 14520 },
  { slug: "cal", name: "Cal.com", websiteUrl: "https://cal.com", category: "saas", industry: "Scheduling", tags: ["light", "minimal", "bento"], description: "Open-source scheduling explained with a tidy bento grid and a monochrome palette.", dateAdded: "2026-08-19", featured: false, viewCount: 9734 },

  // AI products
  { slug: "perplexity", name: "Perplexity", websiteUrl: "https://www.perplexity.ai", category: "ai-products", industry: "Search", tags: ["minimal", "light"], description: "An answer engine whose homepage is the product itself: one input, quiet typography and nothing else.", dateAdded: "2026-10-12", featured: false, viewCount: 22104 },
  { slug: "runway", name: "Runway", websiteUrl: "https://runwayml.com", category: "ai-products", industry: "Creative Tools", tags: ["dark", "video", "typography"], description: "Generative video tools introduced through full-bleed film stills and cinematic pacing.", dateAdded: "2026-10-05", featured: true, viewCount: 27451 },
  { slug: "elevenlabs", name: "ElevenLabs", websiteUrl: "https://elevenlabs.io", category: "ai-products", industry: "Voice AI", tags: ["light", "minimal"], description: "Voice synthesis made tangible with inline audio demos on a clean, bright layout.", dateAdded: "2026-09-21", featured: false, viewCount: 16390 },
  { slug: "cursor", name: "Cursor", websiteUrl: "https://cursor.com", category: "ai-products", industry: "Developer Tools", tags: ["dark", "product-shots", "minimal"], description: "An AI code editor shown almost entirely through the editor itself, framed with sober typography.", dateAdded: "2026-10-11", featured: true, viewCount: 39820 },
  { slug: "midjourney", name: "Midjourney", websiteUrl: "https://www.midjourney.com", category: "ai-products", industry: "Generative Art", tags: ["dark", "imagery"], description: "A gallery-like front door where generated imagery fills the screen edge to edge.", dateAdded: "2026-07-30", featured: false, viewCount: 18233 },

  // Agency
  { slug: "locomotive", name: "Locomotive", websiteUrl: "https://locomotive.ca", category: "agency", industry: "Digital Agency", tags: ["animation", "scroll-effects", "typography"], description: "The Montreal agency known for smooth scrolling shows it off with big type and choreographed motion.", dateAdded: "2026-09-14", featured: false, viewCount: 12650 },
  { slug: "instrument", name: "Instrument", websiteUrl: "https://www.instrument.com", category: "agency", industry: "Digital Agency", tags: ["video", "typography", "dark"], description: "A Portland agency site built around case-study video and confident, oversized headlines.", dateAdded: "2026-08-02", featured: false, viewCount: 7843 },
  { slug: "fantasy", name: "Fantasy", websiteUrl: "https://fantasy.co", category: "agency", industry: "Product Design", tags: ["dark", "imagery", "typography"], description: "A product design agency that presents speculative and shipped work with cinematic, full-bleed imagery.", dateAdded: "2026-07-18", featured: false, viewCount: 10221 },

  // Portfolio
  { slug: "dennis-snellenberg", name: "Dennis Snellenberg", websiteUrl: "https://dennissnellenberg.com", category: "portfolio", industry: "Freelance Designer", tags: ["typography", "animation", "imagery"], description: "A much-referenced freelance portfolio with magnetic buttons, smooth transitions and oversized type.", dateAdded: "2026-08-25", featured: true, viewCount: 35102 },
  { slug: "rauno", name: "Rauno Freiberg", websiteUrl: "https://rauno.me", category: "portfolio", industry: "Design Engineer", tags: ["minimal", "typography", "light"], description: "A design engineer's index of craft experiments, delivered with meticulous detail and almost no chrome.", dateAdded: "2026-10-02", featured: false, viewCount: 13377 },
  { slug: "lynn-fisher", name: "Lynn Fisher", websiteUrl: "https://lynnandtonic.com", category: "portfolio", industry: "Designer & Developer", tags: ["colorful", "illustration", "playful"], description: "A portfolio that is redesigned every year, each time with a new playful, responsive idea.", dateAdded: "2026-07-09", featured: false, viewCount: 8124 },

  // Personal website
  { slug: "brittany-chiang", name: "Brittany Chiang", websiteUrl: "https://brittanychiang.com", category: "personal-website", industry: "Software Engineer", tags: ["dark", "minimal"], description: "A widely referenced developer site with a fixed intro column and a scrolling record of work.", dateAdded: "2026-09-03", featured: false, viewCount: 19560 },
  { slug: "josh-comeau", name: "Josh W. Comeau", websiteUrl: "https://www.joshwcomeau.com", category: "personal-website", industry: "Educator", tags: ["colorful", "illustration", "playful"], description: "A blog full of whimsical details, interactive demos and delightful micro-interactions.", dateAdded: "2026-08-11", featured: false, viewCount: 15402 },
  { slug: "lee-robinson", name: "Lee Robinson", websiteUrl: "https://leerob.com", category: "personal-website", industry: "Developer", tags: ["minimal", "typography", "light"], description: "A personal site reduced to text and links — fast, legible and confident.", dateAdded: "2026-07-22", featured: false, viewCount: 6930 },

  // E-commerce
  { slug: "ugmonk", name: "Ugmonk", websiteUrl: "https://ugmonk.com", category: "ecommerce", industry: "Desk Goods", tags: ["product-shots", "minimal", "light"], description: "A small studio shop where meticulous product photography and a quiet grid make desk objects feel collectible.", dateAdded: "2026-09-25", featured: true, viewCount: 21876 },
  { slug: "teenage-engineering", name: "Teenage Engineering", websiteUrl: "https://teenage.engineering", category: "ecommerce", industry: "Consumer Electronics", tags: ["product-shots", "minimal", "grid"], description: "Synths and speakers on a stark white grid, where each object reads like a museum piece.", dateAdded: "2026-08-29", featured: false, viewCount: 17045 },
  { slug: "craighill", name: "Craighill", websiteUrl: "https://craighill.co", category: "ecommerce", industry: "Design Objects", tags: ["product-shots", "minimal", "grid"], description: "Machined everyday objects shown on clean backgrounds with precise, catalogue-like layouts.", dateAdded: "2026-07-14", featured: false, viewCount: 5211 },

  // Technology
  { slug: "vercel", name: "Vercel", websiteUrl: "https://vercel.com", category: "technology", industry: "Developer Tools", tags: ["minimal", "grid", "typography"], description: "A developer platform rendered in strict grids, hairline borders and precise Geist typography.", dateAdded: "2026-10-13", featured: true, viewCount: 42716 },
  { slug: "supabase", name: "Supabase", websiteUrl: "https://supabase.com", category: "technology", industry: "Developer Tools", tags: ["dark", "grid", "product-shots"], description: "A backend platform with a signature green accent on deep charcoal and code-heavy sections.", dateAdded: "2026-09-10", featured: false, viewCount: 20188 },
  { slug: "analogue", name: "Analogue", websiteUrl: "https://www.analogue.co", category: "technology", industry: "Gaming Hardware", tags: ["monochrome", "product-shots", "minimal"], description: "Premium game hardware photographed like luxury goods, with a hushed monochrome interface.", dateAdded: "2026-09-17", featured: false, viewCount: 18902 },
  { slug: "playdate", name: "Playdate", websiteUrl: "https://play.date", category: "technology", industry: "Gaming Hardware", tags: ["colorful", "playful", "product-shots"], description: "A tiny handheld console sold with sunny yellow, crank-driven charm and wonderfully odd copywriting.", dateAdded: "2026-07-26", featured: false, viewCount: 6604 },

  // Landing page
  { slug: "arc", name: "Arc", websiteUrl: "https://arc.net", category: "landing-page", industry: "Browser", tags: ["colorful", "illustration", "playful"], description: "A browser launch page full of personality: hand-drawn touches, warm colour and clever motion.", dateAdded: "2026-09-30", featured: false, viewCount: 24310 },
  { slug: "pitch", name: "Pitch", websiteUrl: "https://pitch.com", category: "landing-page", industry: "Presentation Software", tags: ["colorful", "product-shots"], description: "Presentation software sold with saturated colour blocks and slides that animate into place.", dateAdded: "2026-08-07", featured: false, viewCount: 9015 },
  { slug: "framer", name: "Framer", websiteUrl: "https://www.framer.com", category: "landing-page", industry: "Website Builder", tags: ["dark", "animation", "product-shots"], description: "A site builder that demonstrates itself with fluid scroll-driven animation on black.", dateAdded: "2026-10-07", featured: true, viewCount: 30440 },

  // Startup
  { slug: "resend", name: "Resend", websiteUrl: "https://resend.com", category: "startup", industry: "Developer Tools", tags: ["dark", "minimal", "typography"], description: "Email for developers, framed in deep black with luminous 3D accents and elegant code samples.", dateAdded: "2026-10-03", featured: false, viewCount: 17680 },
  { slug: "superhuman", name: "Superhuman", websiteUrl: "https://superhuman.com", category: "startup", industry: "Email", tags: ["dark", "imagery", "typography"], description: "Premium email positioned with cinematic imagery and a refined, high-contrast palette.", dateAdded: "2026-08-15", featured: false, viewCount: 11205 },
  { slug: "clerk", name: "Clerk", websiteUrl: "https://clerk.com", category: "startup", industry: "Authentication", tags: ["light", "product-shots", "minimal"], description: "Authentication for developers sold with crisp component demos, soft purple accents and tidy code samples.", dateAdded: "2026-10-10", featured: false, viewCount: 12980 },

  // Architecture
  { slug: "big", name: "BIG", websiteUrl: "https://big.dk", category: "architecture", industry: "Architecture Firm", tags: ["minimal", "grid", "imagery"], description: "Bjarke Ingels Group lays out its projects as a dense, sortable visual index.", dateAdded: "2026-09-07", featured: false, viewCount: 7790 },
  { slug: "snohetta", name: "Snøhetta", websiteUrl: "https://www.snohetta.com", category: "architecture", industry: "Architecture Firm", tags: ["imagery", "minimal"], description: "Large-format project photography with quiet navigation that never competes with the buildings.", dateAdded: "2026-08-21", featured: false, viewCount: 5436 },
  { slug: "oma", name: "OMA", websiteUrl: "https://www.oma.com", category: "architecture", industry: "Architecture Firm", tags: ["imagery", "monochrome", "grid"], description: "Rem Koolhaas’s office catalogues decades of projects in a stark, archive-like interface.", dateAdded: "2026-07-05", featured: false, viewCount: 6158 },

  // Photography
  { slug: "magnum", name: "Magnum Photos", websiteUrl: "https://www.magnumphotos.com", category: "photography", industry: "Photo Agency", tags: ["imagery", "editorial-layout"], description: "The photo cooperative's site balances iconic imagery with magazine-style storytelling.", dateAdded: "2026-08-04", featured: false, viewCount: 6820 },
  { slug: "unsplash", name: "Unsplash", websiteUrl: "https://unsplash.com", category: "photography", industry: "Stock Photography", tags: ["imagery", "grid", "light"], description: "A masonry grid of free photography with search front and centre.", dateAdded: "2026-07-12", featured: false, viewCount: 9301 },

  // Fashion
  { slug: "studio-nicholson", name: "Studio Nicholson", websiteUrl: "https://www.studionicholson.com", category: "fashion", industry: "Fashion Label", tags: ["imagery", "minimal"], description: "Architectural tailoring presented with soft-toned imagery and an exceptionally restrained interface.", dateAdded: "2026-09-19", featured: false, viewCount: 13990 },
  { slug: "aime-leon-dore", name: "Aimé Leon Dore", websiteUrl: "https://www.aimeleondore.com", category: "fashion", industry: "Menswear", tags: ["imagery", "serif", "editorial-layout"], description: "Queens-born menswear told through nostalgic campaign photography and a classic serif voice.", dateAdded: "2026-08-27", featured: false, viewCount: 8473 },
  { slug: "acne-studios", name: "Acne Studios", websiteUrl: "https://www.acnestudios.com", category: "fashion", industry: "Fashion House", tags: ["imagery", "minimal"], description: "Stockholm minimalism: big campaign visuals, light type and plenty of empty space.", dateAdded: "2026-07-20", featured: false, viewCount: 5990 },

  // Editorial
  { slug: "the-verge", name: "The Verge", websiteUrl: "https://www.theverge.com", category: "editorial", industry: "Tech News", tags: ["colorful", "typography", "editorial-layout"], description: "A tech publication with an expressive, high-contrast system and a bold storystream layout.", dateAdded: "2026-09-12", featured: false, viewCount: 10855 },
  { slug: "its-nice-that", name: "It's Nice That", websiteUrl: "https://www.itsnicethat.com", category: "editorial", industry: "Creative Publishing", tags: ["typography", "grid", "imagery"], description: "A creative-industry magazine where a disciplined grid lets featured work stay centre stage.", dateAdded: "2026-08-09", featured: false, viewCount: 7317 },
  { slug: "the-pudding", name: "The Pudding", websiteUrl: "https://pudding.cool", category: "editorial", industry: "Data Journalism", tags: ["illustration", "colorful", "playful"], description: "Visual essays that turn data into playful, scrollable stories.", dateAdded: "2026-09-26", featured: true, viewCount: 16044 },

  // Education
  { slug: "brilliant", name: "Brilliant", websiteUrl: "https://brilliant.org", category: "education", industry: "Interactive Learning", tags: ["illustration", "light", "playful"], description: "Interactive STEM lessons sold through tactile illustration and bright, friendly UI.", dateAdded: "2026-09-05", featured: false, viewCount: 8212 },
  { slug: "duolingo", name: "Duolingo", websiteUrl: "https://www.duolingo.com", category: "education", industry: "Language Learning", tags: ["colorful", "illustration", "playful"], description: "Unmistakable brand character: rounded type, saturated green and a mascot with opinions.", dateAdded: "2026-07-28", featured: false, viewCount: 11720 },
  { slug: "learning-music", name: "Learning Music", websiteUrl: "https://learningmusic.ableton.com", category: "education", industry: "Music Education", tags: ["colorful", "playful", "illustration"], description: "Ableton’s free course teaches music fundamentals with interactive, colourful step sequencers in the browser.", dateAdded: "2026-07-03", featured: false, viewCount: 4880 },

  // Finance
  { slug: "stripe", name: "Stripe", websiteUrl: "https://stripe.com", category: "finance", industry: "Payments", tags: ["colorful", "animation", "typography"], description: "The benchmark for fintech sites: flowing colour, precise grids and documentation-grade clarity.", dateAdded: "2026-10-08", featured: true, viewCount: 45930 },
  { slug: "mercury", name: "Mercury", websiteUrl: "https://mercury.com", category: "finance", industry: "Banking", tags: ["serif", "imagery", "light"], description: "Banking for startups with an elegant serif voice and atmospheric photography.", dateAdded: "2026-09-23", featured: false, viewCount: 19312 },
  { slug: "ramp", name: "Ramp", websiteUrl: "https://ramp.com", category: "finance", industry: "Spend Management", tags: ["light", "product-shots", "typography"], description: "Finance automation sold with crisp product UI, bold numbers and a sharp yellow accent.", dateAdded: "2026-08-31", featured: false, viewCount: 9988 },
  { slug: "wise", name: "Wise", websiteUrl: "https://wise.com", category: "finance", industry: "Money Transfer", tags: ["colorful", "typography"], description: "International money transfer with heavy display type and a signature bright-green identity.", dateAdded: "2026-07-16", featured: false, viewCount: 7105 },

  // Web3
  { slug: "uniswap", name: "Uniswap", websiteUrl: "https://uniswap.org", category: "web3", industry: "DeFi", tags: ["colorful", "minimal"], description: "A decentralised exchange with a soft pink identity and a remarkably simple swap interface.", dateAdded: "2026-08-17", featured: false, viewCount: 8540 },
  { slug: "rainbow", name: "Rainbow", websiteUrl: "https://rainbow.me", category: "web3", industry: "Wallet", tags: ["colorful", "3d", "playful"], description: "A crypto wallet that feels like a toy, with glossy 3D and joyful gradients of colour.", dateAdded: "2026-09-01", featured: false, viewCount: 6377 },
  { slug: "base", name: "Base", websiteUrl: "https://www.base.org", category: "web3", industry: "Blockchain Network", tags: ["minimal", "typography", "colorful"], description: "An onchain network with a confident blue square and a crisp, grid-based editorial system.", dateAdded: "2026-07-24", featured: false, viewCount: 4512 },
  { slug: "phantom", name: "Phantom", websiteUrl: "https://phantom.com", category: "web3", industry: "Wallet", tags: ["colorful", "illustration"], description: "A friendly purple wallet brand with a charming ghost mascot and rounded forms.", dateAdded: "2026-09-08", featured: false, viewCount: 7240 },

  // Creative studio
  { slug: "pentagram", name: "Pentagram", websiteUrl: "https://www.pentagram.com", category: "creative-studio", industry: "Design Studio", tags: ["grid", "imagery", "minimal"], description: "The world's largest independent design consultancy, presented as an endless, rigorous grid of work.", dateAdded: "2026-10-06", featured: true, viewCount: 20974 },
  { slug: "studio-dumbar", name: "Studio Dumbar", websiteUrl: "https://studiodumbar.com", category: "creative-studio", industry: "Brand Studio", tags: ["colorful", "typography", "animation"], description: "A Rotterdam studio famous for motion-led identities, presented with bold colour and kinetic type.", dateAdded: "2026-09-16", featured: false, viewCount: 9877 },
  { slug: "collins", name: "COLLINS", websiteUrl: "https://www.wearecollins.com", category: "creative-studio", industry: "Brand Studio", tags: ["typography", "imagery"], description: "A brand consultancy that lets bold case-study imagery and big statements lead.", dateAdded: "2026-08-23", featured: false, viewCount: 6714 },
  { slug: "darkroom", name: "darkroom.engineering", websiteUrl: "https://darkroom.engineering", category: "creative-studio", industry: "Creative Engineering", tags: ["dark", "typography", "animation"], description: "A studio of creative developers showing off buttery motion and confident dark typography.", dateAdded: "2026-10-04", featured: false, viewCount: 11498 },

  // Mobile apps
  { slug: "things", name: "Things 3", websiteUrl: "https://culturedcode.com/things/", category: "mobile-apps", industry: "Productivity", tags: ["light", "product-shots", "minimal"], description: "An award-winning to-do app shown through pristine device renders and careful copywriting.", dateAdded: "2026-09-02", featured: false, viewCount: 10345 },
  { slug: "flighty", name: "Flighty", websiteUrl: "https://flighty.com", category: "mobile-apps", industry: "Travel", tags: ["dark", "product-shots"], description: "A flight tracker presented with airport-board aesthetics and crisp iPhone mockups.", dateAdded: "2026-09-29", featured: false, viewCount: 12122 },
  { slug: "halide", name: "Halide", websiteUrl: "https://halide.cam", category: "mobile-apps", industry: "Photography", tags: ["dark", "product-shots", "typography"], description: "A pro camera app with tactile, hardware-inspired visuals and editorial confidence.", dateAdded: "2026-08-13", featured: false, viewCount: 8806 },
  { slug: "opal", name: "Opal", websiteUrl: "https://www.opal.so", category: "mobile-apps", industry: "Wellbeing", tags: ["dark", "3d", "imagery"], description: "A screen-time app framed with luminous gemstone renders on a deep, calm background.", dateAdded: "2026-07-07", featured: false, viewCount: 5677 },
];
