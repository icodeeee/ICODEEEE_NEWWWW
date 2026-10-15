# Project image sources

Added September 7, 2026 for iCodeee portfolio presentation, following the user's request to use the actual client websites and their imagery.

- `slugsera-campaign.webp`: https://www.slugsera.com/images/cdn/hero-black-hd-v1-1280.webp
- `slugsera-blue.webp`: https://www.slugsera.com/images/cdn/hero-blue-hd-v1-1280.webp
- `slugsera-green.webp`: https://www.slugsera.com/images/cdn/hero-green-hd-v1-1280.webp
- `slugsera-outdoors.webp`: https://www.slugsera.com/images/cdn/hero-pahad-hd-v1-1280.webp
- `slugsera-wordmark.webp`: https://www.slugsera.com/images/texttttlogo.webp
- `rupali-villa.jpg`: the Duplex Luxury Villa image published on https://rupaliconstruction.com/ — https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/a1d1885c-72d6-4bf5-9202-c8352529603d.jpg
- `rupali-interior.png`: Apartment At Sushant Lok image published on https://rupaliconstruction.com/ — https://jyprnabdmsplvlazwtvo.supabase.co/storage/v1/object/public/image/9b0bd635-2175-4371-a8fc-50e7a50983db.png
- `rupali-architecture.webp`: https://rupaliconstruction.com/assets/images/cinematic_architecture.webp (reference asset; not used as a photograph of completed client work).
- `rupali-logo.webp`: https://rupaliconstruction.com/logo-main.webp?v=2

These assets were exported from the rendered client websites. They retain their original imagery; no synthetic photography or fabricated studio/team images were added. Pre-existing House of Walia apparel assets remain from the workspace.

## Awaesthetic Wear

Added to the portfolio alongside the Slugsera and Rupali entries. All files were downloaded from the client's own WordPress uploads directory at the URLs below.

- `aw-mens-hoodies.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/09/MEN-HOODIES-602x1024.jpg
- `aw-gojo.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/10/Jujutsu-Kaisen-Gojo-600x800.jpg
- `aw-black-jacket.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/09/DSC_9241-copy-Large-600x800.jpg
- `aw-pink-jacket.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/09/DSC_5619-copy-Large-600x800.jpg
- `aw-banner-yoga.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/09/BANNER-9.jpg
- `aw-banner-8.jpg`: https://awaestheticwear.com/wp-content/uploads/2024/09/BANNER-8.jpg
- `aw-wordmark.png`: https://awaestheticwear.com/wp-content/uploads/2024/07/AW-LOGO-3.png

`aw-banner-8.jpg` and `aw-wordmark.png` are retained as source assets but are not currently rendered in the portfolio layout.

## Bloombee

Not added. `www.bloombee.com` and the `bloombee.com` apex both fail DNS resolution, so the site could not be verified and no imagery could be sourced. Re-check the correct domain before adding.

## Homepage captures

Captured 13 October 2026. Each file is a screenshot of the client's own homepage, taken in a real browser
at a desktop layout width. These are used for the portfolio cover panels and the homepage contact sheet,
so the portfolio shows the actual first page rather than a representative product or interior photograph.

- `slugsera-home.jpg`: https://www.slugsera.com/ — captured at an effective 1280px layout width
- `rupali-home.jpg`: https://rupaliconstruction.com/ — captured at an effective 1280px layout width
- `aw-home.jpg`: https://awaestheticwear.com/ — captured at an effective 1280px layout width

Method and limitations:

- Captured from a headless browser viewport of 800×655 at devicePixelRatio 2, with `zoom: 0.6` applied to
  force each site into its own desktop breakpoint. Rupali Construction's header overlaps badly below
  ~1000px, so a plain narrow capture is not representative of that site.
- Third-party overlays were hidden before capture: a chat launcher and mascot widget on Rupali, cookie
  and popup containers and the WhatsApp float button on Awaesthetic Wear. Site content itself is unaltered.
- Slugsera's hero is a carousel, so the slide shown varies between captures. Each site has one capture
  and does not regenerate per request.
- Downgraded to JPEG at quality 80, longest edge 1200px. Originals are not retained.

Earlier passes used an iframe harness at 1280/1440px. That was abandoned: the framed document's layout
viewport stayed at the outer 800px regardless of the iframe width, so those captures were unreliable.
The temporary harness was removed.

## Case-study collections and features

Added 15 October 2026 for project-specific case-study sections. Product and feature details are presented
as published by each client; the links on the cards lead to the corresponding live pages.

Slugsera product cards:

- `slugsera-product-seedhe-pahad-se.webp`: https://www.slugsera.com/product/seedhe-pahad-se
- `slugsera-product-slow-down.webp`: https://www.slugsera.com/product/slow-down
- `slugsera-product-savage-tortoise.webp`: https://www.slugsera.com/product/savage-tortoise
- `slugsera-product-let-the-moment-play.jpg`: https://www.slugsera.com/product/let-the-moment-play (official product image, converted to JPEG)
- `slugsera-product-creator.webp`: https://www.slugsera.com/product/creator

Awaesthetic Wear product cards, downloaded from the official WordPress media directory:

- `aw-product-bunny-hoodie.jpg`: https://awaestheticwear.com/wp-content/uploads/2026/10/aw-bunny-hoodie-model-waist.jpg
- `aw-product-dragon-tiger-hoodie.jpg`: https://awaestheticwear.com/wp-content/uploads/2026/10/aw-dragon-tiger-hoodie-model-waist-1.jpg
- `aw-product-fire-hoodie.jpg`: https://awaestheticwear.com/wp-content/uploads/2026/10/aw-fire-hoodie-model-waist.jpg
- `aw-product-love-hoodie.jpg`: https://awaestheticwear.com/wp-content/uploads/2026/10/aw-love-hoodie-model-waist-1.jpg

Rupali Construction feature cards, downloaded from the official website:

- `rupali-advantage-pricing.webp`: https://rupaliconstruction.com/images/whyus_pricing.webp
- `rupali-advantage-payments.webp`: https://rupaliconstruction.com/images/whyus_payments.webp
- `rupali-advantage-quality.webp`: https://rupaliconstruction.com/images/whyus_quality.webp
- `rupali-advantage-tracking.webp`: https://rupaliconstruction.com/images/whyus_tracking.webp
- `rupali-advantage-team.webp`: https://rupaliconstruction.com/images/whyus_team.webp
