export type ServiceProcessStep = { label: string; title: string; body: string };
export type ServiceCapability = { title: string; body: string };
export type Service = {
  slug: string; num: string; pillar: string; title: string; hook: string; tagline: string;
  accent: string; summary: string; heroBody: string[]; bullets: string[];
  capabilities: ServiceCapability[]; whenYouNeedThis: string[]; process: ServiceProcessStep[];
  deliverables: string[]; relatedDemos: string[]; faqs?: { q: string; a: string }[];
  metaTitle: string; metaDescription: string;
};
export type Pillar = { slug: string; title: string; accent: string; blurb: string };

export const pillars: Pillar[] = [
  {
    "slug": "web-development",
    "title": "Web Development",
    "accent": "#FF6A3D",
    "blurb": "Fast, beautiful websites — from simple to cinematic 3D."
  },
  {
    "slug": "software",
    "title": "Software Development",
    "accent": "#0FA598",
    "blurb": "Custom software that runs your business, your way."
  },
  {
    "slug": "digital-marketing",
    "title": "Digital Marketing",
    "accent": "#F5A524",
    "blurb": "Get found and get chosen — SEO, ads, and social that pay off."
  },
  {
    "slug": "creative-content",
    "title": "Creative Content",
    "accent": "#E85D9A",
    "blurb": "Words, posts, and video that sound like you."
  },
  {
    "slug": "creative-design",
    "title": "Creative Design",
    "accent": "#7B6EF6",
    "blurb": "Design people just get, and love to look at."
  },
  {
    "slug": "ai-automation",
    "title": "AI & Automation",
    "accent": "#2FBF71",
    "blurb": "Your always-on teammate — automations and AI agents."
  }
];

export const services: Service[] = [
  {
    "slug": "website-development",
    "num": "01",
    "pillar": "Web Development",
    "title": "Website Development",
    "hook": "A website that finally feels like you.",
    "tagline": "Fast, beautiful sites built from scratch to fit your business and make the next step obvious.",
    "accent": "#FF6A3D",
    "summary": "Custom-built websites that look premium, load quickly, and turn curious visitors into people who reach out.",
    "heroBody": [
      "Your website is often the first real impression someone gets of you, so it should feel warm, clear, and genuinely yours. We design and build sites from the ground up around what you actually do and who you're trying to reach, then make every page easy to move through.",
      "No bloated templates or clunky page-builders. You get clean, hand-built code that's quick, tidy, and easy to grow into. And because you own everything we make, you're never locked in or left guessing how it works."
    ],
    "bullets": [
      "Custom design",
      "Hand-built code",
      "Mobile-first",
      "You own it"
    ],
    "capabilities": [
      {
        "title": "Design that fits you",
        "body": "We shape the look around your brand and your customers, not a stock template. It feels considered, calm, and unmistakably yours."
      },
      {
        "title": "Clean, fast code",
        "body": "Every site is hand-built to be quick and reliable, so pages open in a blink and search engines are happy too."
      },
      {
        "title": "Great on every screen",
        "body": "Your site looks and works beautifully on phones, tablets, and big monitors, because that's where your visitors actually are."
      },
      {
        "title": "Easy to update yourself",
        "body": "We wire up a friendly editor so you can tweak words and images whenever you like, without calling a developer."
      },
      {
        "title": "Built to be found",
        "body": "Solid structure, sensible metadata, and speed baked in from day one give you a real head start on Google."
      },
      {
        "title": "Room to grow",
        "body": "We build with the future in mind, so adding pages, features, or a shop later feels simple instead of scary."
      }
    ],
    "whenYouNeedThis": [
      "You've outgrown a DIY site and want something that feels professional.",
      "Your current site is slow, dated, or a pain to update.",
      "You're starting something new and want to launch it properly.",
      "You want a site that reflects how good your work actually is.",
      "You'd like a senior team to handle it, not a faceless factory."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Get to know you",
        "body": "We learn your goals, your customers, and your brand, then agree on the pages and the story each one needs to tell."
      },
      {
        "label": "Week 2-3",
        "title": "Design the look",
        "body": "We design the key pages together and refine them with you until the feel is right, before a line of code is written."
      },
      {
        "label": "Week 4-5",
        "title": "Build it properly",
        "body": "We hand-build the site with clean code, connect the editor, and test it thoroughly on every screen."
      },
      {
        "label": "Week 6",
        "title": "Launch & hand over",
        "body": "We go live, show you how everything works, and hand you the keys so you're fully in control."
      }
    ],
    "deliverables": [
      "A custom-designed, hand-built website",
      "Mobile, tablet, and desktop layouts",
      "An easy content editor you can use",
      "Search-friendly structure and metadata",
      "Contact forms and enquiry routing",
      "Full ownership of your code and files"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to build a custom website?",
        "a": "Most of our custom sites go from first conversation to launch in around six weeks. We spend the early weeks getting to know you and designing the key pages together, then build, test on every screen, and hand you the keys."
      },
      {
        "q": "How much does a custom website cost?",
        "a": "Every website is quoted to what you actually need, and we agree one clear fixed price up front, with no retainers and no surprises later. The best way to get a real estimate is a free call, where we can talk through your goals and give you an honest number."
      },
      {
        "q": "Will I own my website and be able to edit it myself?",
        "a": "Yes, you fully own all the code and files we create, so you're never locked in. We also wire up a friendly editor so you can update words and images whenever you like, without needing to call a developer."
      },
      {
        "q": "Do you use templates or WordPress page-builders?",
        "a": "No, we hand-build every site with clean, custom code rather than bloated templates or clunky page-builders. That keeps your pages fast and tidy, and makes it simple to add pages or features as you grow."
      },
      {
        "q": "Will my website work well on mobile and rank on Google?",
        "a": "Absolutely. We design mobile-first so it looks and works beautifully on phones, tablets, and big monitors, and we bake in a solid structure, sensible metadata, and speed to give you a real head start on search."
      }
    ],
    "metaTitle": "Website Development — Custom Sites Built for You · Brandivibe",
    "metaDescription": "Friendly, senior-built websites designed around your business. Fast, custom-coded, mobile-first sites you fully own, launched in around six weeks."
  },
  {
    "slug": "ecommerce-website",
    "num": "02",
    "pillar": "Web Development",
    "title": "E-commerce Websites",
    "hook": "An online shop people love to buy from.",
    "tagline": "Smooth, trustworthy stores that make browsing a pleasure and checkout effortless.",
    "accent": "#FF6A3D",
    "summary": "Custom e-commerce sites built to show off your products, build trust, and turn visits into orders you can count on.",
    "heroBody": [
      "Selling online should feel as good as your product deserves. We build shops that make browsing enjoyable, show your products at their best, and guide people to checkout without a single confusing step along the way.",
      "From the first tap to the thank-you page, we sweat the small details that quietly grow your sales: fast pages, clear pricing, honest shipping, and a checkout that just works. And it all stays easy for you to run day to day."
    ],
    "bullets": [
      "Custom storefront",
      "Simple checkout",
      "Payments & shipping",
      "Easy to manage"
    ],
    "capabilities": [
      {
        "title": "Products that shine",
        "body": "We design product pages that make people want to buy, with clear photos, honest details, and gentle nudges toward the cart."
      },
      {
        "title": "Checkout that just works",
        "body": "A short, reassuring checkout with the payment options people expect, so fewer carts get abandoned at the finish line."
      },
      {
        "title": "Payments made painless",
        "body": "We connect trusted gateways like Stripe and PayPal so money lands safely and you never touch a tangle of settings."
      },
      {
        "title": "Shipping sorted",
        "body": "Clear rates, zones, and options set up properly, so customers know exactly what they'll pay before they commit."
      },
      {
        "title": "Run it with ease",
        "body": "Adding products, updating stock, and processing orders is genuinely simple, even on a busy day."
      },
      {
        "title": "Built to convert",
        "body": "Fast pages, mobile-first design, and thoughtful trust signals all work together to turn browsers into buyers."
      }
    ],
    "whenYouNeedThis": [
      "You're ready to start selling your products online.",
      "Your current shop is clunky and losing you sales.",
      "You want a store that matches the quality of your brand.",
      "You'd like managing orders and stock to feel effortless.",
      "You want something built to grow as your range does."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Understand your range",
        "body": "We learn your products, margins, and customers, then map how people will find, choose, and buy from you."
      },
      {
        "label": "Week 2-3",
        "title": "Design the shopping journey",
        "body": "We design the storefront, product pages, and checkout, refining each one with you until it feels effortless."
      },
      {
        "label": "Week 4-5",
        "title": "Build & connect",
        "body": "We build the store, wire up payments and shipping, load your products, and test every order path end to end."
      },
      {
        "label": "Week 6",
        "title": "Launch & train you",
        "body": "We go live, walk you through managing orders and stock, and make sure you feel confident running it."
      }
    ],
    "deliverables": [
      "A custom-built online store",
      "Product pages and category browsing",
      "Secure payment gateway integration",
      "Shipping rates and options configured",
      "An order and stock dashboard",
      "A quick training session and handover"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to build an online store?",
        "a": "A custom store typically takes around six weeks, from learning your products to launch day. We design the storefront and checkout with you, wire up payments and shipping, load your products, and test every order path before going live."
      },
      {
        "q": "How much does an e-commerce website cost?",
        "a": "We quote each store to your range and the way you want to sell, then agree one fixed price up front, with no retainers and no surprises. A free call is the easiest way to get a real estimate for your shop."
      },
      {
        "q": "Which payment options can you set up for my shop?",
        "a": "We connect trusted gateways like Stripe and PayPal so money lands safely and you never have to wrestle with a tangle of settings. You get a short, reassuring checkout with the payment options your customers already expect."
      },
      {
        "q": "Is it easy to manage products, stock, and orders myself?",
        "a": "Yes, adding products, updating stock, and processing orders is genuinely simple, even on a busy day. We give you an order and stock dashboard and walk you through it in a training session so you feel confident running it."
      },
      {
        "q": "Can you set up shipping rates and delivery options?",
        "a": "We do, with clear rates, zones, and options set up properly so customers know exactly what they'll pay before they commit. It's all part of making browsing enjoyable and checkout effortless."
      }
    ],
    "metaTitle": "E-commerce Websites — Shops People Love to Buy · Brandivibe",
    "metaDescription": "Custom online stores built to sell. Beautiful product pages, smooth checkout, payments and shipping sorted, and an easy dashboard you fully own."
  },
  {
    "slug": "webgl-3d-experiences",
    "num": "03",
    "pillar": "Web Development",
    "title": "WebGL & 3D Experiences",
    "hook": "Give people something they'll remember.",
    "tagline": "Cinematic, interactive 3D experiences that make your brand feel alive right in the browser.",
    "accent": "#FF6A3D",
    "summary": "Our signature work: immersive WebGL and 3D sites that move, react, and leave a lasting impression, no app or headset needed.",
    "heroBody": [
      "Some brands deserve more than a flat page. This is where we love to play: cinematic 3D scenes, interactive product spins, and scroll-driven stories that unfold as people move through them, all running smoothly right in the browser.",
      "It's our signature craft, and it's not just for show. When someone can turn your product in their hands, drift through a scene, or watch a page come alive, they stay longer, feel more, and remember you. We make that magic feel effortless and fast."
    ],
    "bullets": [
      "Interactive 3D",
      "Cinematic scroll",
      "Product configurators",
      "Smooth & fast"
    ],
    "capabilities": [
      {
        "title": "Cinematic 3D scenes",
        "body": "We craft rich, atmospheric worlds in the browser using Three.js and WebGL, the kind of thing that makes people say wow out loud."
      },
      {
        "title": "Interactive product spins",
        "body": "Let people rotate, explore, and customise your product in real time, so they connect with it before they ever own it."
      },
      {
        "title": "Scroll-driven stories",
        "body": "Scenes that animate and reveal as visitors scroll, turning your page into an experience they actually want to finish."
      },
      {
        "title": "Product configurators",
        "body": "Colours, options, and combinations updating live in 3D, so customers can build exactly what they want and love the result."
      },
      {
        "title": "Buttery performance",
        "body": "We obsess over frame rates and load times so it all feels silky, even on a phone, never heavy or janky."
      },
      {
        "title": "Purpose, not just polish",
        "body": "Every effect earns its place by guiding attention, telling your story, or helping someone decide to buy."
      }
    ],
    "whenYouNeedThis": [
      "You want a launch or landing page people can't stop talking about.",
      "Your product deserves to be seen in glorious, interactive 3D.",
      "You'd love visitors to explore and customise before buying.",
      "You want to stand out and feel genuinely premium.",
      "You're ready for something more memorable than a standard site."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Dream it up",
        "body": "We explore the idea together, sketch the experience, and agree on the moments that will make people lean in and stay."
      },
      {
        "label": "Week 2-3",
        "title": "Prototype the magic",
        "body": "We build early interactive prototypes so you can feel the movement and interaction before we polish anything."
      },
      {
        "label": "Week 4-5",
        "title": "Build & refine",
        "body": "We craft the final 3D scenes, tune every interaction, and optimise hard so it runs beautifully on every device."
      },
      {
        "label": "Week 6",
        "title": "Polish & launch",
        "body": "We add the finishing touches, test across devices, and launch an experience that feels genuinely special."
      }
    ],
    "deliverables": [
      "A custom interactive 3D or WebGL experience",
      "Optimised assets that load fast",
      "Scroll or click-driven animations",
      "Product spins or a live configurator, where fitting",
      "Smooth performance tuned for mobile",
      "Full ownership of the code and 3D assets"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does a WebGL or 3D website take to build?",
        "a": "These experiences usually take around six weeks. We start by dreaming up the idea and building interactive prototypes so you can feel the movement early, then craft the final scenes, tune every interaction, and optimise hard before launch."
      },
      {
        "q": "How much does a 3D or WebGL website cost?",
        "a": "Because every 3D experience is different, we quote it to your idea and agree one clear fixed price up front, with no retainers and no surprises. A free call is the best way to explore what you have in mind and get a real estimate."
      },
      {
        "q": "Do people need an app or headset to view the 3D experience?",
        "a": "Not at all. Everything runs smoothly right in the browser, so there's no app to download and no headset needed. Visitors just open your page and the scenes, spins, and animations come to life."
      },
      {
        "q": "Will a 3D site still run fast, even on phones?",
        "a": "Yes, we obsess over frame rates and load times so it all feels silky, even on a phone, never heavy or janky. We optimise the assets to load fast and tune the performance for mobile specifically."
      },
      {
        "q": "Can customers spin or customise my product in 3D before they buy?",
        "a": "They can. We build interactive product spins and live configurators where colours and options update in real time, so people connect with your product and build exactly what they want before they own it."
      },
      {
        "q": "Do I own the 3D assets and code you create?",
        "a": "Yes, you get full ownership of the code and the 3D assets we make for you, so it's genuinely yours to keep and build on."
      }
    ],
    "metaTitle": "WebGL & 3D Experiences — Cinematic & Interactive · Brandivibe",
    "metaDescription": "Our signature craft: immersive WebGL and 3D web experiences. Cinematic scenes, product spins, and scroll stories that feel premium and run fast."
  },
  {
    "slug": "website-maintenance",
    "num": "04",
    "pillar": "Web Development",
    "title": "Website Maintenance & Care",
    "hook": "Relax, your website's in good hands.",
    "tagline": "Ongoing care that keeps your site fast, safe, and up to date, so you never have to think about it.",
    "accent": "#FF6A3D",
    "summary": "Friendly, proactive maintenance that keeps your website healthy, secure, and running smoothly month after month.",
    "heroBody": [
      "A website isn't a build-it-and-forget-it thing, it needs a little looking after to stay quick, secure, and reliable. We quietly handle all of that in the background, so your site keeps doing its job while you get on with yours.",
      "Updates, backups, security, small tweaks, and a real person to call when you need one. No cryptic tickets or long waits. Just steady, senior care and the peace of mind that someone's always watching over things."
    ],
    "bullets": [
      "Updates & backups",
      "Security watch",
      "Small tweaks",
      "A person to call"
    ],
    "capabilities": [
      {
        "title": "Regular updates",
        "body": "We keep your site's software current so it stays secure and fast, and we handle it carefully so nothing ever breaks."
      },
      {
        "title": "Safe backups",
        "body": "Automatic backups mean that if anything ever goes wrong, we can roll things back in minutes, not days."
      },
      {
        "title": "Security watch",
        "body": "We keep an eye out for threats and patch things quickly, so you're protected without lifting a finger."
      },
      {
        "title": "Small tweaks included",
        "body": "Need to swap an image, update some words, or add a page? Your plan covers those little jobs without extra fuss."
      },
      {
        "title": "Uptime monitoring",
        "body": "We're alerted the moment your site has a hiccup and jump on it, often before you'd even notice."
      },
      {
        "title": "A friendly human",
        "body": "When you need help, you reach a senior person who knows your site, not a queue or a chatbot."
      }
    ],
    "whenYouNeedThis": [
      "You'd rather not worry about updates and security yourself.",
      "You want a person to call when something needs changing.",
      "Your site is important and you can't afford it going down.",
      "You keep meaning to make small tweaks but never find the time.",
      "You want peace of mind that your site is in safe hands."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Health check",
        "body": "We review your site top to bottom, sort any lurking issues, and set up backups and monitoring properly."
      },
      {
        "label": "Ongoing",
        "title": "Keep it healthy",
        "body": "We handle updates, security, and backups on a steady schedule so your site stays fast and safe."
      },
      {
        "label": "Anytime",
        "title": "Handle your tweaks",
        "body": "Send us the small changes you need and we take care of them promptly, no drama, no waiting around."
      },
      {
        "label": "Monthly",
        "title": "Check in",
        "body": "A short, plain-English update on what we did and how your site is doing, so you always feel in the loop."
      }
    ],
    "deliverables": [
      "Regular software and plugin updates",
      "Automatic, tested backups",
      "Security monitoring and patching",
      "Uptime monitoring with fast response",
      "A set allowance of small content tweaks",
      "A plain-English monthly care report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What does a website maintenance plan actually include?",
        "a": "We handle regular software updates, automatic tested backups, security monitoring and patching, and uptime monitoring so we catch hiccups fast. You also get an allowance of small content tweaks and a plain-English monthly report on how your site is doing."
      },
      {
        "q": "How much does website maintenance cost?",
        "a": "Your care plan is priced around your site and what it needs, with a clear amount agreed up front and no surprises. The easiest way to get a real figure is a free call where we can look at your site together."
      },
      {
        "q": "How quickly will you respond when I need a change or something breaks?",
        "a": "When you need help, you reach a senior person who knows your site, not a queue or a chatbot, and we take care of small tweaks promptly. We're also alerted the moment your site has a hiccup and often jump on it before you'd even notice."
      },
      {
        "q": "Are small content changes included in my plan?",
        "a": "Yes, your plan includes a set allowance of little jobs like swapping an image, updating some words, or adding a page, without extra fuss. Just send them over and we'll handle them."
      },
      {
        "q": "What happens if my website goes down or an update breaks something?",
        "a": "We keep automatic backups, so if anything ever goes wrong we can roll things back in minutes, not days. With uptime monitoring and careful updates, we work to keep problems from reaching you in the first place."
      }
    ],
    "metaTitle": "Website Maintenance & Care — Safe & Sorted · Brandivibe",
    "metaDescription": "Friendly, senior website maintenance. Updates, backups, security, monitoring, and small tweaks handled for you, plus a real person to call anytime."
  },
  {
    "slug": "website-speed-optimization",
    "num": "05",
    "pillar": "Web Development",
    "title": "Website Speed Optimization",
    "hook": "Make your site feel wonderfully quick.",
    "tagline": "We find what's slowing your site down and fix it, so pages load fast and visitors stick around.",
    "accent": "#FF6A3D",
    "summary": "A thorough speed tune-up that makes your existing site load faster, feel smoother, and please both visitors and Google.",
    "heroBody": [
      "A slow site quietly costs you, people leave before they even see what you offer. The good news is that speed is fixable, and often the wins are bigger than you'd expect. We dig into what's dragging your site down and make it feel light and instant.",
      "We measure everything properly, fix the real bottlenecks, and show you the before-and-after in plain numbers. Faster pages mean happier visitors, better Google scores, and more of them staying long enough to become customers."
    ],
    "bullets": [
      "Core Web Vitals",
      "Image & code fixes",
      "Faster loading",
      "Real before/after"
    ],
    "capabilities": [
      {
        "title": "A proper diagnosis",
        "body": "We measure your site with real tools to find exactly what's slow, so we fix the true causes, not just the symptoms."
      },
      {
        "title": "Lighter images",
        "body": "Images are often the biggest culprit. We compress and modernise them so pages feel instant without losing quality."
      },
      {
        "title": "Leaner code",
        "body": "We trim, combine, and defer scripts and styles so your browser has far less to chew through on every visit."
      },
      {
        "title": "Smart caching",
        "body": "We set up caching and delivery so returning visitors get near-instant loads and your server breathes easier."
      },
      {
        "title": "Core Web Vitals",
        "body": "We tune the exact metrics Google measures, so your site scores well and gets the ranking boost that follows."
      },
      {
        "title": "Proof it worked",
        "body": "You get clear before-and-after numbers, so you can actually see the difference we made, not just take our word for it."
      }
    ],
    "whenYouNeedThis": [
      "Your site feels sluggish and you know it's costing you.",
      "Google is flagging your speed or Core Web Vitals.",
      "Visitors leave before your pages finish loading.",
      "Your site got heavier over time and needs a tune-up.",
      "You want faster pages without rebuilding from scratch."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Measure everything",
        "body": "We test your site thoroughly and pinpoint exactly what's slowing it down, from images to scripts to server settings."
      },
      {
        "label": "Week 1-2",
        "title": "Fix the big wins",
        "body": "We tackle the heaviest culprits first, images, code, and caching, for the fastest, most noticeable improvements."
      },
      {
        "label": "Week 2",
        "title": "Fine-tune",
        "body": "We polish the details, chase down the remaining Core Web Vitals, and make sure nothing broke along the way."
      },
      {
        "label": "Wrap-up",
        "title": "Show the results",
        "body": "We hand you clear before-and-after numbers and a short list of anything worth keeping an eye on."
      }
    ],
    "deliverables": [
      "A full speed and performance audit",
      "Optimised, modern-format images",
      "Trimmed and deferred scripts and styles",
      "Caching and delivery set up properly",
      "Improved Core Web Vitals scores",
      "A clear before-and-after report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does website speed optimization take?",
        "a": "A speed tune-up usually takes around two weeks. We measure everything in the first week, fix the biggest culprits like images, code, and caching, then fine-tune the details and hand you clear before-and-after numbers."
      },
      {
        "q": "How much does it cost to speed up my website?",
        "a": "We quote each tune-up to your site and what's actually slowing it down, then agree one fixed price up front with no surprises. A free call is the best way to get a real estimate for your project."
      },
      {
        "q": "Do you have to rebuild my site to make it faster?",
        "a": "No, this makes your existing site faster without rebuilding from scratch. We diagnose the real bottlenecks and fix them in place, so you keep the site you have, just lighter and quicker."
      },
      {
        "q": "Will you actually show me proof that my site got faster?",
        "a": "Yes, you get clear before-and-after numbers so you can see the difference, not just take our word for it. We measure with real tools before we start and again when we're done."
      },
      {
        "q": "Can you fix my Core Web Vitals and help my Google scores?",
        "a": "That's a core part of what we do. We tune the exact metrics Google measures, so your site scores well and gets the ranking boost that tends to follow, alongside happier visitors who stick around."
      }
    ],
    "metaTitle": "Website Speed Optimization — Fast, Snappy Pages · Brandivibe",
    "metaDescription": "Make your site load fast. We diagnose the real slowdowns, fix images, code and caching, boost Core Web Vitals, and prove it with before-and-after numbers."
  },
  {
    "slug": "crm",
    "num": "01",
    "pillar": "Software Development",
    "title": "CRM Systems",
    "hook": "Every customer, remembered in one place.",
    "tagline": "A CRM built around how your team actually sells, not a template you have to bend to.",
    "accent": "#0FA598",
    "summary": "Custom CRM software that keeps your leads, deals, and customer history tidy and easy to act on.",
    "heroBody": [
      "Right now your customer details probably live in a few spreadsheets, someone's inbox, and a couple of heads on the team. That works until it doesn't. We build you a CRM that gathers all of it into one calm place, so nothing slips and everyone knows exactly where each relationship stands.",
      "It's shaped around your sales flow, not a rigid off-the-shelf tool. Log a call, move a deal, follow up on time, and see the whole picture at a glance. Your team gets less admin and more selling, and you finally own the software that runs your customer relationships."
    ],
    "bullets": [
      "Lead & deal pipelines",
      "Full contact history",
      "Follow-up reminders",
      "Clear reporting"
    ],
    "capabilities": [
      {
        "title": "Pipelines that fit you",
        "body": "We map your real sales stages so deals move the way your team already works, with nothing lost in between."
      },
      {
        "title": "One tidy contact record",
        "body": "Every call, email, note, and order sits on one profile, so anyone can pick up the thread instantly."
      },
      {
        "title": "Follow-ups that happen",
        "body": "Automatic reminders and tasks mean warm leads get chased on time, not two weeks late."
      },
      {
        "title": "Reports you'll actually use",
        "body": "See what's in the pipeline, what's closing, and where deals stall, all in plain numbers."
      },
      {
        "title": "Connected to your tools",
        "body": "We link your CRM to email, calendars, and the apps you already rely on so data flows without copy-paste."
      },
      {
        "title": "Built to grow with you",
        "body": "Add fields, teams, and workflows as you scale, without rebuilding from scratch each time."
      }
    ],
    "whenYouNeedThis": [
      "Customer details are scattered across spreadsheets and inboxes.",
      "Leads go cold because nobody followed up in time.",
      "You can't see what's really in your pipeline.",
      "A new hire takes weeks to learn who's who.",
      "You've outgrown the tool you started with."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Map how you sell",
        "body": "We sit with your team, learn your stages and quirks, and sketch the CRM around your real workflow."
      },
      {
        "label": "Week 2-4",
        "title": "Build the core",
        "body": "Pipelines, contact records, and automations set up and shaped to your business."
      },
      {
        "label": "Launch",
        "title": "Move your data over",
        "body": "We migrate your existing contacts cleanly and train your team so day one feels natural."
      },
      {
        "label": "Ongoing",
        "title": "Refine as you go",
        "body": "We tune fields and workflows as you learn what helps most."
      }
    ],
    "deliverables": [
      "Custom CRM tailored to your sales flow",
      "Clean migration of your existing contacts",
      "Automated follow-ups and reminders",
      "Pipeline and sales reporting dashboards",
      "Integrations with email and calendar",
      "Team training and handover"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What is a custom CRM and how is it different from something like HubSpot or Salesforce?",
        "a": "A custom CRM is built around the way your team already sells, rather than asking you to bend your process to fit a rigid off-the-shelf tool. You get exactly the pipeline stages, fields, and workflows you need, nothing you don't, and you own the software outright."
      },
      {
        "q": "How long does it take to build a custom CRM?",
        "a": "We usually spend the first week mapping how you sell, then a few weeks building out your pipelines, contact records, and automations before we migrate your data and train the team. Every business is different, so we'll give you a clear timeline once we understand your workflow on a call."
      },
      {
        "q": "How much does a custom CRM cost?",
        "a": "Every CRM is quoted to what you actually need, and we agree one clear fixed price up front, with no retainers and no surprises later. The best way to get a real estimate is a free call where we learn how your team works, then price it honestly."
      },
      {
        "q": "Can you move my existing contacts and data into the new CRM?",
        "a": "Yes, cleaning up and migrating your existing contacts is part of the build, so nothing gets left behind in old spreadsheets or inboxes. We bring it all over tidily so day one feels natural for your team."
      },
      {
        "q": "Will the CRM connect to my email and calendar?",
        "a": "It will. We link your CRM to the email, calendars, and apps your team already relies on, so details flow through automatically instead of being copied across by hand."
      }
    ],
    "metaTitle": "CRM Systems — One Home for Every Customer · Brandivibe",
    "metaDescription": "Custom CRM software shaped around how your team sells, keeping leads, deals, and customer history tidy and easy to act on."
  },
  {
    "slug": "erp",
    "num": "02",
    "pillar": "Software Development",
    "title": "ERP Systems",
    "hook": "Run your whole business from one screen.",
    "tagline": "Custom ERP software that connects your operations so nothing lives on an island.",
    "accent": "#0FA598",
    "summary": "One connected system for stock, orders, finance, and people, built around how your business really runs.",
    "heroBody": [
      "When sales, stock, invoicing, and operations all live in separate tools, someone spends their days keying the same numbers into five places. We build you an ERP that ties it together, so an order in one part of the business updates everything else automatically.",
      "This isn't a bloated system you'll only ever use a tenth of. We build the pieces you actually need, in an order that makes sense, and connect them into one dependable flow. Fewer errors, less double-handling, and a clear view of the whole operation whenever you want it."
    ],
    "bullets": [
      "Connected operations",
      "Live inventory",
      "Order to invoice",
      "Real-time dashboards"
    ],
    "capabilities": [
      {
        "title": "One source of truth",
        "body": "Stock, sales, and finance share the same live data, so everyone's working from the same numbers."
      },
      {
        "title": "Inventory that stays accurate",
        "body": "Track stock across locations in real time and stop the guesswork on what you actually have."
      },
      {
        "title": "Order to cash, joined up",
        "body": "An order flows through fulfilment to invoice without anyone re-typing it along the way."
      },
      {
        "title": "Finance built in",
        "body": "Purchases, sales, and costs roll up automatically, so your accounts stay current."
      },
      {
        "title": "Dashboards for decisions",
        "body": "See margins, stock levels, and workload at a glance instead of waiting for a monthly report."
      },
      {
        "title": "Modular by design",
        "body": "Start with what matters most and add modules as you grow, without a painful overhaul."
      }
    ],
    "whenYouNeedThis": [
      "The same numbers get typed into several systems.",
      "You never quite trust your stock figures.",
      "Departments work from different versions of the truth.",
      "Reporting means stitching spreadsheets together by hand.",
      "You've grown past the tools that got you here."
    ],
    "process": [
      {
        "label": "Week 1-2",
        "title": "Understand the whole",
        "body": "We map how work flows across your business and find where the handoffs break down."
      },
      {
        "label": "Phase 1",
        "title": "Build the backbone",
        "body": "We start with the core modules that unlock the biggest wins and get them live."
      },
      {
        "label": "Phase 2+",
        "title": "Connect the rest",
        "body": "We add modules and integrations step by step, keeping the system running throughout."
      },
      {
        "label": "Ongoing",
        "title": "Support and evolve",
        "body": "We adjust and extend the system as your operation changes."
      }
    ],
    "deliverables": [
      "Custom ERP built around your operations",
      "Connected inventory, sales, and finance modules",
      "Real-time operational dashboards",
      "Automated order-to-invoice workflows",
      "Integrations with existing tools",
      "Rollout plan, training, and support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What does an ERP system actually do for my business?",
        "a": "An ERP ties your separate tools together so stock, sales, orders, and finance all share the same live data, which means an order in one place updates everything else automatically. You get one dependable view of the whole operation instead of the same numbers keyed into five different systems."
      },
      {
        "q": "Do I have to replace all my current software at once?",
        "a": "Not at all. We build your ERP module by module, starting with the pieces that unlock the biggest wins, and keep everything running while we connect the rest. It's a steady rollout, never a painful all-or-nothing overhaul."
      },
      {
        "q": "How long does an ERP project take?",
        "a": "We start by mapping how work flows across your business, then build the core backbone first before adding modules in phases. Because ERPs touch so many parts of a company, we'll map out realistic timeframes for your specific setup on a call rather than guess."
      },
      {
        "q": "How much does a custom ERP cost?",
        "a": "Your ERP is quoted to the modules and connections you genuinely need, with one fixed price agreed up front, no retainers, and no surprise add-ons. A free call is the best way to get a real estimate, since we can see the scope of your operation first."
      },
      {
        "q": "Will the ERP keep my inventory figures accurate?",
        "a": "Yes, it tracks stock across your locations in real time so you can stop guessing what you actually have on hand. Because inventory shares the same live data as sales and finance, everyone is always working from the same numbers."
      }
    ],
    "metaTitle": "ERP Systems — Run It All from One Place · Brandivibe",
    "metaDescription": "Custom ERP software that connects stock, orders, finance, and operations into one dependable, real-time system built for how you work."
  },
  {
    "slug": "ecommerce-platform",
    "num": "03",
    "pillar": "Software Development",
    "title": "E-commerce Platforms",
    "hook": "An online store built to sell more.",
    "tagline": "A fast, custom e-commerce platform that's a joy to shop and easy to run.",
    "accent": "#0FA598",
    "summary": "Bespoke online stores tuned for smooth checkouts, happy customers, and simple day-to-day management.",
    "heroBody": [
      "A great online store does two jobs at once. It makes buying feel effortless for your customers, and it makes running the shop painless for you. We build e-commerce platforms that do both, shaped around your products and the way you like to work.",
      "No wrestling with a bloated template or paying for features you'll never touch. We build the store you need, quick to load and easy to check out on, with an admin side your team can actually manage. Then we make sure every step from browse to buy nudges gently toward the sale."
    ],
    "bullets": [
      "Fast checkout",
      "Mobile-first",
      "Easy admin",
      "Built to scale"
    ],
    "capabilities": [
      {
        "title": "Checkout that converts",
        "body": "A short, clear path to buy with the payment options your customers expect, so fewer carts get abandoned."
      },
      {
        "title": "Beautiful on every screen",
        "body": "Most people shop on their phone, so we design mobile-first and make it feel quick and effortless."
      },
      {
        "title": "Admin your team will like",
        "body": "Add products, manage orders, and update stock without needing a developer on call."
      },
      {
        "title": "Search and browse that help",
        "body": "Smart filtering and search so shoppers find the right product fast and buy with confidence."
      },
      {
        "title": "Payments and shipping sorted",
        "body": "We wire up the gateways, tax, and delivery options that fit your business, cleanly and safely."
      },
      {
        "title": "Ready for busy days",
        "body": "Built to stay fast when a campaign lands and traffic spikes, so you never lose a sale to a slow page."
      }
    ],
    "whenYouNeedThis": [
      "Your current store is slow or clunky to shop.",
      "Managing products and orders eats your day.",
      "Too many shoppers leave at checkout.",
      "You're outgrowing a rigid template platform.",
      "You want a store that's truly yours."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn your products",
        "body": "We get to know your range, your customers, and how you want the shop to run."
      },
      {
        "label": "Week 2-4",
        "title": "Design and build",
        "body": "We craft the storefront and checkout, then wire up payments, shipping, and admin."
      },
      {
        "label": "Launch",
        "title": "Load up and go live",
        "body": "We migrate products and orders, test everything, and launch with confidence."
      },
      {
        "label": "Ongoing",
        "title": "Improve and grow",
        "body": "We watch how people shop and refine the store to sell more over time."
      }
    ],
    "deliverables": [
      "Custom-built online store",
      "Fast, mobile-first checkout",
      "Product and order management admin",
      "Payment and shipping integrations",
      "Product data migration",
      "Launch support and handover"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "Why choose a custom e-commerce platform over Shopify or WooCommerce?",
        "a": "A bespoke platform gives you a store shaped around your products and the way you like to work, without wrestling a bloated template or paying for features you'll never touch. It's fast, easy for your team to manage, and it's genuinely yours to keep."
      },
      {
        "q": "Will my online store be easy to shop on a phone?",
        "a": "Definitely. Most people shop on their phone, so we design mobile-first and keep the checkout short and clear, which means fewer abandoned carts and more completed orders."
      },
      {
        "q": "Can you move my existing products and orders to the new store?",
        "a": "Yes, migrating your product data and orders is part of the build, so nothing gets lost in the switch. We load everything up, test every path from browse to buy, and launch with confidence."
      },
      {
        "q": "How long does it take to build a custom online store?",
        "a": "After a week getting to know your range and customers, we design and build the storefront and checkout, wire up payments and shipping, then migrate your products and go live. We'll share a clear timeline for your store once we've seen what you're selling."
      },
      {
        "q": "How much does a custom e-commerce platform cost?",
        "a": "Every store is quoted to your products and the way you want it to run, with one fixed price agreed up front and no retainers or surprises. The best way to get a real estimate is a free call where we learn about your catalogue and goals."
      }
    ],
    "metaTitle": "E-commerce Platforms — Stores Built to Sell · Brandivibe",
    "metaDescription": "Bespoke e-commerce platforms tuned for smooth checkouts, happy customers, and simple day-to-day management, built fast and truly yours."
  },
  {
    "slug": "accounting-finance",
    "num": "04",
    "pillar": "Software Development",
    "title": "Accounting & Finance Software",
    "hook": "Know exactly where your money stands.",
    "tagline": "Finance software that keeps your numbers accurate, current, and easy to understand.",
    "accent": "#0FA598",
    "summary": "Custom accounting and finance tools that automate the busywork and give you a clear view of your money.",
    "heroBody": [
      "Money should be the part of your business you feel most in control of, not the part you dread at month end. We build finance software that handles invoicing, expenses, and reporting for you, so your books stay accurate without hours of manual entry.",
      "Everything is shaped around how your business actually earns and spends. Invoices go out on time, costs are tracked as they happen, and the reports you need are always a click away. You get a calm, current picture of your finances, and a lot of tedious admin simply disappears."
    ],
    "bullets": [
      "Automated invoicing",
      "Expense tracking",
      "Clear reporting",
      "Tax-ready books"
    ],
    "capabilities": [
      {
        "title": "Invoicing on autopilot",
        "body": "Create, send, and chase invoices automatically, so you get paid faster with far less chasing."
      },
      {
        "title": "Expenses that track themselves",
        "body": "Costs are logged and categorised as they happen, keeping your books current without the shoebox of receipts."
      },
      {
        "title": "Reports in plain numbers",
        "body": "Profit, cash flow, and outstanding invoices shown clearly, so you always know where you stand."
      },
      {
        "title": "Ready for tax time",
        "body": "Everything's organised the way your accountant wants it, so filing is quick and stress-free."
      },
      {
        "title": "Bank feeds connected",
        "body": "We link your accounts so transactions flow in and reconciliation stops being a weekend job."
      },
      {
        "title": "Permissions that protect you",
        "body": "Give the right people the right access, so sensitive numbers stay in safe hands."
      }
    ],
    "whenYouNeedThis": [
      "Month end always turns into a scramble.",
      "You're never quite sure of your real cash position.",
      "Invoicing and chasing payments eats your time.",
      "Receipts and expenses pile up untracked.",
      "Your spreadsheets have outgrown their usefulness."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn your numbers",
        "body": "We understand how money moves through your business and what your accountant needs."
      },
      {
        "label": "Week 2-4",
        "title": "Build the system",
        "body": "Invoicing, expenses, and reporting set up and tailored to your workflow."
      },
      {
        "label": "Launch",
        "title": "Connect and go live",
        "body": "We link your bank feeds, bring across your data, and get your team comfortable."
      },
      {
        "label": "Ongoing",
        "title": "Keep it sharp",
        "body": "We adjust reports and rules as your business and tax needs change."
      }
    ],
    "deliverables": [
      "Custom accounting and finance software",
      "Automated invoicing and payment reminders",
      "Expense tracking and categorisation",
      "Cash flow and profit reporting",
      "Bank feed integrations",
      "Training and ongoing support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What can custom accounting and finance software do that a spreadsheet can't?",
        "a": "It automates the busywork that spreadsheets leave to you, sending and chasing invoices, logging expenses as they happen, and keeping your reports a click away. You get a calm, current picture of your money instead of a month-end scramble."
      },
      {
        "q": "Can the software connect to my bank account?",
        "a": "Yes, we link your bank accounts so transactions flow in automatically and reconciliation stops being a weekend job. Your books stay current without the manual data entry."
      },
      {
        "q": "Will my books be ready for my accountant at tax time?",
        "a": "They will. We organise everything the way your accountant expects, so filing is quick and stress-free, and we shape the reports around what your business and tax needs actually require."
      },
      {
        "q": "How long does it take to build finance software?",
        "a": "We spend the first week learning how money moves through your business, then build and tailor your invoicing, expenses, and reporting before connecting your bank feeds and bringing your data across. We'll give you a clear timeline for your setup on a call."
      },
      {
        "q": "How much does custom accounting software cost?",
        "a": "Your finance software is quoted to what you actually need, with one fixed price agreed up front, no retainers, and no surprises. A free call is the best way to get a real estimate, since we can see how your money moves first."
      }
    ],
    "metaTitle": "Accounting & Finance Software — Money, Made Clear · Brandivibe",
    "metaDescription": "Custom finance software that automates invoicing and expenses and keeps your numbers accurate, current, and easy to understand."
  },
  {
    "slug": "hr-management",
    "num": "05",
    "pillar": "Software Development",
    "title": "HR Management Software",
    "hook": "Look after your people with ease.",
    "tagline": "HR software that takes care of the admin so you can take care of your team.",
    "accent": "#0FA598",
    "summary": "Custom HR tools that keep records, leave, and onboarding organised in one friendly place.",
    "heroBody": [
      "Your people are your business, but the admin around them can quietly swallow your week. We build HR software that keeps employee records, holidays, and documents neatly in one place, so the busywork runs itself and your team feels well looked after.",
      "Everyone gets what they need without the back-and-forth. Staff book leave and find their documents themselves, managers approve in a click, and you get a clear view of your whole team. It's the calm, organised HR you've wanted, shaped around how your company actually works."
    ],
    "bullets": [
      "Employee records",
      "Leave management",
      "Smooth onboarding",
      "Self-service portal"
    ],
    "capabilities": [
      {
        "title": "All records in one place",
        "body": "Every employee's details, documents, and history sit together, secure and easy to find."
      },
      {
        "title": "Leave without the emails",
        "body": "Staff request holidays, managers approve, and balances update automatically, no spreadsheet required."
      },
      {
        "title": "Onboarding that feels good",
        "body": "New starters get a warm, organised welcome with everything they need ready on day one."
      },
      {
        "title": "Self-service for everyone",
        "body": "People update details, book time off, and grab payslips themselves, freeing up your HR time."
      },
      {
        "title": "Reminders that keep you compliant",
        "body": "Reviews, renewals, and key dates are flagged automatically so nothing important slips."
      },
      {
        "title": "A clear view of your team",
        "body": "See headcount, leave, and who's where at a glance, whenever you need it."
      }
    ],
    "whenYouNeedThis": [
      "Employee info lives in scattered files and folders.",
      "Booking and tracking leave is a constant hassle.",
      "Onboarding a new hire feels chaotic every time.",
      "You're spending too long on repetitive HR admin.",
      "Your team has grown past manual tracking."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn your team",
        "body": "We map how you hire, manage leave, and keep records, and what would make life easier."
      },
      {
        "label": "Week 2-4",
        "title": "Build the system",
        "body": "Records, leave, onboarding, and the self-service portal set up around your policies."
      },
      {
        "label": "Launch",
        "title": "Bring everyone on",
        "body": "We migrate your data and introduce the system so staff feel comfortable from day one."
      },
      {
        "label": "Ongoing",
        "title": "Grow with your team",
        "body": "We add features and adjust workflows as your company changes."
      }
    ],
    "deliverables": [
      "Custom HR management software",
      "Central employee records and documents",
      "Leave requests and approvals",
      "Onboarding workflows",
      "Employee self-service portal",
      "Team training and support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What does HR management software help with day to day?",
        "a": "It keeps employee records, holidays, documents, and onboarding neatly in one place, so the admin runs itself instead of swallowing your week. Staff can book leave and find their own documents, managers approve in a click, and you get a clear view of your whole team."
      },
      {
        "q": "Can employees book their own leave and update their details?",
        "a": "Yes, the self-service portal lets people request holidays, update their information, and grab payslips themselves, which frees up your HR time. Managers just approve requests and balances update automatically, with no spreadsheet in sight."
      },
      {
        "q": "Will it help make onboarding new hires smoother?",
        "a": "It will. New starters get a warm, organised welcome with everything they need ready on day one, so onboarding stops feeling chaotic every time you hire."
      },
      {
        "q": "How long does it take to set up HR software?",
        "a": "We start by mapping how you hire, manage leave, and keep records, then build the records, leave, onboarding, and self-service portal around your policies before migrating your data. We'll give you a clear timeline for your team once we've talked it through."
      },
      {
        "q": "How much does custom HR software cost?",
        "a": "Every HR system is quoted to what your company needs, with one clear fixed price agreed up front and no retainers or surprises. The best way to get a real estimate is a free call where we learn how your team works."
      }
    ],
    "metaTitle": "HR Management Software — Care for Your People · Brandivibe",
    "metaDescription": "Custom HR software that keeps records, leave, and onboarding organised in one friendly place, so admin runs itself and your team thrives."
  },
  {
    "slug": "payroll-management",
    "num": "06",
    "pillar": "Software Development",
    "title": "Payroll Management Software",
    "hook": "Pay your team right, every time.",
    "tagline": "Payroll software that gets everyone paid accurately and on time, without the monthly stress.",
    "accent": "#0FA598",
    "summary": "Custom payroll tools that handle calculations, deductions, and payslips so payday just works.",
    "heroBody": [
      "Payday is one thing that has to go right, every single time. We build payroll software that handles the calculations, deductions, and payslips for you, so your team gets paid correctly and on time without you sweating the details.",
      "It's shaped around how your business pays people, whatever the mix of salaries, hourly rates, or bonuses. The numbers are worked out automatically, payslips go out cleanly, and your records stay tidy for tax and compliance. Less stress at the end of the month, and total confidence that everyone's paid properly."
    ],
    "bullets": [
      "Accurate calculations",
      "Automated payslips",
      "Tax and deductions",
      "On-time payments"
    ],
    "capabilities": [
      {
        "title": "Calculations you can trust",
        "body": "Salaries, hours, overtime, and bonuses worked out automatically, so payslips are right the first time."
      },
      {
        "title": "Deductions handled cleanly",
        "body": "Tax, pensions, and other deductions applied correctly every run, without manual maths."
      },
      {
        "title": "Payslips out in a click",
        "body": "Clear, professional payslips generated and shared automatically each pay period."
      },
      {
        "title": "Compliance kept in order",
        "body": "Records and reports stay organised the way tax authorities expect, so filing is straightforward."
      },
      {
        "title": "Works with your HR data",
        "body": "Connects to your HR and time records so hours and changes flow through without re-entry."
      },
      {
        "title": "Flexible for how you pay",
        "body": "Handles different pay schedules, roles, and rates, so it fits your team as it is and as it grows."
      }
    ],
    "whenYouNeedThis": [
      "Payroll takes far too long each month.",
      "You worry about getting calculations or tax wrong.",
      "Payslips and records are a manual chore.",
      "Your team's pay setup has grown complicated.",
      "You want payday to run itself, reliably."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn how you pay",
        "body": "We map your pay structures, deductions, and schedules down to the details that matter."
      },
      {
        "label": "Week 2-4",
        "title": "Build and test",
        "body": "We set up the calculations and payslips, then test thoroughly against real figures."
      },
      {
        "label": "Launch",
        "title": "Run it in parallel",
        "body": "We run alongside your current process first, so you can trust it before switching fully."
      },
      {
        "label": "Ongoing",
        "title": "Keep it current",
        "body": "We update rules and rates as tax and your team change."
      }
    ],
    "deliverables": [
      "Custom payroll management software",
      "Automated pay calculations",
      "Tax and deduction handling",
      "Professional payslip generation",
      "Compliance-ready records and reports",
      "Testing, rollout, and support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What does payroll software handle for me each pay run?",
        "a": "It works out salaries, hours, overtime, and bonuses automatically, applies tax and deductions cleanly, and generates payslips in a click. That means your team gets paid correctly and on time without you sweating the details at month end."
      },
      {
        "q": "Can it handle different pay schedules, rates, and bonuses?",
        "a": "Yes, it's shaped around how your business actually pays people, whatever the mix of salaries, hourly rates, and bonuses. It flexes to fit your team as it is now and as it grows."
      },
      {
        "q": "How do I know the calculations will be correct before I rely on it?",
        "a": "We test thoroughly against your real figures, then run the new system alongside your current process first, so you can trust it fully before switching over. Nothing goes live until you're confident everyone's paid properly."
      },
      {
        "q": "How long does it take to set up payroll software?",
        "a": "We spend the first week mapping your pay structures, deductions, and schedules, then build and test the calculations before running in parallel with your current process. We'll share a clear timeline for your setup once we understand how you pay."
      },
      {
        "q": "How much does custom payroll software cost?",
        "a": "Your payroll software is quoted to your pay setup and what you actually need, with one fixed price agreed up front, no retainers, and no surprises. A free call is the best way to get a real estimate for your team."
      }
    ],
    "metaTitle": "Payroll Management Software — Payday, Sorted · Brandivibe",
    "metaDescription": "Custom payroll software that handles calculations, deductions, and payslips so your team gets paid accurately and on time, every time."
  },
  {
    "slug": "project-management",
    "num": "07",
    "pillar": "Software Development",
    "title": "Project Management Software",
    "hook": "See every project, clear as day.",
    "tagline": "Project software that keeps work, deadlines, and your team moving in the same direction.",
    "accent": "#0FA598",
    "summary": "Custom project management tools that show who's doing what, what's due, and what's next, without the noise.",
    "heroBody": [
      "When projects live across chat threads, spreadsheets, and memory, things slip and people work in the dark. We build project management software that puts tasks, timelines, and progress in one clear view, so your team always knows what to do next and you always know where things stand.",
      "It's shaped around how your team actually delivers, not a generic board you have to force your work into. Assign tasks, track deadlines, and spot bottlenecks early, all without the clutter of tools that do too much. Just calm, visible progress toward the finish line."
    ],
    "bullets": [
      "Task tracking",
      "Clear timelines",
      "Team workload",
      "Progress at a glance"
    ],
    "capabilities": [
      {
        "title": "Tasks that stay on track",
        "body": "Assign work with owners and due dates, so everyone knows what's theirs and nothing gets forgotten."
      },
      {
        "title": "Timelines you can see",
        "body": "Visual schedules show what's due when, so you spot slippage before it becomes a problem."
      },
      {
        "title": "Balanced team workload",
        "body": "See who's stretched and who has room, and share work out fairly across the team."
      },
      {
        "title": "Progress without meetings",
        "body": "Live status means you can check where a project stands without pulling everyone into a call."
      },
      {
        "title": "Built around your workflow",
        "body": "We shape stages and boards to how your team really delivers, not a one-size-fits-all template."
      },
      {
        "title": "Connected to your tools",
        "body": "Links to the apps and files your team already uses, so everything stays in one flow."
      }
    ],
    "whenYouNeedThis": [
      "Work is scattered across chats and spreadsheets.",
      "Deadlines sneak up and get missed.",
      "You can't tell who's overloaded.",
      "Status updates mean endless meetings.",
      "Off-the-shelf tools do too much and help too little."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn how you deliver",
        "body": "We map your project stages, roles, and the way work actually moves through your team."
      },
      {
        "label": "Week 2-4",
        "title": "Build the system",
        "body": "Tasks, timelines, and dashboards set up around your workflow and shaped to fit."
      },
      {
        "label": "Launch",
        "title": "Get the team on board",
        "body": "We bring across current projects and help everyone settle in quickly."
      },
      {
        "label": "Ongoing",
        "title": "Refine over time",
        "body": "We adjust the setup as your team learns what helps most."
      }
    ],
    "deliverables": [
      "Custom project management software",
      "Task assignment and tracking",
      "Visual timelines and schedules",
      "Team workload views",
      "Progress dashboards",
      "Onboarding and support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How is custom project management software better than a tool like Asana or Trello?",
        "a": "We shape the stages and boards around how your team really delivers, rather than forcing your work into a generic template that does too much and helps too little. You get a clear, calm view of tasks, timelines, and progress with none of the clutter."
      },
      {
        "q": "Can I see my team's workload and who's overloaded?",
        "a": "Yes, workload views show you who's stretched and who has room, so you can share work out fairly across the team. Live status also means you can check where a project stands without pulling everyone into a meeting."
      },
      {
        "q": "Will it connect to the tools and files my team already uses?",
        "a": "It will. We link it to the apps and files your team already relies on, so everything stays in one flow instead of scattered across chats and spreadsheets."
      },
      {
        "q": "How long does it take to build project management software?",
        "a": "We start by mapping your project stages, roles, and how work moves through your team, then build the tasks, timelines, and dashboards around that before bringing your current projects across. We'll give you a clear timeline for your setup on a call."
      },
      {
        "q": "How much does custom project management software cost?",
        "a": "Every project tool is quoted to how your team delivers and what you actually need, with one fixed price agreed up front and no retainers or surprises. The best way to get a real estimate is a free call where we learn how you work."
      }
    ],
    "metaTitle": "Project Management Software — Work, Made Visible · Brandivibe",
    "metaDescription": "Custom project management software that keeps tasks, deadlines, and your team moving together, with clear progress and none of the noise."
  },
  {
    "slug": "mobile-app",
    "num": "08",
    "pillar": "Software Development",
    "title": "Mobile App Development",
    "hook": "Your business, in their pocket.",
    "tagline": "Mobile apps people love to use, built for both iPhone and Android.",
    "accent": "#0FA598",
    "summary": "Custom mobile apps designed to feel fast, friendly, and genuinely useful on every device.",
    "heroBody": [
      "A phone is the most personal screen your customers own, so an app has to earn its place there. We build mobile apps that feel quick, look lovely, and do something people actually want, whether that's shopping, booking, tracking, or staying in touch with your business.",
      "We design for how people really tap and swipe, then build it properly for both iPhone and Android so it feels right on every device. No clunky compromises, no features nobody uses. Just a polished app that reflects your brand, keeps customers coming back, and is genuinely a pleasure to use."
    ],
    "bullets": [
      "iOS & Android",
      "Fast and smooth",
      "Lovely design",
      "Built to last"
    ],
    "capabilities": [
      {
        "title": "One build, both platforms",
        "body": "We build for iPhone and Android together, so you reach everyone without paying for two separate apps."
      },
      {
        "title": "Design people enjoy",
        "body": "Clean, intuitive screens that feel natural to use and reflect your brand beautifully."
      },
      {
        "title": "Fast where it counts",
        "body": "Smooth, responsive performance so the app feels instant and never frustrates."
      },
      {
        "title": "Works with your systems",
        "body": "We connect the app to your website, data, and tools so everything stays in sync."
      },
      {
        "title": "Notifications that add value",
        "body": "Gentle, well-timed push messages that bring people back without being annoying."
      },
      {
        "title": "Ready for the app stores",
        "body": "We handle the submission process and get you cleanly onto the App Store and Google Play."
      }
    ],
    "whenYouNeedThis": [
      "Your customers would genuinely use an app.",
      "Your mobile site can't do what you need.",
      "You want to be on people's home screens.",
      "You need to reach both iPhone and Android users.",
      "You've got an idea and need it built well."
    ],
    "process": [
      {
        "label": "Week 1-2",
        "title": "Shape the idea",
        "body": "We define what the app should do, for whom, and sketch how it'll look and feel."
      },
      {
        "label": "Week 3+",
        "title": "Design and build",
        "body": "We craft the screens and build the app properly for both platforms, sharing progress as we go."
      },
      {
        "label": "Pre-launch",
        "title": "Test everywhere",
        "body": "We test on real devices to make sure it's smooth, stable, and ready for people."
      },
      {
        "label": "Launch",
        "title": "Ship and support",
        "body": "We get it into the app stores and stick around to help it grow."
      }
    ],
    "deliverables": [
      "Custom app for iOS and Android",
      "Polished, on-brand app design",
      "Integration with your systems and data",
      "Push notification setup",
      "App Store and Google Play submission",
      "Post-launch support"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "Will my app work on both iPhone and Android?",
        "a": "Yes, we build for iPhone and Android together, so you reach everyone without paying for two separate apps. It's designed to feel right and run smoothly on every device."
      },
      {
        "q": "Can the app connect to my website and existing systems?",
        "a": "It can. We connect the app to your website, data, and tools so everything stays in sync, and there's no double-handling behind the scenes."
      },
      {
        "q": "Do you handle getting the app onto the App Store and Google Play?",
        "a": "Yes, we take care of the whole submission process and get you cleanly onto both the App Store and Google Play. We also test on real devices first to make sure it's smooth and stable before people download it."
      },
      {
        "q": "How long does it take to build a mobile app?",
        "a": "We spend the first week or two shaping the idea and how it'll look, then design and build it properly for both platforms, sharing progress as we go, before testing and launching. We'll give you a realistic timeline for your app once we've talked through what it needs to do."
      },
      {
        "q": "How much does it cost to build a mobile app?",
        "a": "Every app is quoted to what you want it to do, with one clear fixed price agreed up front, no retainers, and no surprises. A free call is the best way to get a real estimate, since we can shape the scope with you first."
      }
    ],
    "metaTitle": "Mobile App Development — Your Business, Pocket-Sized · Brandivibe",
    "metaDescription": "Custom mobile apps for iPhone and Android that feel fast, look lovely, and give your customers something genuinely useful to keep coming back to."
  },
  {
    "slug": "seo-services",
    "num": "01",
    "pillar": "Digital Marketing",
    "title": "SEO Services",
    "hook": "Get found by the people who need you.",
    "tagline": "Search optimisation that lifts your rankings and brings the right visitors to your door.",
    "accent": "#F5A524",
    "summary": "A steady, honest approach to SEO that grows your organic traffic and turns searchers into customers over time.",
    "heroBody": [
      "Great work deserves to be found. We help your site climb the search results for the terms your customers actually type, so the right people land on your pages ready to buy, book, or get in touch.",
      "There are no shortcuts or shady tricks here. We fix what's holding you back, create pages worth ranking, and earn trust with search engines the slow, solid way that keeps paying off."
    ],
    "bullets": [
      "Technical health",
      "Keyword strategy",
      "On-page tuning",
      "Content that ranks"
    ],
    "capabilities": [
      {
        "title": "Search research that fits",
        "body": "We find the terms your customers use and map them to the pages that should rank."
      },
      {
        "title": "A site search engines trust",
        "body": "Speed, structure, and clean code so your pages get crawled and understood."
      },
      {
        "title": "On-page done right",
        "body": "Titles, headings, and content shaped to answer real questions clearly."
      },
      {
        "title": "Content people want",
        "body": "Helpful pages and articles that earn rankings and keep readers around."
      },
      {
        "title": "Authority you build",
        "body": "Trusted links and mentions that tell Google you're the real deal."
      },
      {
        "title": "Progress you can see",
        "body": "Rankings, traffic, and enquiries tracked in plain numbers every month."
      }
    ],
    "whenYouNeedThis": [
      "You want more visitors without paying per click.",
      "You're stuck on page two and can't move up.",
      "You've built a lovely site nobody finds.",
      "You want steady growth you can rely on.",
      "You'd rather a senior team handled the details."
    ],
    "process": [
      {
        "label": "Week 1-2",
        "title": "Dig into the data",
        "body": "We audit your site and study what your best customers search for."
      },
      {
        "label": "Week 2-3",
        "title": "Build the plan",
        "body": "A clear roadmap of fixes, keywords, and content priorities."
      },
      {
        "label": "Ongoing",
        "title": "Do the work",
        "body": "Technical fixes, page improvements, and new content, month by month."
      },
      {
        "label": "Monthly",
        "title": "Measure & adjust",
        "body": "We report on growth and sharpen the plan around what's working."
      }
    ],
    "deliverables": [
      "Full technical SEO audit",
      "Keyword & content strategy",
      "On-page optimisation",
      "Content recommendations",
      "Link-building plan",
      "Monthly performance report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does SEO take to show results?",
        "a": "SEO is a steady, honest game rather than an overnight one, and most sites start seeing movement in rankings and traffic within a few months. We fix the foundations first, then build momentum month by month, so the growth keeps compounding the longer we work together."
      },
      {
        "q": "How much does SEO cost?",
        "a": "Every SEO project is quoted around your site, your goals, and how competitive your space is, and we agree one clear fixed price up front with no retainers or surprises. The best way to get a real estimate is a free call where we look at your site together and talk through what would move the needle."
      },
      {
        "q": "Do you use any risky tricks or shortcuts to rank my site?",
        "a": "No, and we never will. We fix what's holding your site back, create pages worth ranking, and earn trust with search engines the slow, solid way that keeps paying off long after cheap tricks would have gotten you penalised."
      },
      {
        "q": "What's actually included in your SEO service?",
        "a": "You get a full technical audit, a keyword and content strategy mapped to what your customers really search, on-page optimisation, content recommendations, and a link-building plan. Every month we hand you a plain-numbers report on rankings, traffic, and enquiries so you can see the progress for yourself."
      },
      {
        "q": "Will SEO work if I already have a website I like?",
        "a": "Absolutely. If you've built a lovely site that nobody's finding, that's exactly where we come in. We tune your structure, pages, and content so search engines understand and trust you, and the right people finally land on the site you already have."
      }
    ],
    "metaTitle": "SEO Services — Get Found by the Right People · Brandivibe",
    "metaDescription": "Honest, senior-run SEO that grows your organic traffic and brings the right searchers to your site — no shortcuts, just steady results."
  },
  {
    "slug": "local-seo",
    "num": "02",
    "pillar": "Digital Marketing",
    "title": "Local SEO",
    "hook": "Be the first name your neighbours find.",
    "tagline": "Show up in local searches and maps when nearby customers are looking for exactly what you offer.",
    "accent": "#F5A524",
    "summary": "We put your business on the map — literally — so people close by choose you over the shop down the road.",
    "heroBody": [
      "When someone nearby searches for what you do, you want to be the first result they see and the easy choice they make. We help you rank in local searches, appear on the map pack, and win the customers right around the corner.",
      "Local trust is built on details — accurate listings, genuine reviews, and pages that speak to your area. We handle all of it so foot traffic, calls, and bookings start coming from the people closest to you."
    ],
    "bullets": [
      "Map pack rankings",
      "Local listings",
      "Review strategy",
      "Area landing pages"
    ],
    "capabilities": [
      {
        "title": "Map pack visibility",
        "body": "We optimise everything Google needs to feature you in local map results."
      },
      {
        "title": "Listings that match",
        "body": "Consistent name, address, and phone details across every directory that matters."
      },
      {
        "title": "Reviews that reassure",
        "body": "A simple system to earn more genuine reviews and reply to them well."
      },
      {
        "title": "Pages built for your area",
        "body": "Location pages that rank for the towns and neighbourhoods you serve."
      },
      {
        "title": "Local links & mentions",
        "body": "Citations and partnerships that prove you're a trusted name locally."
      },
      {
        "title": "Calls and visits tracked",
        "body": "See exactly how many people found you and got in touch nearby."
      }
    ],
    "whenYouNeedThis": [
      "You serve customers in a specific area.",
      "You want more calls and walk-ins.",
      "You're invisible on the map pack.",
      "You have a shop or run local visits.",
      "You want to beat the business next door."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Map your patch",
        "body": "We learn your service area and the local searches worth winning."
      },
      {
        "label": "Week 1-2",
        "title": "Fix your foundations",
        "body": "Listings cleaned up, profile optimised, location pages set right."
      },
      {
        "label": "Ongoing",
        "title": "Build local trust",
        "body": "Reviews, citations, and content that grow your standing nearby."
      },
      {
        "label": "Monthly",
        "title": "Report on reach",
        "body": "Local rankings, calls, and directions in a clear summary."
      }
    ],
    "deliverables": [
      "Google Business Profile optimisation",
      "Local citation cleanup",
      "Review generation system",
      "Area landing pages",
      "Local link outreach",
      "Monthly local ranking report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does local SEO take to start bringing in customers?",
        "a": "Local SEO often moves a little faster than broad SEO because the competition is right around you, and many businesses start seeing more calls and map visibility within the first couple of months. We clean up your foundations early, then keep building local trust so the results grow steadily from there."
      },
      {
        "q": "How much does local SEO cost?",
        "a": "We quote local SEO to your area, your goals, and how competitive your patch is, then agree one fixed price up front with no retainers or hidden extras. A quick free call is the easiest way to get a real estimate, since we can look at your listings and local searches together."
      },
      {
        "q": "How do I show up in the Google map pack?",
        "a": "Getting into the map pack comes down to a complete, accurate profile, consistent listings across the web, genuine reviews, and pages that speak to your area. We handle all of those pieces so Google has every reason to feature you when nearby customers search."
      },
      {
        "q": "Can you help me get more reviews from my customers?",
        "a": "Yes, we set up a simple system that makes it easy to earn more genuine reviews and reply to them well. Real reviews reassure people who are choosing between you and the shop down the road, and they help your local rankings at the same time."
      },
      {
        "q": "Is local SEO right for my business?",
        "a": "If you serve customers in a specific area, have a shopfront, or travel out to local visits, then yes. Local SEO is built to win you the calls, walk-ins, and bookings from the people closest to you, so it's a natural fit whenever your best customers are nearby."
      }
    ],
    "metaTitle": "Local SEO — Win Customers Right Around the Corner · Brandivibe",
    "metaDescription": "Friendly local SEO that gets you into the map pack and in front of nearby customers ready to call, visit, or book."
  },
  {
    "slug": "ecommerce-seo",
    "num": "03",
    "pillar": "Digital Marketing",
    "title": "E-commerce SEO",
    "hook": "Turn product searches into paying orders.",
    "tagline": "SEO built for online stores that brings ready-to-buy shoppers straight to your products.",
    "accent": "#F5A524",
    "summary": "We help your product and category pages rank so shoppers find you first and add to cart without a second thought.",
    "heroBody": [
      "Every day people search for products just like yours. We make sure they find your store instead of the competition — with category and product pages that rank, load fast, and guide shoppers smoothly toward checkout.",
      "Online stores have their own challenges: big catalogues, duplicate pages, tricky filters. We know them well and fix them properly, so every product has a fair shot at ranking and every visit has a better chance of a sale."
    ],
    "bullets": [
      "Product page SEO",
      "Category rankings",
      "Site structure",
      "Rich results"
    ],
    "capabilities": [
      {
        "title": "Category pages that rank",
        "body": "We optimise the pages that drive the most search traffic and sales."
      },
      {
        "title": "Product pages that sell",
        "body": "Descriptions and structure that rank and convince shoppers to buy."
      },
      {
        "title": "A store built to scale",
        "body": "Clean structure and internal links so even big catalogues stay tidy."
      },
      {
        "title": "Rich results in search",
        "body": "Star ratings, prices, and stock shown right in Google to earn more clicks."
      },
      {
        "title": "Duplicate content solved",
        "body": "Filters and variants handled so pages don't compete with each other."
      },
      {
        "title": "Fast pages that convert",
        "body": "Speed fixes that help rankings and stop shoppers dropping off."
      }
    ],
    "whenYouNeedThis": [
      "You run an online store that needs sales.",
      "You want traffic that isn't paid ads.",
      "Your product pages don't rank at all.",
      "Your catalogue has grown messy over time.",
      "You want more revenue from organic search."
    ],
    "process": [
      {
        "label": "Week 1-2",
        "title": "Audit the store",
        "body": "We review your catalogue, structure, and the searches shoppers make."
      },
      {
        "label": "Week 2-3",
        "title": "Plan the priorities",
        "body": "A roadmap targeting your highest-value categories and products first."
      },
      {
        "label": "Ongoing",
        "title": "Optimise & expand",
        "body": "We fix pages, add structure, and improve content across the store."
      },
      {
        "label": "Monthly",
        "title": "Track revenue",
        "body": "Rankings, traffic, and organic sales in one clear report."
      }
    ],
    "deliverables": [
      "E-commerce SEO audit",
      "Category & product page optimisation",
      "Site architecture plan",
      "Structured data setup",
      "Duplicate content fixes",
      "Monthly revenue-focused report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does e-commerce SEO take to grow my sales?",
        "a": "For online stores, the first wins on your highest-value categories and products can show within a few months, and the growth builds as we work through more of your catalogue. It's a steady climb rather than a switch you flip, but organic traffic keeps paying you back long after the work is done."
      },
      {
        "q": "How much does e-commerce SEO cost?",
        "a": "We quote e-commerce SEO around the size of your catalogue, your goals, and how competitive your products are, then agree one clear fixed price up front with no retainers or surprises. A free call is the best way to get a real estimate, since we can look at your store and search opportunities together."
      },
      {
        "q": "Why aren't my product pages showing up in Google?",
        "a": "Online stores have their own quirks that quietly hold pages back, like big catalogues, duplicate pages from filters and variants, and thin descriptions. We fix those properly so every product gets a fair shot at ranking and each visit has a better chance of ending in a sale."
      },
      {
        "q": "What are rich results and can you get them for my store?",
        "a": "Rich results are the extra details Google can show right in search, like star ratings, prices, and stock. We set up the structured data your store needs so those show up, which helps your listings stand out and earns you more clicks from ready-to-buy shoppers."
      },
      {
        "q": "Can e-commerce SEO reduce how much I spend on ads?",
        "a": "It can, over time. As your category and product pages start ranking, you get a stream of shoppers who found you without a single paid click, which means less reliance on ads for the same traffic. Many stores use organic search to steadily lower their cost per sale."
      }
    ],
    "metaTitle": "E-commerce SEO — Product Searches Into Orders · Brandivibe",
    "metaDescription": "SEO for online stores that ranks your product and category pages and brings ready-to-buy shoppers straight to checkout."
  },
  {
    "slug": "app-store-optimization",
    "num": "04",
    "pillar": "Digital Marketing",
    "title": "App Store Optimization",
    "hook": "Get more downloads without paying per install.",
    "tagline": "Optimisation that helps your app rank higher in the App Store and Google Play and win more installs.",
    "accent": "#F5A524",
    "summary": "We fine-tune your app listing so it ranks for the searches that matter and turns browsers into downloads.",
    "heroBody": [
      "Most people find new apps by searching the store, so where you rank decides how many discover yours. We optimise your title, keywords, screenshots, and reviews to lift your visibility and earn installs you didn't have to pay for.",
      "It's not just about being found — it's about being chosen. We shape your listing so the moment someone lands on it, they get why your app is worth tapping install. More visibility, more trust, more downloads."
    ],
    "bullets": [
      "Keyword ranking",
      "Listing optimisation",
      "Screenshot strategy",
      "Review growth"
    ],
    "capabilities": [
      {
        "title": "Keywords that get found",
        "body": "We research the terms users search and work them into your listing."
      },
      {
        "title": "A title that ranks",
        "body": "App name and subtitle tuned for both search and first impressions."
      },
      {
        "title": "Screenshots that sell",
        "body": "Visual guidance so your store gallery shows off the app's best bits."
      },
      {
        "title": "Descriptions that convince",
        "body": "Copy that answers doubts and gives people a reason to install."
      },
      {
        "title": "Reviews and ratings",
        "body": "A plan to earn more positive reviews that lift your ranking and trust."
      },
      {
        "title": "Both stores covered",
        "body": "Optimisation tuned separately for the App Store and Google Play."
      }
    ],
    "whenYouNeedThis": [
      "You want more installs without ad spend.",
      "Your app is buried in search results.",
      "You're about to launch a new app.",
      "Your listing hasn't been touched in ages.",
      "You want steady organic download growth."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Study your app",
        "body": "We learn your audience and the searches that lead to installs."
      },
      {
        "label": "Week 1-2",
        "title": "Rework the listing",
        "body": "Keywords, title, description, and visuals optimised for both stores."
      },
      {
        "label": "Ongoing",
        "title": "Test & refine",
        "body": "We test variations and keywords to keep rankings climbing."
      },
      {
        "label": "Monthly",
        "title": "Report on installs",
        "body": "Keyword rankings, visibility, and download growth explained simply."
      }
    ],
    "deliverables": [
      "App store keyword research",
      "Optimised title & description",
      "Screenshot & visual guidance",
      "Review generation strategy",
      "App Store & Google Play setup",
      "Monthly ranking & install report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does app store optimization take to lift my downloads?",
        "a": "You'll usually see your listing's visibility and installs start to shift within a few weeks of the reworked listing going live, and we keep testing keywords and visuals to push rankings higher from there. It's an ongoing tune-up rather than a one-off, so the download growth builds steadily."
      },
      {
        "q": "How much does app store optimization cost?",
        "a": "We quote ASO around your app, your goals, and how competitive your category is, then agree one fixed price up front with no retainers or surprises. The easiest way to get a real estimate is a free call where we look at your current listing together."
      },
      {
        "q": "How can I get more app downloads without paying for ads?",
        "a": "Most people find new apps by searching the store, so where you rank decides how many discover yours. We research the terms users actually search and work them into your title, keywords, description, and screenshots, so you earn installs you didn't have to pay for."
      },
      {
        "q": "Do you optimize for both the App Store and Google Play?",
        "a": "Yes, and we tune each one separately because they work differently. Your keywords, title, and visuals are shaped for the way each store ranks and displays apps, so you show up well and look convincing on both."
      },
      {
        "q": "Can you help my app that's about to launch?",
        "a": "Definitely, launch is a great time to get this right. We shape your keywords, title, screenshots, and description so your app arrives ready to be found and chosen from day one, rather than getting buried while you figure it out later."
      }
    ],
    "metaTitle": "App Store Optimization — More Organic Installs · Brandivibe",
    "metaDescription": "ASO that lifts your app's ranking in the App Store and Google Play and turns browsers into downloads — no ad spend needed."
  },
  {
    "slug": "google-business-profile",
    "num": "05",
    "pillar": "Digital Marketing",
    "title": "Google Business Profile Optimization",
    "hook": "Make your Google listing work harder.",
    "tagline": "A fully optimised Google My Business (GMB) profile that helps nearby customers find, trust, and choose you.",
    "accent": "#F5A524",
    "summary": "We turn your Google listing into a proper shopfront that shows up in search and maps and brings in real enquiries.",
    "heroBody": [
      "Your Google listing is often the first thing people see when they search for you — and a strong one can send you a steady stream of calls, directions, and visits. We optimise every part of your Google My Business (GMB) profile so it works as hard as you do.",
      "From accurate details and great photos to posts, offers, and review replies, we keep your profile fresh and complete. That's what Google rewards with visibility, and what customers reward with their business."
    ],
    "bullets": [
      "Profile optimisation",
      "Photo & post strategy",
      "Review management",
      "Map visibility"
    ],
    "capabilities": [
      {
        "title": "A complete profile",
        "body": "Every field filled in right so Google shows you more often and higher up."
      },
      {
        "title": "Photos that pull people in",
        "body": "Guidance on images that make your listing look active and trustworthy."
      },
      {
        "title": "Posts that keep you fresh",
        "body": "Regular updates, offers, and news that signal you're open and busy."
      },
      {
        "title": "Reviews handled well",
        "body": "A system to earn more reviews and reply in a way that builds trust."
      },
      {
        "title": "The right categories",
        "body": "Chosen carefully so you appear for the searches that bring customers."
      },
      {
        "title": "Insights that matter",
        "body": "We track calls, directions, and clicks so you see the real payoff."
      }
    ],
    "whenYouNeedThis": [
      "You have a local business or shopfront.",
      "Your listing feels bare or out of date.",
      "You're not showing up on Google Maps.",
      "You want more calls and directions.",
      "You've never really used your profile."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Review your listing",
        "body": "We check what's missing and where you're losing visibility."
      },
      {
        "label": "Week 1-2",
        "title": "Optimise fully",
        "body": "Details, categories, photos, and description all set up properly."
      },
      {
        "label": "Ongoing",
        "title": "Keep it active",
        "body": "Posts, offers, and review replies that keep your profile lively."
      },
      {
        "label": "Monthly",
        "title": "Report on results",
        "body": "Calls, directions, and search views shown in a simple summary."
      }
    ],
    "deliverables": [
      "Full profile optimisation",
      "Category & attribute setup",
      "Photo & post plan",
      "Review response system",
      "Q&A and offers setup",
      "Monthly insights report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to optimize my Google Business Profile?",
        "a": "The core optimisation, filling in every field, sorting categories, photos, and your description, usually happens within the first couple of weeks. From there we keep the profile active with posts and review replies, and you'll typically see calls, directions, and views climb over the following weeks."
      },
      {
        "q": "How much does Google Business Profile optimization cost?",
        "a": "We quote it around your business and how much ongoing activity you'd like, then agree one clear fixed price up front with no retainers or hidden extras. A free call is the best way to get a real estimate, since we can look at your current listing together."
      },
      {
        "q": "Why isn't my business showing up on Google Maps?",
        "a": "It usually comes down to a profile that's incomplete, out of date, or missing the right categories. We fill in every part properly, choose categories that match what people search, and keep the listing fresh, which is exactly what Google rewards with more visibility on maps and search."
      },
      {
        "q": "What's the difference between this and local SEO?",
        "a": "Your Google Business Profile is one powerful piece of the local picture, this service makes that single listing work as hard as possible with photos, posts, reviews, and the right categories. Local SEO is the broader effort across your whole site and the web, and the two work beautifully together."
      },
      {
        "q": "Do you help manage and respond to reviews?",
        "a": "Yes, we set up a system to earn more genuine reviews and reply to them in a way that builds trust. Fresh, well-handled reviews reassure the people deciding whether to call or visit, and they help your profile show up more often too."
      }
    ],
    "metaTitle": "Google Business Profile Optimization · Brandivibe",
    "metaDescription": "We optimise your Google My Business (GMB) profile so nearby customers find you on search and maps and get in touch."
  },
  {
    "slug": "guest-posts",
    "num": "06",
    "pillar": "Digital Marketing",
    "title": "Guest Posts & Link Building",
    "hook": "Earn the trust that lifts your rankings.",
    "tagline": "Quality links and guest features from real, relevant sites that boost your authority the right way.",
    "accent": "#F5A524",
    "summary": "We build genuine links from trusted websites so search engines see you as an authority worth ranking higher.",
    "heroBody": [
      "Links are still one of the strongest signals of trust in search — but only the right ones help. We earn you placements on real, relevant websites that carry weight, so your authority grows and your rankings follow.",
      "No spammy networks or dodgy shortcuts that get you penalised. We pitch genuine sites, write content worth publishing, and secure links that make your whole site stronger. Slow, safe, and built to last."
    ],
    "bullets": [
      "Guest posting",
      "Relevant outreach",
      "Authority links",
      "White-hat only"
    ],
    "capabilities": [
      {
        "title": "Real, relevant sites",
        "body": "We target publications that fit your niche and actually carry authority."
      },
      {
        "title": "Content worth publishing",
        "body": "Well-written guest posts editors are happy to run and readers enjoy."
      },
      {
        "title": "Outreach done properly",
        "body": "Genuine pitches that build relationships, not mass spam nobody answers."
      },
      {
        "title": "Links that stay safe",
        "body": "Strictly white-hat work that grows authority without risking penalties."
      },
      {
        "title": "Anchors done naturally",
        "body": "A balanced link profile that looks earned, because it is."
      },
      {
        "title": "Every link reported",
        "body": "You see each placement, where it lives, and the value it carries."
      }
    ],
    "whenYouNeedThis": [
      "You want higher rankings but need authority.",
      "Your competitors have far more links.",
      "You've been burned by cheap link sellers.",
      "You want links that won't get you penalised.",
      "You're ready to grow trust the right way."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Assess your profile",
        "body": "We review your current links and the authority gap to close."
      },
      {
        "label": "Week 1-2",
        "title": "Find the targets",
        "body": "A shortlist of relevant, trusted sites worth earning links from."
      },
      {
        "label": "Ongoing",
        "title": "Pitch & publish",
        "body": "We write, outreach, and secure placements month by month."
      },
      {
        "label": "Monthly",
        "title": "Report on links",
        "body": "Every placement listed with its authority and impact explained."
      }
    ],
    "deliverables": [
      "Link profile analysis",
      "Target site shortlist",
      "Written guest posts",
      "Outreach management",
      "Live link placements",
      "Monthly link report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does link building take to affect my rankings?",
        "a": "Quality links build authority gradually, so this is a slow, safe process rather than an instant one, and you'll typically see the effect on rankings compound over several months. We secure genuine placements month by month, and each one makes your whole site a little stronger."
      },
      {
        "q": "How much do guest posts and link building cost?",
        "a": "We quote it around the authority gap you're closing and the kind of sites you're aiming for, then agree one fixed price up front with no retainers or surprises. A free call is the best way to get a real estimate, since we can look at your current link profile together."
      },
      {
        "q": "Are your links safe, or could they get my site penalised?",
        "a": "Everything we do is strictly white-hat, so your rankings grow without the risk. We pitch real, relevant sites, write content worth publishing, and keep your anchors natural, with no spammy networks or dodgy shortcuts that could come back to bite you."
      },
      {
        "q": "How do you decide which websites to get links from?",
        "a": "We target real publications that fit your niche and genuinely carry authority, not just anywhere that will take a link. You get a shortlist of relevant, trusted sites worth earning placements from, so every link actually helps rather than just padding a number."
      },
      {
        "q": "Will I know exactly where my links end up?",
        "a": "Yes, every placement is reported to you with where it lives and the value it carries. You'll never be left guessing what you paid for, because you can see each link, the site it's on, and how it strengthens your profile."
      }
    ],
    "metaTitle": "Guest Posts & Link Building — Real Authority · Brandivibe",
    "metaDescription": "Genuine guest posts and white-hat links from real, relevant sites that grow your authority and lift your rankings safely."
  },
  {
    "slug": "seo-audit",
    "num": "07",
    "pillar": "Digital Marketing",
    "title": "SEO Audit",
    "hook": "Find out exactly what's holding you back.",
    "tagline": "A clear, thorough review of your site that shows what to fix and why it matters.",
    "accent": "#F5A524",
    "summary": "We dig into your site's SEO and hand you a plain-English plan of what's wrong, what's working, and what to do next.",
    "heroBody": [
      "If your rankings have stalled, there's usually a reason — often several. Our SEO audit uncovers what's quietly holding your site back, from technical snags to missed opportunities, and lays it all out in language you can actually use.",
      "You won't get a 200-page export nobody reads. You'll get a prioritised list of fixes that matter, explained clearly, so whether we do the work or your team does, you know exactly where to start."
    ],
    "bullets": [
      "Technical review",
      "Content gaps",
      "Competitor check",
      "Action plan"
    ],
    "capabilities": [
      {
        "title": "Technical health check",
        "body": "We find crawl issues, speed problems, and errors slowing you down."
      },
      {
        "title": "On-page review",
        "body": "A look at titles, content, and structure across your key pages."
      },
      {
        "title": "Content gap analysis",
        "body": "The topics and searches you're missing that competitors are winning."
      },
      {
        "title": "Competitor comparison",
        "body": "See where rivals outrank you and how to close the gap."
      },
      {
        "title": "Backlink assessment",
        "body": "A check on your link profile for both strengths and risks."
      },
      {
        "title": "A prioritised plan",
        "body": "Every finding ranked by impact so you know what to tackle first."
      }
    ],
    "whenYouNeedThis": [
      "Your rankings have stalled or slipped.",
      "You don't know why traffic is flat.",
      "You're planning a redesign or replatform.",
      "You want a second opinion on your SEO.",
      "You need a clear plan before investing more."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Understand your goals",
        "body": "We learn what you want to rank for and where you stand now."
      },
      {
        "label": "Week 1-2",
        "title": "Run the audit",
        "body": "A deep dive across technical, on-page, content, and links."
      },
      {
        "label": "Week 2",
        "title": "Prioritise the fixes",
        "body": "We rank every finding by effort and impact on your rankings."
      },
      {
        "label": "Week 2-3",
        "title": "Walk you through it",
        "body": "A clear session explaining the plan and answering your questions."
      }
    ],
    "deliverables": [
      "Full technical audit",
      "On-page review",
      "Content gap analysis",
      "Competitor comparison",
      "Backlink assessment",
      "Prioritised action plan"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does an SEO audit take?",
        "a": "Most audits take a couple of weeks from start to finish, including the deep dive across technical, on-page, content, and links, and prioritising every finding. We then walk you through it in a clear session so you leave knowing exactly what to tackle first."
      },
      {
        "q": "How much does an SEO audit cost?",
        "a": "We quote the audit around the size of your site and what you want to rank for, then agree one clear fixed price up front with no retainers or surprises. A quick free call is the easiest way to get a real estimate for your particular site."
      },
      {
        "q": "What do I actually get at the end of the audit?",
        "a": "You get a prioritised, plain-English plan covering your technical health, on-page issues, content gaps, a competitor comparison, and a backlink assessment. It's not a 200-page export nobody reads, it's a ranked list of the fixes that matter, so you know precisely where to start."
      },
      {
        "q": "Do I have to hire you to do the fixes afterwards?",
        "a": "Not at all. The audit is yours to use however you like, so whether we carry out the work or your own team does, you'll have a clear plan to follow. There's no obligation, just an honest picture of what will move your rankings."
      },
      {
        "q": "Should I get an audit before redesigning my site?",
        "a": "Yes, that's one of the best times to do it. An audit shows what's working and what's holding you back before you rebuild, so you carry the good parts forward and fix the problems instead of accidentally baking them into the new site."
      }
    ],
    "metaTitle": "SEO Audit — Find What's Holding Your Site Back · Brandivibe",
    "metaDescription": "A thorough, plain-English SEO audit that shows exactly what's hurting your rankings and gives you a prioritised plan to fix it."
  },
  {
    "slug": "facebook-ads",
    "num": "08",
    "pillar": "Digital Marketing",
    "title": "Facebook & Instagram Ads",
    "hook": "Reach the right people while they scroll.",
    "tagline": "Meta campaigns that turn quiet scrolling into real interest in what you do.",
    "accent": "#F5A524",
    "summary": "Facebook and Instagram ads built to find your best customers and bring them to you, whether you're after leads, sales, or bookings.",
    "heroBody": [
      "Your future customers are already on Facebook and Instagram every day. We put the right message in front of them at the right moment, with ads that feel like part of the feed rather than an interruption.",
      "We handle the whole thing for you: audiences, creative, copy, and tracking. Then we watch the numbers closely and shift budget toward whatever's actually bringing you results."
    ],
    "bullets": [
      "Meta advantage+",
      "Audience targeting",
      "Scroll-stopping creative",
      "Weekly optimisation"
    ],
    "capabilities": [
      {
        "title": "Audiences that fit your buyer",
        "body": "We build and test audiences around real interests, behaviours, and lookalikes of your best customers."
      },
      {
        "title": "Creative that stops the scroll",
        "body": "Thumb-stopping images and video paired with copy that speaks to what people actually want."
      },
      {
        "title": "Full-funnel campaigns",
        "body": "From first hello to final sale, we warm people up and bring them back with retargeting."
      },
      {
        "title": "Pixel and events set up right",
        "body": "Proper tracking so you know which ads bring sales, not just clicks."
      },
      {
        "title": "Testing that finds winners",
        "body": "We test creative and audiences, then pour budget into what performs."
      },
      {
        "title": "Reports without the fluff",
        "body": "A clear monthly summary of spend, results, and what we're doing next."
      }
    ],
    "whenYouNeedThis": [
      "You want more leads or sales from social.",
      "You've boosted posts but seen little back.",
      "You're launching something and need reach fast.",
      "You have great products but not enough eyes on them.",
      "You'd rather a senior team ran your Meta ads."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Learn your business",
        "body": "We dig into your goals, your customers, and what makes you worth choosing."
      },
      {
        "label": "Week 1-2",
        "title": "Build & launch",
        "body": "Audiences, creative, copy, and tracking, all set up and live with clear targets."
      },
      {
        "label": "Ongoing",
        "title": "Test & tune",
        "body": "We cut what's not working and scale what is, week after week."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A plain-English rundown and a clear plan for the month ahead."
      }
    ],
    "deliverables": [
      "Fully built Meta Ads account",
      "Audience and targeting strategy",
      "Ad creative and copy variations",
      "Meta pixel and conversion tracking",
      "Retargeting campaigns",
      "Monthly performance report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to set up and launch Facebook and Instagram ads?",
        "a": "We usually spend the first week getting to know your business and customers, then build and launch your audiences, creative, copy, and tracking within the first week or two. From there we keep testing and tuning week after week, so your account gets sharper over time."
      },
      {
        "q": "How much do Facebook and Instagram ad campaigns cost?",
        "a": "Every project is quoted around what you actually need, with a clear fixed price we agree up front, so there are no retainers and no surprises. Your ad budget with Meta is separate and always yours to decide. The easiest way to get a real number is a free call where we talk through your goals."
      },
      {
        "q": "Do I keep ownership of my Meta ad account and all the data?",
        "a": "Yes, the ad account, the pixel, and everything we build stays yours. We set it up properly under your ownership so you're never locked in, and you can see exactly what's running at any time."
      },
      {
        "q": "Will you write the ad copy and make the creative, or do I need to supply it?",
        "a": "We handle the whole thing for you, including scroll-stopping images and video paired with copy that speaks to what your customers actually want. If you have brand assets or photos you love, we'll happily fold those in too."
      },
      {
        "q": "Why aren't my boosted posts getting results, and can ads fix that?",
        "a": "Boosting a post is a blunt tool, it shows your content to a broad crowd without proper targeting or tracking. We build real campaigns with audiences shaped around your best customers, full-funnel retargeting, and conversion tracking, so you can see which ads bring actual sales rather than just clicks."
      }
    ],
    "metaTitle": "Facebook & Instagram Ads That Bring Results · Brandivibe",
    "metaDescription": "Friendly, senior-run Facebook and Instagram ad management that finds your best customers and turns scrolling into real leads and sales."
  },
  {
    "slug": "linkedin-ads",
    "num": "09",
    "pillar": "Digital Marketing",
    "title": "LinkedIn Ads",
    "hook": "Reach the decision-makers who matter.",
    "tagline": "LinkedIn campaigns that put you in front of the exact people who can say yes.",
    "accent": "#F5A524",
    "summary": "Precise B2B campaigns that reach the right job titles, companies, and industries, and bring you conversations worth having.",
    "heroBody": [
      "When your customers are other businesses, LinkedIn is where the decision-makers spend their working day. We help you reach them by role, company, and industry, so your budget goes to people who can actually buy.",
      "B2B buying takes time, so we build campaigns that nurture as well as attract. We keep you visible to the right accounts and turn interest into real, qualified enquiries."
    ],
    "bullets": [
      "Job-title targeting",
      "Account-based ads",
      "Lead-gen forms",
      "Conversation nurture"
    ],
    "capabilities": [
      {
        "title": "Targeting by who they are",
        "body": "Reach people by job title, seniority, company, and industry, so no budget is wasted."
      },
      {
        "title": "Account-based campaigns",
        "body": "Focus your ads on the specific companies you'd love to work with."
      },
      {
        "title": "Messaging that respects them",
        "body": "Professional, human copy that speaks to real business problems, no hype."
      },
      {
        "title": "Lead-gen forms that convert",
        "body": "Native forms that let people enquire in a couple of taps without leaving LinkedIn."
      },
      {
        "title": "Content that builds trust",
        "body": "Thought-leadership and document ads that warm buyers up over time."
      },
      {
        "title": "Tracking tied to pipeline",
        "body": "We measure what matters: qualified leads, not vanity clicks."
      }
    ],
    "whenYouNeedThis": [
      "You sell to other businesses.",
      "You need to reach specific job titles or industries.",
      "You have target accounts you want to land.",
      "You're getting cheap leads elsewhere but not the right ones.",
      "You'd like senior hands running a considered B2B channel."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Map your buyers",
        "body": "We define the exact roles, companies, and industries worth reaching."
      },
      {
        "label": "Week 1-2",
        "title": "Build & launch",
        "body": "Targeting, creative, forms, and tracking, set up and live with clear goals."
      },
      {
        "label": "Ongoing",
        "title": "Refine & nurture",
        "body": "We tighten audiences and keep the right accounts warm over time."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A clear view of leads and cost, plus the plan for next month."
      }
    ],
    "deliverables": [
      "Fully built LinkedIn Ads account",
      "Audience and account targeting",
      "Ad creative and copy variations",
      "Lead-gen form setup",
      "Conversion tracking",
      "Monthly performance report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to launch a LinkedIn ad campaign?",
        "a": "We spend the first week mapping the exact roles, companies, and industries worth reaching, then build and launch your targeting, creative, forms, and tracking within a week or two. Because B2B buying takes time, we keep refining and nurturing the right accounts from there."
      },
      {
        "q": "How much does LinkedIn advertising cost?",
        "a": "We quote each project around your goals with a clear fixed price agreed up front, so there are no retainers and no surprises. Your media spend on LinkedIn is separate and stays in your control. A free call is the best way to get a real estimate for your situation."
      },
      {
        "q": "Can you target specific job titles and companies on LinkedIn?",
        "a": "Yes, that's LinkedIn's real strength. We reach people by job title, seniority, company, and industry, and we can run account-based campaigns focused on the specific businesses you'd love to work with, so none of your budget goes to the wrong people."
      },
      {
        "q": "Is LinkedIn advertising right for my business?",
        "a": "If you sell to other businesses and need to reach particular roles or industries, LinkedIn is often where those decision-makers spend their working day. It's especially worth it when you're getting cheaper leads elsewhere but not the right ones."
      },
      {
        "q": "How do you measure whether LinkedIn ads are actually working?",
        "a": "We tie tracking to what matters to you, qualified leads and pipeline, rather than vanity clicks. Each month you get a clear view of the leads coming in, what they cost, and the plan for the month ahead."
      }
    ],
    "metaTitle": "LinkedIn Ads That Reach Decision-Makers · Brandivibe",
    "metaDescription": "Friendly, senior-run LinkedIn ad management that targets the right roles and companies and brings you qualified B2B conversations worth having."
  },
  {
    "slug": "youtube-ads",
    "num": "10",
    "pillar": "Digital Marketing",
    "title": "YouTube Ads",
    "hook": "Tell your story where people are watching.",
    "tagline": "YouTube campaigns that get your brand seen, remembered, and acted on.",
    "accent": "#F5A524",
    "summary": "Video ads built to reach the right viewers, hold their attention, and drive them to take the next step.",
    "heroBody": [
      "YouTube is where people go to learn, laugh, and decide what to buy. We help you show up in those moments with video ads that earn attention instead of buying their way past it.",
      "Whether you want brand awareness or direct action, we plan the targeting, shape the message, and manage the spend so every view moves you closer to your goal."
    ],
    "bullets": [
      "Skippable & in-feed",
      "Audience targeting",
      "Video best practice",
      "Cost-per-view tuning"
    ],
    "capabilities": [
      {
        "title": "The right viewers, not just any",
        "body": "We target by interests, search behaviour, and the content people are already watching."
      },
      {
        "title": "Ads built for the first five seconds",
        "body": "We help shape a hook that earns the watch before the skip button appears."
      },
      {
        "title": "Formats matched to your goal",
        "body": "Skippable, in-feed, or short bumpers, chosen for awareness or action."
      },
      {
        "title": "Retargeting that closes the loop",
        "body": "Bring back viewers who watched but didn't act yet."
      },
      {
        "title": "Smart spend management",
        "body": "We tune bids and targeting to bring your cost per view and action down."
      },
      {
        "title": "Reporting you can follow",
        "body": "Clear numbers on views, watch time, and the actions that matter."
      }
    ],
    "whenYouNeedThis": [
      "You want more people to know your brand.",
      "You have video and want it seen by the right people.",
      "You're launching and need memorable reach.",
      "You want a channel beyond search and social.",
      "You'd rather a senior team ran your YouTube spend."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Set the goal",
        "body": "We agree what success looks like and who we most want watching."
      },
      {
        "label": "Week 1-2",
        "title": "Build & launch",
        "body": "Targeting, formats, and tracking, set up and live with clear targets."
      },
      {
        "label": "Ongoing",
        "title": "Optimise views",
        "body": "We refine audiences and bids to lift results and lower cost."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A plain rundown of reach, engagement, and what's next."
      }
    ],
    "deliverables": [
      "Fully built YouTube Ads campaigns",
      "Audience and targeting strategy",
      "Ad format and creative guidance",
      "Conversion and view tracking",
      "Retargeting campaigns",
      "Monthly performance report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to get YouTube ads up and running?",
        "a": "We start by agreeing what success looks like and who you most want watching, then build and launch your targeting, formats, and tracking within a week or two. After that we keep refining audiences and bids to lift results and lower your cost over time."
      },
      {
        "q": "How much do YouTube ads cost?",
        "a": "We quote each project around your goals with a clear fixed price agreed up front, so there are no retainers and no surprises. Your spend on YouTube itself is separate and always yours to set. A free call is the easiest way to get a real estimate."
      },
      {
        "q": "Do I need to already have a video to run YouTube ads?",
        "a": "Having video helps, and we'll guide the creative so it works hard from the first five seconds, before the skip button even appears. We shape the hook, choose the right formats, and can advise on what to film if you're starting fresh."
      },
      {
        "q": "Can YouTube ads drive sales, or are they only good for brand awareness?",
        "a": "They can do both. We match the ad format to your goal, whether that's memorable reach or direct action, and we run retargeting to bring back viewers who watched but didn't act yet, so every view moves you closer to what you want."
      },
      {
        "q": "How will I know if my YouTube campaign is paying off?",
        "a": "You get clear reporting on views, watch time, and the actions that actually matter to you, explained in plain English. Each month we walk you through the reach and engagement and lay out what's next."
      }
    ],
    "metaTitle": "YouTube Ads That Get You Seen & Remembered · Brandivibe",
    "metaDescription": "Friendly, senior-run YouTube ad management that reaches the right viewers, holds attention, and turns video views into real action for your brand."
  },
  {
    "slug": "social-media-management",
    "num": "11",
    "pillar": "Digital Marketing",
    "title": "Social Media Management",
    "hook": "Show up consistently, sound like you.",
    "tagline": "A social presence that stays active, on-brand, and worth following, without eating your week.",
    "accent": "#F5A524",
    "summary": "We plan, create, and post your social content so your channels stay lively and true to your voice, month after month.",
    "heroBody": [
      "Keeping social alive is a real job, and it's the first thing to slip when you're busy. We take it off your plate and keep your channels posting consistently with content that actually sounds like you.",
      "From planning to posting to replying, we handle the day-to-day and keep an eye on what's landing. You get a presence that builds trust and keeps your audience close."
    ],
    "bullets": [
      "Content calendar",
      "On-brand creative",
      "Community replies",
      "Monthly reporting"
    ],
    "capabilities": [
      {
        "title": "A plan, not random posts",
        "body": "A monthly calendar mapped to your goals, so every post has a purpose."
      },
      {
        "title": "Content that sounds like you",
        "body": "Captions and visuals shaped around your voice, not a generic template."
      },
      {
        "title": "Consistent posting, handled",
        "body": "We schedule and publish so your channels never go quiet."
      },
      {
        "title": "Community engagement",
        "body": "We reply to comments and messages so your audience feels heard."
      },
      {
        "title": "The right platforms",
        "body": "We focus effort where your audience actually spends time."
      },
      {
        "title": "Insight you can use",
        "body": "Monthly reporting on what's growing and what to do more of."
      }
    ],
    "whenYouNeedThis": [
      "Your channels have gone quiet.",
      "You never find time to post consistently.",
      "Your feed doesn't reflect how good you are.",
      "You want to grow an engaged audience.",
      "You'd rather hand social to a senior team."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Find your voice",
        "body": "We learn your brand, audience, and what you want social to do."
      },
      {
        "label": "Week 1-2",
        "title": "Plan & create",
        "body": "We build a content calendar and produce the first batch for sign-off."
      },
      {
        "label": "Ongoing",
        "title": "Post & engage",
        "body": "We publish on schedule and stay on top of comments and messages."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A clear look at what grew, plus next month's content plan."
      }
    ],
    "deliverables": [
      "Monthly content calendar",
      "Original posts and captions",
      "On-brand graphics and visuals",
      "Scheduling and publishing",
      "Community engagement",
      "Monthly performance report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long before my social media channels are up and running with you?",
        "a": "In the first week we get to know your brand, audience, and goals, then build a content calendar and produce the first batch of posts for your sign-off within a week or two. After that we post on schedule and stay on top of engagement every month."
      },
      {
        "q": "How much does social media management cost?",
        "a": "We quote each project around what you actually need, with a clear fixed price agreed up front, so there are no retainers and no surprises. The best way to get a real number is a free call where we talk through your channels and goals."
      },
      {
        "q": "Which social media platforms will you manage for my business?",
        "a": "We focus your effort where your audience actually spends time, rather than trying to be everywhere at once. During our first conversations we'll agree the platforms that make the most sense for you."
      },
      {
        "q": "Will the posts actually sound like my brand, or feel generic?",
        "a": "They'll sound like you. We shape captions and visuals around your real voice, not a generic template, and everything runs to a plan mapped to your goals so each post has a purpose."
      },
      {
        "q": "Do you handle replying to comments and messages too?",
        "a": "Yes, community engagement is part of the day-to-day for us. We reply to comments and messages so your audience feels heard and your channels stay lively, not just a one-way broadcast."
      }
    ],
    "metaTitle": "Social Media Management, Done For You · Brandivibe",
    "metaDescription": "Friendly, senior-run social media management that keeps your channels active, on-brand, and growing an engaged audience, without eating your week."
  },
  {
    "slug": "online-reputation-management",
    "num": "12",
    "pillar": "Digital Marketing",
    "title": "Online Reputation Management",
    "hook": "Look as good online as you are.",
    "tagline": "We help your business earn more good reviews and handle the rest with care.",
    "accent": "#F5A524",
    "summary": "A steady approach to reviews and search results that makes sure the first thing people find reflects the real you.",
    "heroBody": [
      "Most people check your reviews before they ever call. We help you earn more of the good ones, respond to the tricky ones well, and make sure your best side shows up when someone searches your name.",
      "This isn't about hiding anything. It's about making it easy for happy customers to speak up, handling feedback with grace, and keeping your online presence honest and strong."
    ],
    "bullets": [
      "Review generation",
      "Response handling",
      "Search monitoring",
      "Profile clean-up"
    ],
    "capabilities": [
      {
        "title": "More reviews, the easy way",
        "body": "Simple systems that prompt happy customers to leave a review at the right moment."
      },
      {
        "title": "Thoughtful responses",
        "body": "We help you reply to reviews, good and bad, in a way that builds trust."
      },
      {
        "title": "Keeping an eye out",
        "body": "We monitor mentions and reviews so nothing catches you off guard."
      },
      {
        "title": "Tidy, accurate profiles",
        "body": "Consistent, up-to-date listings across the places people check."
      },
      {
        "title": "Better search results",
        "body": "We help your strongest content rank for your own name."
      },
      {
        "title": "Clear reporting",
        "body": "A simple monthly view of your rating, reviews, and mentions."
      }
    ],
    "whenYouNeedThis": [
      "You have great customers but few reviews.",
      "A bad review is weighing on your rating.",
      "Your search results don't reflect who you are.",
      "You want a steady flow of fresh feedback.",
      "You'd rather a senior team looked after this."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "See where you stand",
        "body": "We audit your reviews, listings, and search results as they are today."
      },
      {
        "label": "Week 1-2",
        "title": "Set things up",
        "body": "We put review requests and monitoring in place with a clear plan."
      },
      {
        "label": "Ongoing",
        "title": "Grow & respond",
        "body": "We help gather fresh reviews and handle responses with care."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A clear view of your reputation and the next steps to strengthen it."
      }
    ],
    "deliverables": [
      "Reputation and listings audit",
      "Review generation system",
      "Review response support",
      "Mention and review monitoring",
      "Profile clean-up and consistency",
      "Monthly reputation report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to see results from reputation management?",
        "a": "In the first week we audit your reviews, listings, and search results, then set up review requests and monitoring within a week or two. Reputation builds steadily, so you'll see fresh reviews and a stronger presence grow month by month rather than overnight."
      },
      {
        "q": "How much does online reputation management cost?",
        "a": "We quote each project around what you need, with a clear fixed price agreed up front, so there are no retainers and no surprises. A free call is the best way to get a real estimate once we understand where your reputation stands today."
      },
      {
        "q": "Can you remove or hide a bad review?",
        "a": "This isn't about hiding anything, and we won't promise to make honest feedback disappear. Instead we help you respond to tricky reviews with grace, make it easy for happy customers to speak up, and keep your best side showing when someone searches your name."
      },
      {
        "q": "How do you help my business get more reviews?",
        "a": "We put simple systems in place that prompt happy customers to leave a review at the right moment, so getting fresh feedback stops being a chore. It's an easy, honest way to let your best customers do the talking."
      },
      {
        "q": "Will you help me respond to reviews, both good and bad?",
        "a": "Yes, we help you reply thoughtfully to reviews of every kind in a way that builds trust. We also keep an eye on mentions and reviews so nothing catches you off guard."
      }
    ],
    "metaTitle": "Online Reputation Management You Can Trust · Brandivibe",
    "metaDescription": "Friendly, senior-run reputation management that earns more good reviews, handles feedback with care, and keeps your search results honest and strong."
  },
  {
    "slug": "content-distribution",
    "num": "13",
    "pillar": "Digital Marketing",
    "title": "Content Distribution & Amplification",
    "hook": "Great content deserves to be seen.",
    "tagline": "We get the content you've already made in front of far more of the right people.",
    "accent": "#F5A524",
    "summary": "A smart mix of channels and promotion that stretches every piece of content further and brings it real reach.",
    "heroBody": [
      "You put real work into your content, and then it quietly reaches a fraction of who it could. We fix that by getting each piece in front of the right audiences across the channels that suit it best.",
      "We take what you've created and give it legs: reshaped for each platform, promoted where it counts, and tracked so you can see the reach and results it earns."
    ],
    "bullets": [
      "Multi-channel reach",
      "Content repurposing",
      "Paid amplification",
      "Reach reporting"
    ],
    "capabilities": [
      {
        "title": "One piece, many places",
        "body": "We adapt each piece of content to fit every channel it belongs on."
      },
      {
        "title": "The right channels",
        "body": "We match content to the platforms where your audience actually is."
      },
      {
        "title": "Paid amplification",
        "body": "A sensible boost behind your best content to reach far more people."
      },
      {
        "title": "Repurposing that saves you time",
        "body": "We turn one strong piece into many, so nothing goes to waste."
      },
      {
        "title": "Timing that lands",
        "body": "We publish and promote when your audience is most likely to see it."
      },
      {
        "title": "Reach you can measure",
        "body": "Clear reporting on views, engagement, and the reach we've earned."
      }
    ],
    "whenYouNeedThis": [
      "You create content but few people see it.",
      "You want more mileage from what you already make.",
      "You're publishing but reach has plateaued.",
      "You have a piece worth putting real weight behind.",
      "You'd rather a senior team ran distribution."
    ],
    "process": [
      {
        "label": "Week 1",
        "title": "Review your content",
        "body": "We look at what you have and where it could travel further."
      },
      {
        "label": "Week 1-2",
        "title": "Plan & prepare",
        "body": "We map channels, repurpose pieces, and set up promotion."
      },
      {
        "label": "Ongoing",
        "title": "Publish & amplify",
        "body": "We distribute and boost content, then refine what reaches best."
      },
      {
        "label": "Monthly",
        "title": "Report & plan",
        "body": "A clear look at reach earned and where to push next."
      }
    ],
    "deliverables": [
      "Content distribution strategy",
      "Channel-specific repurposing",
      "Publishing across channels",
      "Paid amplification setup",
      "Engagement and reach tracking",
      "Monthly reach report"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to start distributing my content?",
        "a": "In the first week we review what you already have and where it could travel further, then map channels, repurpose pieces, and set up promotion within a week or two. From there we distribute and amplify on an ongoing basis, refining what reaches best."
      },
      {
        "q": "How much does content distribution and amplification cost?",
        "a": "We quote each project around your goals, with a clear fixed price agreed up front, so there are no retainers and no surprises. Any paid amplification budget is separate and stays in your control. A free call is the easiest way to get a real estimate."
      },
      {
        "q": "Do you create the content, or just distribute what I already have?",
        "a": "We take the content you've already made and give it legs, reshaping each piece to fit the channels it belongs on. It's about getting far more mileage from your existing work rather than starting from a blank page."
      },
      {
        "q": "What does repurposing my content actually involve?",
        "a": "We turn one strong piece into many, adapting it to suit each platform so nothing goes to waste. That means a single article, video, or post can reach the right people in several places, saving you time along the way."
      },
      {
        "q": "How will I know if my content is reaching more people?",
        "a": "You get clear reporting on views, engagement, and the reach we've earned, so the difference is easy to see. Each month we show you what landed and where it's worth pushing next."
      }
    ],
    "metaTitle": "Content Distribution & Amplification · Brandivibe",
    "metaDescription": "Friendly, senior-run content distribution that gets the work you've already made in front of far more of the right people across the channels that suit it."
  },
  {
    "slug": "content-writing",
    "num": "01",
    "pillar": "Creative Content",
    "title": "Content Writing",
    "hook": "Words that sound like you, working harder.",
    "tagline": "Clear, warm writing for your site, blog, and campaigns that helps the right people say yes.",
    "accent": "#E85D9A",
    "summary": "Website pages, articles, and email copy written to sound human and move readers toward action.",
    "heroBody": [
      "Good writing does quiet, useful work. It answers the question in someone's head, builds a little trust, and nudges them toward the next step. We write the pages and posts that do exactly that, in a voice that still sounds like you.",
      "You bring the expertise and the goals. We turn them into copy people actually finish reading, whether that's a homepage, a service page, or a run of articles that brings in steady traffic."
    ],
    "bullets": [
      "Website copy",
      "Blog & articles",
      "Email sequences",
      "Brand voice"
    ],
    "capabilities": [
      {
        "title": "Website pages that convert",
        "body": "Home, about, and service pages that answer real questions and guide the next click."
      },
      {
        "title": "Articles worth ranking",
        "body": "Useful, well-structured posts that earn search traffic and reader trust."
      },
      {
        "title": "A voice that's yours",
        "body": "We learn how you talk so the copy sounds like a person, not a template."
      },
      {
        "title": "Email that gets opened",
        "body": "Welcome flows and newsletters written to be read and replied to."
      },
      {
        "title": "Product & service copy",
        "body": "Plain, benefit-first descriptions that make the value obvious."
      },
      {
        "title": "Edits with a sharp eye",
        "body": "We tighten what you've already written so it reads clean and sure."
      }
    ],
    "whenYouNeedThis": [
      "You have plenty to say but no time to write it.",
      "Your current copy feels stiff or off-brand.",
      "You want blog traffic without the guesswork.",
      "You're launching and every page needs words.",
      "You'd rather a writer got your tone right the first time."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Learn your voice",
        "body": "We dig into your goals, audience, and how you like to sound."
      },
      {
        "label": "Step 2",
        "title": "Plan the words",
        "body": "A quick outline so we agree on message and structure before writing."
      },
      {
        "label": "Step 3",
        "title": "Write & refine",
        "body": "First draft delivered, then shaped together until it feels right."
      },
      {
        "label": "Step 4",
        "title": "Polish & hand over",
        "body": "Final proof, formatting, and files ready to publish."
      }
    ],
    "deliverables": [
      "Finished, ready-to-publish copy",
      "Voice and tone notes",
      "SEO-aware headings",
      "Two rounds of edits",
      "Meta titles and descriptions",
      "Clean handover files"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does content writing take?",
        "a": "It depends on how much you need, but most projects move through a quick voice-finding step, an outline, a first draft, and refinement over a matter of days to a couple of weeks. We'll give you a clear timeline once we know your page count and scope, and we won't leave you guessing along the way."
      },
      {
        "q": "How much does content writing cost?",
        "a": "Every project is quoted to exactly what you need, with one clear fixed price agreed up front and no retainers or surprise add-ons. The best way to get a real number is a quick free call where we talk through your pages and goals."
      },
      {
        "q": "Will the writing actually sound like my brand and not generic?",
        "a": "Yes. We start by learning how you talk and what you're going for, then write in a voice that sounds like a real person rather than a template. You also get tone notes so anything written later stays true to you."
      },
      {
        "q": "What kinds of copy can you write for my business?",
        "a": "We handle website pages like your home, about, and service pages, blog articles built to earn search traffic, email welcome flows and newsletters, and clear product or service descriptions. If you've already written something, we can also sharpen it up with a careful edit."
      },
      {
        "q": "Do I get to review and request changes to the copy?",
        "a": "Absolutely. We agree on the outline before writing, deliver a first draft, then shape it with you through two rounds of edits until it feels right. You get finished, ready-to-publish files at the end, complete with SEO-aware headings and meta descriptions."
      }
    ],
    "metaTitle": "Content Writing That Sounds Human · Brandivibe",
    "metaDescription": "Warm, senior-written website copy, articles, and email that sound like you and help the right people say yes."
  },
  {
    "slug": "social-media-content",
    "num": "02",
    "pillar": "Creative Content",
    "title": "Social Media Content Creation",
    "hook": "Show up online without the daily scramble.",
    "tagline": "A steady stream of posts and reels that keep your brand present and worth following.",
    "accent": "#E85D9A",
    "summary": "Planned, on-brand content for the platforms your audience actually uses, made and scheduled for you.",
    "heroBody": [
      "Posting well takes more time than most people have. We take it off your plate: a monthly plan, finished posts, captions that sound like you, and reels people stop to watch.",
      "You stay recognisable and consistent while we handle the making and the calendar. When someone finds your page, it looks alive and looked-after, the way you'd want it to."
    ],
    "bullets": [
      "Content calendars",
      "Reels & shorts",
      "Post design",
      "Caption writing"
    ],
    "capabilities": [
      {
        "title": "A plan you can see",
        "body": "A clear monthly calendar so you always know what's going out and when."
      },
      {
        "title": "Reels that hold attention",
        "body": "Short vertical video edited to earn the first three seconds and the watch."
      },
      {
        "title": "Posts that look the part",
        "body": "On-brand graphics and carousels that feel cohesive across your feed."
      },
      {
        "title": "Captions with personality",
        "body": "Copy that sounds like you and invites a comment, not a scroll."
      },
      {
        "title": "The right platforms",
        "body": "We focus effort where your audience actually spends time."
      },
      {
        "title": "Scheduled and shipped",
        "body": "Everything queued and posted, so nothing slips through the cracks."
      }
    ],
    "whenYouNeedThis": [
      "You know you should post more but never do.",
      "Your feed looks patchy or inconsistent.",
      "You want reels but don't know where to start.",
      "You're spread thin and social keeps losing.",
      "You'd like one team owning the whole calendar."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Set the direction",
        "body": "We agree on goals, themes, platforms, and the look you're after."
      },
      {
        "label": "Step 2",
        "title": "Plan the month",
        "body": "A content calendar you approve before anything gets made."
      },
      {
        "label": "Step 3",
        "title": "Create & caption",
        "body": "We design posts, edit reels, and write captions in your voice."
      },
      {
        "label": "Step 4",
        "title": "Schedule & review",
        "body": "Everything queued, then a monthly look at what performed."
      }
    ],
    "deliverables": [
      "Monthly content calendar",
      "Finished post graphics",
      "Edited reels and shorts",
      "Written captions and hashtags",
      "Scheduled and published posts",
      "Simple monthly performance recap"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does it take to get social media content up and running?",
        "a": "We usually set the direction and build your first monthly content calendar within the first week or two, then keep a steady rhythm of finished posts and reels each month after that. You approve the plan before anything gets made, so it never feels rushed."
      },
      {
        "q": "How much does social media content creation cost?",
        "a": "We quote each plan to what you actually need, with a clear fixed price agreed up front and no retainers or hidden extras. A quick free call is the easiest way to get a real estimate for your posting volume and platforms."
      },
      {
        "q": "Which platforms should I be posting on?",
        "a": "We focus your effort where your audience actually spends time rather than spreading you thin across every app. During setup we agree together on the platforms worth prioritising, so the work always goes where it counts."
      },
      {
        "q": "Do you handle the posting, or just create the content?",
        "a": "We handle both. Once you've approved the calendar, we design the posts, edit the reels, write captions in your voice, then schedule and publish everything for you. Nothing slips through the cracks."
      },
      {
        "q": "What do I actually receive each month?",
        "a": "You get an approved content calendar, finished post graphics, edited reels and shorts, written captions and hashtags, all scheduled and published, plus a simple recap of what performed. Your page stays looking alive and looked-after."
      }
    ],
    "metaTitle": "Social Media Content Creation, Done For You · Brandivibe",
    "metaDescription": "Planned, on-brand posts and reels made and scheduled for you, so your social presence stays consistent and alive."
  },
  {
    "slug": "video-production",
    "num": "03",
    "pillar": "Creative Content",
    "title": "Video Production",
    "hook": "Video that earns the watch and the trust.",
    "tagline": "From idea to finished cut, videos that show what you do and make people feel it.",
    "accent": "#E85D9A",
    "summary": "Brand films, product videos, and social clips planned, shot, and edited end to end.",
    "heroBody": [
      "The best video makes a viewer feel something, then remember you for it. We handle the whole thing, from the first idea and script to the shoot, the edit, and the final files ready to post.",
      "Whether it's a polished brand film or a batch of quick social clips, you get footage that looks considered and says exactly what you mean, without the production headache."
    ],
    "bullets": [
      "Brand films",
      "Product videos",
      "Social clips",
      "Full editing"
    ],
    "capabilities": [
      {
        "title": "Ideas before cameras",
        "body": "We start with the message and a script, so the shoot has a point."
      },
      {
        "title": "Filming that feels right",
        "body": "Considered framing, light, and sound that make you look your best."
      },
      {
        "title": "Edits with rhythm",
        "body": "Pacing, music, and cuts that keep people watching to the end."
      },
      {
        "title": "Built for each place",
        "body": "Versions sized and cut for web, social, and ads."
      },
      {
        "title": "Captions and graphics",
        "body": "On-screen text and titles so the point lands even on mute."
      },
      {
        "title": "One team, start to finish",
        "body": "Concept, shoot, and edit handled together, no juggling vendors."
      }
    ],
    "whenYouNeedThis": [
      "You want a brand film that actually represents you.",
      "You need product videos that show, not tell.",
      "You're feeding social and need a batch of clips.",
      "You've been quoted big numbers and want a friendlier way.",
      "You'd rather one team ran the whole thing."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Shape the idea",
        "body": "We settle on the message, look, and a tight script or outline."
      },
      {
        "label": "Step 2",
        "title": "Plan the shoot",
        "body": "Locations, shot list, and logistics sorted before the day."
      },
      {
        "label": "Step 3",
        "title": "Film it",
        "body": "A calm, well-run shoot that captures what we planned and more."
      },
      {
        "label": "Step 4",
        "title": "Edit & deliver",
        "body": "Cut, colour, sound, and captions, delivered in the sizes you need."
      }
    ],
    "deliverables": [
      "Concept and script",
      "Planned, professional shoot",
      "Fully edited main video",
      "Social cut-downs",
      "Captions and titles",
      "Final files in every size you need"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does video production take from idea to final cut?",
        "a": "A typical project runs through shaping the idea, planning the shoot, filming, then editing, which usually spans a few weeks depending on scope. We'll map out clear dates with you up front so you always know when your footage lands."
      },
      {
        "q": "How much does video production cost?",
        "a": "Every video is quoted to what you're making, with one fixed price agreed before we start and no surprise costs afterward. If you've been quoted big scary numbers elsewhere, a free call is a friendly way to hear a real, honest estimate."
      },
      {
        "q": "Do you handle everything, or do I need to hire a separate crew and editor?",
        "a": "One team handles the whole thing, from the first idea and script through the shoot and into the edit. There's no juggling separate vendors, so it stays calm and the finished piece feels consistent."
      },
      {
        "q": "Can you make social clips as well as a main brand film?",
        "a": "Yes. We can deliver a polished main video plus social cut-downs sized and cut for web, social, and ads, all from the same shoot. You get versions ready for wherever you're posting."
      },
      {
        "q": "Will the video still work if people watch it on mute?",
        "a": "It will. We add captions, titles, and on-screen graphics so your point lands even with the sound off, which is how a lot of people watch on social. The message comes through either way."
      }
    ],
    "metaTitle": "Video Production, Idea to Final Cut · Brandivibe",
    "metaDescription": "Brand films, product videos, and social clips planned, shot, and edited end to end, so the watch feels effortless."
  },
  {
    "slug": "ui-ux-design",
    "num": "01",
    "pillar": "Creative Design",
    "title": "UI/UX Design",
    "hook": "Design people just get, no manual needed.",
    "tagline": "Interfaces that feel obvious to use and a pleasure to look at.",
    "accent": "#7B6EF6",
    "summary": "Research-led product and website design that makes the right path the easy one.",
    "heroBody": [
      "When a screen is designed well, nobody notices the design, they just find what they came for. We map how people move through your product and shape screens where the next step is always clear.",
      "You get clean, tested interfaces built on real user thinking, not guesswork, and handed over ready for your developers to build without the back-and-forth."
    ],
    "bullets": [
      "User flows",
      "Wireframes",
      "UI design",
      "Prototypes"
    ],
    "capabilities": [
      {
        "title": "Flows that make sense",
        "body": "We map the journey so every screen leads naturally to the next."
      },
      {
        "title": "Wireframes first",
        "body": "We agree on structure and logic before adding any polish."
      },
      {
        "title": "Interfaces that delight",
        "body": "Clean, modern screens that feel calm and easy to move through."
      },
      {
        "title": "Clickable prototypes",
        "body": "Test the real thing before a line of code is written."
      },
      {
        "title": "Design systems",
        "body": "Reusable components that keep everything consistent as you grow."
      },
      {
        "title": "Developer-ready handover",
        "body": "Tidy files and specs your build team can pick up cleanly."
      }
    ],
    "whenYouNeedThis": [
      "You're building an app and want it to feel effortless.",
      "People get lost or drop off in your product.",
      "Your interface looks dated next to rivals.",
      "You need designs your developers can actually build.",
      "You want decisions backed by how users behave."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Understand the users",
        "body": "We learn who they are, what they want, and where they struggle."
      },
      {
        "label": "Step 2",
        "title": "Map & wireframe",
        "body": "Flows and low-fi screens to lock in structure early."
      },
      {
        "label": "Step 3",
        "title": "Design & prototype",
        "body": "Polished UI plus a clickable prototype you can test."
      },
      {
        "label": "Step 4",
        "title": "Refine & hand over",
        "body": "Tweak from feedback, then deliver dev-ready files."
      }
    ],
    "deliverables": [
      "User flow diagrams",
      "Wireframes",
      "Polished UI screens",
      "Interactive prototype",
      "Reusable component library",
      "Developer-ready handover files"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does UI/UX design take?",
        "a": "Most projects move through understanding your users, mapping flows and wireframes, then polished design and a prototype, which typically takes a few weeks depending on how many screens you need. We'll agree a clear timeline once we've scoped the product."
      },
      {
        "q": "How much does UI/UX design cost?",
        "a": "We quote each project to your specific product and screen count, with a fixed price set up front and no retainers or surprises. The best way to get a real figure is a short free call where we talk through what you're building."
      },
      {
        "q": "What's the difference between UX and UI, and do I get both?",
        "a": "UX is about how people move through your product so the right step is always the easy one, while UI is how those screens actually look and feel. You get both, starting with user flows and wireframes before we add the polished visual design."
      },
      {
        "q": "Will my developers be able to build from the designs you deliver?",
        "a": "Yes. We hand over tidy, developer-ready files and specs, along with a reusable component library, so your build team can pick it up cleanly without the usual back-and-forth."
      },
      {
        "q": "Can I test the design before anything gets built?",
        "a": "You can. We create a clickable prototype so you can experience the real thing and give feedback before a line of code is written. That way we catch anything early, when it's easy to change."
      }
    ],
    "metaTitle": "UI/UX Design That Feels Obvious · Brandivibe",
    "metaDescription": "Research-led product and website design where the right path is the easy one, handed over ready to build."
  },
  {
    "slug": "graphic-design",
    "num": "02",
    "pillar": "Creative Design",
    "title": "Graphic Design",
    "hook": "A brand that looks as good as it is.",
    "tagline": "Logos, brand kits, and everyday design that make you instantly recognisable.",
    "accent": "#7B6EF6",
    "summary": "Identity and marketing design that stays consistent everywhere people meet your brand.",
    "heroBody": [
      "The way you look is often the first thing people judge, usually in a second or two. We design a brand that earns that glance: a strong logo, a clear palette, and pieces that hold together everywhere you show up.",
      "From the identity itself to the flyers, decks, and posts you use every week, you get design that feels considered and stays consistent, so your brand reads as one confident thing."
    ],
    "bullets": [
      "Logo design",
      "Brand kits",
      "Print & digital",
      "Marketing assets"
    ],
    "capabilities": [
      {
        "title": "Logos with staying power",
        "body": "A mark that works small, scales big, and still feels right in years."
      },
      {
        "title": "A full brand kit",
        "body": "Colours, fonts, and rules so everything you make looks related."
      },
      {
        "title": "Print that feels premium",
        "body": "Flyers, cards, and packaging designed and print-ready."
      },
      {
        "title": "Digital assets",
        "body": "Social graphics, banners, and ads that stay on-brand."
      },
      {
        "title": "Pitch decks and docs",
        "body": "Presentations and reports that look as sharp as your ideas."
      },
      {
        "title": "Templates you can reuse",
        "body": "Editable files so your team keeps things consistent."
      }
    ],
    "whenYouNeedThis": [
      "You're starting out and need a proper identity.",
      "Your brand looks different on every channel.",
      "Your logo no longer fits who you are.",
      "You need marketing pieces that look pulled-together.",
      "You want templates your team can run with."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Get the brief",
        "body": "We learn your brand, audience, and the feeling you want."
      },
      {
        "label": "Step 2",
        "title": "Explore directions",
        "body": "A few distinct concepts to react to, not just one guess."
      },
      {
        "label": "Step 3",
        "title": "Refine the winner",
        "body": "We sharpen your chosen direction into a finished system."
      },
      {
        "label": "Step 4",
        "title": "Build the kit",
        "body": "Guidelines, files, and templates delivered and organised."
      }
    ],
    "deliverables": [
      "Primary and secondary logos",
      "Colour and font system",
      "Brand guidelines",
      "Print-ready marketing pieces",
      "Digital and social assets",
      "Editable templates and source files"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does graphic design and branding take?",
        "a": "A brand project usually moves from brief, to exploring a few directions, to refining your chosen one, then building out the kit, which spans a few weeks depending on how much you need. We'll give you a clear timeline once we understand the scope."
      },
      {
        "q": "How much does graphic design cost?",
        "a": "Every project is quoted to what you actually need, whether that's a logo or a full brand system, with one fixed price agreed up front and no surprises. A quick free call is the easiest way to get a real estimate."
      },
      {
        "q": "Do I get more than one logo option to choose from?",
        "a": "Yes. We explore a few distinct directions for you to react to rather than presenting a single guess, then sharpen your chosen one into a finished identity. It's a real choice, not a take-it-or-leave-it."
      },
      {
        "q": "What's included in a brand kit?",
        "a": "You get primary and secondary logos, a colour and font system, brand guidelines, and both print-ready and digital assets. We also include editable templates and source files so your team can keep everything consistent."
      },
      {
        "q": "Can you design ongoing marketing pieces, not just the logo?",
        "a": "Definitely. Alongside your identity we design the flyers, cards, packaging, social graphics, banners, and pitch decks you use every week, all holding together so your brand reads as one confident thing."
      }
    ],
    "metaTitle": "Graphic Design & Brand Identity · Brandivibe",
    "metaDescription": "Logos, brand kits, and everyday design that make you instantly recognisable and consistent everywhere you show up."
  },
  {
    "slug": "motion-graphics",
    "num": "03",
    "pillar": "Creative Design",
    "title": "Motion Graphics",
    "hook": "Give your brand a little movement.",
    "tagline": "Animated logos, explainers, and social motion that make people stop and watch.",
    "accent": "#7B6EF6",
    "summary": "Motion design that turns static ideas into short, memorable moments of movement.",
    "heroBody": [
      "A bit of well-timed motion does something stillness can't: it catches the eye and makes an idea click. We animate your brand and ideas into short pieces that feel alive and stay on message.",
      "From a logo that resolves with a flourish to an explainer that makes a tricky thing simple, you get motion that's crafted, on-brand, and ready for wherever it needs to play."
    ],
    "bullets": [
      "Logo animation",
      "Explainer videos",
      "Social motion",
      "Animated ads"
    ],
    "capabilities": [
      {
        "title": "Logos that come alive",
        "body": "An animated version of your mark for intros, sites, and stings."
      },
      {
        "title": "Explainers that click",
        "body": "Short animations that make a complex idea feel simple."
      },
      {
        "title": "Motion for social",
        "body": "Eye-catching animated posts and stories built to stop the scroll."
      },
      {
        "title": "Animated ads",
        "body": "Short, punchy pieces designed to hold attention and convert."
      },
      {
        "title": "Kinetic type",
        "body": "Words that move with rhythm to land your key message."
      },
      {
        "title": "Ready for anywhere",
        "body": "Exported in the formats and sizes each platform needs."
      }
    ],
    "whenYouNeedThis": [
      "You want a logo animation for videos and intros.",
      "You need to explain something tricky, fast.",
      "Your static posts aren't stopping the scroll.",
      "You're running ads and want them to move.",
      "You'd like your brand to feel more alive online."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Nail the message",
        "body": "We settle what the piece needs to say and to whom."
      },
      {
        "label": "Step 2",
        "title": "Storyboard it",
        "body": "A visual plan of the frames and flow before we animate."
      },
      {
        "label": "Step 3",
        "title": "Animate",
        "body": "We bring it to life with timing, sound, and on-brand style."
      },
      {
        "label": "Step 4",
        "title": "Deliver in every size",
        "body": "Final files exported for every place you'll use them."
      }
    ],
    "deliverables": [
      "Storyboard and concept",
      "Animated logo or intro",
      "Finished motion piece",
      "Platform-sized versions",
      "Sound and music",
      "Source and export files"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "How long does a motion graphics project take?",
        "a": "A piece typically moves from nailing the message, to a storyboard, to animation and final export, which usually takes a couple of weeks depending on length and complexity. We'll set clear dates with you before we begin."
      },
      {
        "q": "How much do motion graphics cost?",
        "a": "We quote each animation to what you're making, from a short logo sting to a full explainer, with a fixed price agreed up front and no hidden extras. A free call is the best way to get a real estimate for your piece."
      },
      {
        "q": "What kinds of motion graphics can you make?",
        "a": "We create animated logos for intros and sites, explainer videos that make tricky ideas click, scroll-stopping motion for social, animated ads, and kinetic type that lands your key message. If it needs movement, we can bring it to life."
      },
      {
        "q": "Will I see a plan before you start animating?",
        "a": "Yes. We storyboard the frames and flow so you can see and approve the visual plan before any animation happens. That keeps everyone aligned and avoids surprises in the final piece."
      },
      {
        "q": "Will the animation be ready for every platform I post on?",
        "a": "It will. We export your finished piece in the formats and sizes each platform needs, along with sound, music, and the source files. You get versions ready to play wherever you use them."
      }
    ],
    "metaTitle": "Motion Graphics & Animation · Brandivibe",
    "metaDescription": "Animated logos, explainers, and social motion that make people stop and watch, crafted on-brand and ready to play."
  },
  {
    "slug": "ai-automation-systems",
    "num": "01",
    "pillar": "AI & Automation",
    "title": "AI Automation Systems",
    "hook": "An extra pair of hands that never sleeps.",
    "tagline": "Custom workflows that quietly handle the repetitive work, so your days go to the things only you can do.",
    "accent": "#2FBF71",
    "summary": "We build automations that source leads, chase follow-ups, and publish on schedule, running in the background so nothing slips.",
    "heroBody": [
      "Every business has a pile of small, repeatable tasks that eat the day: copying data between apps, sending the same follow-up, posting the same update. We take that pile off your plate by wiring your tools together into workflows that just run.",
      "You stay in charge and see everything that happens. We start with one job that's costing you time, get it working beautifully, then add more, so the wins add up week after week without a big scary switchover."
    ],
    "bullets": [
      "Lead sourcing",
      "Follow-up flows",
      "Auto publishing",
      "Tools connected"
    ],
    "capabilities": [
      {
        "title": "Your apps, finally talking",
        "body": "We connect the tools you already pay for so data moves on its own."
      },
      {
        "title": "Leads that find their way in",
        "body": "Fresh prospects captured, tidied, and dropped into your pipeline."
      },
      {
        "title": "Follow-ups that never forget",
        "body": "The right message goes out at the right moment, every time."
      },
      {
        "title": "Publishing on autopilot",
        "body": "Posts and updates scheduled and sent while you get on with work."
      },
      {
        "title": "Tidy data, less admin",
        "body": "Records cleaned and filed automatically, so nothing gets lost."
      },
      {
        "title": "A clear view of it all",
        "body": "Simple dashboards and alerts so you always know it's running."
      }
    ],
    "whenYouNeedThis": [
      "You're doing the same task by hand for the tenth time today.",
      "You'd love to grow without adding another salary just yet.",
      "You keep meaning to follow up, but the day runs away.",
      "You want your evenings back from copy-paste busywork.",
      "You'd rather your team spent time on people, not admin."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Spot the time sinks",
        "body": "We look at your week and pick the tasks worth automating first."
      },
      {
        "label": "Step 2",
        "title": "Map the flow",
        "body": "We sketch exactly what happens, step by step, and you sign off."
      },
      {
        "label": "Step 3",
        "title": "Build & connect",
        "body": "We wire it up, test it hard, and switch it on with you watching."
      },
      {
        "label": "Ongoing",
        "title": "Watch & widen",
        "body": "We keep it healthy and add new workflows as you find more to save."
      }
    ],
    "deliverables": [
      "Working automation system",
      "Connected app integrations",
      "Lead capture flow",
      "Follow-up sequences",
      "Monitoring dashboard",
      "Plain-English handover guide"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What is an AI automation system and what can it actually do for my business?",
        "a": "It's a set of custom workflows that wire your existing apps together so repetitive jobs run on their own, like sourcing leads, sending follow-ups, tidying data, and publishing posts on schedule. You stay in charge and see everything that happens, while the busywork quietly takes care of itself in the background."
      },
      {
        "q": "How long does it take to set up an AI automation system?",
        "a": "We usually start with one task that's costing you the most time and get it working beautifully before adding more, so you often see your first automation running within a couple of weeks. From there we widen it step by step, so the wins add up without a big, scary switchover."
      },
      {
        "q": "How much does an AI automation system cost?",
        "a": "Every setup is different, so we quote your specific workflows and agree one clear, fixed price up front, with no retainers and no surprises. The best way to get a real estimate is a free call where we look at your week and spot the tasks worth automating first."
      },
      {
        "q": "Do I need to replace the tools I already use?",
        "a": "Not at all. We connect the apps you already pay for so your data moves between them on its own, which means you keep the tools your team knows and simply get them talking to each other."
      },
      {
        "q": "How do I know the automations are running properly?",
        "a": "You get simple dashboards and alerts so you can always see it's working, plus a plain-English handover guide. And because we build one flow at a time and test each one hard before switching it on, you're never left guessing."
      }
    ],
    "metaTitle": "AI Automation Systems — Repetitive Work, Handled · Brandivibe",
    "metaDescription": "Friendly, custom AI automations that source leads, send follow-ups, and publish for you, so your team gets its time back and grows without extra headcount."
  },
  {
    "slug": "ai-agent-development",
    "num": "02",
    "pillar": "AI & Automation",
    "title": "AI Agent Development",
    "hook": "A helpful teammate who's always on shift.",
    "tagline": "Custom AI assistants that answer questions, qualify leads, and handle the everyday, in your voice and on your terms.",
    "accent": "#2FBF71",
    "summary": "We build AI agents for support, sales, and operations that feel like a well-briefed member of your team.",
    "heroBody": [
      "Imagine a teammate who knows your business inside out, replies in seconds, and is happy to work nights and weekends. That's an AI agent: a custom assistant we train on your knowledge to help your customers and lighten your load.",
      "It handles the routine questions and first steps, then hands anything tricky to a real person with the full context. You decide what it can do, and it always sounds like you, warm, clear, and on-brand."
    ],
    "bullets": [
      "Support answers",
      "Lead qualifying",
      "Ops helper",
      "Human handoff"
    ],
    "capabilities": [
      {
        "title": "Support that answers fast",
        "body": "Common questions handled instantly, day or night, in your tone."
      },
      {
        "title": "Leads gently qualified",
        "body": "It asks the right questions and passes warm ones to your team."
      },
      {
        "title": "Trained on your world",
        "body": "We teach it your docs, products, and FAQs so answers stay accurate."
      },
      {
        "title": "Knows when to step aside",
        "body": "Anything sensitive goes to a human with the whole conversation attached."
      },
      {
        "title": "Helps your team too",
        "body": "An internal assistant that finds answers and speeds up daily tasks."
      },
      {
        "title": "Lives where you work",
        "body": "Website, WhatsApp, email, or your own tools, wherever suits you."
      }
    ],
    "whenYouNeedThis": [
      "You're answering the same questions again and again.",
      "You want quick replies without hiring a bigger support team.",
      "Good leads slip away while you're busy elsewhere.",
      "You'd like round-the-clock help without round-the-clock hours.",
      "You want to grow your service without growing your overheads."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Learn the job",
        "body": "We agree what the agent should handle and where humans take over."
      },
      {
        "label": "Step 2",
        "title": "Teach it your stuff",
        "body": "We feed it your knowledge and shape its voice to match yours."
      },
      {
        "label": "Step 3",
        "title": "Test with care",
        "body": "We try real questions, tune the answers, and set safe boundaries."
      },
      {
        "label": "Step 4",
        "title": "Launch & improve",
        "body": "We go live, watch real chats, and keep making it smarter."
      }
    ],
    "deliverables": [
      "Custom AI agent",
      "Trained knowledge base",
      "Brand-matched voice and tone",
      "Human handoff rules",
      "Channel integrations",
      "Conversation reports"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What is a custom AI agent and how is it different from a basic chatbot?",
        "a": "It's a custom assistant we train on your own knowledge, products, and FAQs, so it answers accurately and sounds like your brand rather than reading from a generic script. It can handle support questions, qualify leads, and help your team, then pass anything tricky to a real person with the full context attached."
      },
      {
        "q": "How long does it take to build an AI agent?",
        "a": "We work through it in clear steps, agreeing what the agent should handle, teaching it your knowledge, testing it carefully with real questions, then going live, which typically takes a few weeks depending on how much it needs to know. We keep improving it from real conversations after launch too."
      },
      {
        "q": "How much does an AI agent cost?",
        "a": "It depends on what you want the agent to do and where it lives, so we quote your project and agree one fixed price up front, with no retainers or hidden extras. A free call is the easiest way to get a real estimate for your situation."
      },
      {
        "q": "Will the AI agent sound like my brand or like a robot?",
        "a": "It'll sound like you. We shape its voice and tone to match your brand so it feels warm, clear, and on-brand, and it always stays within the limits you set for what it can and can't do."
      },
      {
        "q": "Can the AI agent hand a conversation over to a real person?",
        "a": "Yes, and that's built in from the start. It handles the routine questions and first steps, then passes anything sensitive or complex to a human with the whole conversation attached, so nothing gets lost in the handover."
      },
      {
        "q": "Where can the AI agent work? Website, WhatsApp, or somewhere else?",
        "a": "Wherever suits you. We can put it on your website, WhatsApp, email, or your own internal tools, so it meets your customers and your team where they already are."
      }
    ],
    "metaTitle": "AI Agent Development — Your Always-On Teammate · Brandivibe",
    "metaDescription": "Friendly custom AI assistants for support, sales, and ops, trained in your voice, that answer fast and hand the tricky stuff to your team."
  },
  {
    "slug": "ai-content-engine",
    "num": "03",
    "pillar": "AI & Automation",
    "title": "AI Content Engine",
    "hook": "Fresh, on-brand articles on a steady schedule.",
    "tagline": "An always-on pipeline that drafts and publishes SEO-friendly articles that sound like you, with a human check before anything goes live.",
    "accent": "#2FBF71",
    "summary": "We set up a content engine that plans, drafts, and publishes on-brand articles, keeping your site fresh without the weekly scramble.",
    "heroBody": [
      "Publishing regularly is how you get found on Google and stay top of mind, but keeping it up is hard when you're running a business. Our content engine takes the heavy lifting: it researches topics, drafts articles in your voice, and lines them up ready to go.",
      "You stay the editor. Every piece is built around real search topics and checked by a person before it publishes, so your blog grows steadily with content that reads like you wrote it, minus the blank-page mornings."
    ],
    "bullets": [
      "Topic planning",
      "On-brand drafts",
      "SEO built in",
      "Human review"
    ],
    "capabilities": [
      {
        "title": "Topics worth writing",
        "body": "We find the searches your customers make and turn them into a plan."
      },
      {
        "title": "Drafts in your voice",
        "body": "Articles shaped to your tone, so they sound like your brand, not a robot."
      },
      {
        "title": "SEO baked in",
        "body": "Headings, structure, and keywords handled so pieces are ready to rank."
      },
      {
        "title": "A human in the loop",
        "body": "Every article gets a real review before it ever goes live."
      },
      {
        "title": "Publishes itself",
        "body": "Approved pieces post to your site on schedule, no copy-paste needed."
      },
      {
        "title": "Grows with your goals",
        "body": "We steer topics toward the services you most want to sell."
      }
    ],
    "whenYouNeedThis": [
      "Your blog's gone quiet and you'd love it buzzing again.",
      "You want steady traffic from Google without hiring a writer.",
      "You know content matters but never find the hours.",
      "You'd like a full pipeline instead of one-off scrambles.",
      "You want to grow your reach without growing your to-do list."
    ],
    "process": [
      {
        "label": "Step 1",
        "title": "Set the direction",
        "body": "We learn your voice and goals, then build a topic plan around them."
      },
      {
        "label": "Step 2",
        "title": "Build the pipeline",
        "body": "We set up research, drafting, and publishing tuned to your brand."
      },
      {
        "label": "Step 3",
        "title": "Draft & review",
        "body": "Articles are written, then checked by a person before approval."
      },
      {
        "label": "Ongoing",
        "title": "Publish & refine",
        "body": "Pieces go live on schedule while we sharpen topics from what performs."
      }
    ],
    "deliverables": [
      "Content pipeline setup",
      "Keyword-led topic plan",
      "Brand voice guide",
      "Scheduled article drafts",
      "Human review workflow",
      "Monthly performance summary"
    ],
    "relatedDemos": [],
    "faqs": [
      {
        "q": "What is an AI content engine and how does it keep my blog updated?",
        "a": "It's an always-on pipeline we set up that researches topics, drafts articles in your voice, and lines them up ready to publish on a steady schedule. It keeps your site fresh and helps you get found on Google, without the weekly scramble of starting from a blank page."
      },
      {
        "q": "Do humans review the articles before they go live?",
        "a": "Always. Every piece gets a real review before it publishes, and you stay the editor throughout, so your blog grows steadily with content you're happy to put your name to."
      },
      {
        "q": "How long does it take to get an AI content engine running?",
        "a": "We start by learning your voice and goals and building a topic plan, then set up the research, drafting, and publishing steps, which usually takes a few weeks. After that, articles flow on schedule and we keep sharpening the topics based on what performs."
      },
      {
        "q": "How much does an AI content engine cost?",
        "a": "Every content engine is tailored to your voice, goals, and publishing pace, so we quote your setup and agree one clear, fixed price up front, with no retainers or surprises. A free call is the best way to get a real estimate for what you need."
      },
      {
        "q": "Will the articles actually sound like my brand?",
        "a": "Yes, that's the whole point. We build a brand voice guide and shape every draft to your tone, so pieces read like you wrote them rather than something a robot churned out."
      },
      {
        "q": "Can the content engine focus on the services I most want to sell?",
        "a": "Definitely. We steer the topic plan toward the searches your customers make and the services you're keenest to grow, so your content is working toward real business goals, not just filling space."
      }
    ],
    "metaTitle": "AI Content Engine — Always-On, On-Brand Articles · Brandivibe",
    "metaDescription": "A friendly, always-on content pipeline that drafts and publishes SEO-friendly, on-brand articles, with a human check, so your blog grows on its own."
  }
];

export const getServicesByPillar = (pillarTitle: string): Service[] =>
  services.filter((s) => s.pillar === pillarTitle);
