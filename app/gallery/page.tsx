import type { Metadata } from "next";
import Link from "next/link";
import GoodMemoriesGallery, { type GalleryPhoto } from "@/components/GoodMemoriesGallery";

export const metadata: Metadata = {
  title: "Gallery of Good Memories",
  description:
    "Photos from the road — cellar doors, chef-cooked lunches and the guests who joined us along the way.",
  alternates: { canonical: "/gallery" },
};

const PHOTOS: GalleryPhoto[] = [
  { src: "/images/AdobeStock_280928026.webp", caption: "Kangaroos in the vines" },
  { src: "/images/Hunter-Valley-Tour-image-1.jpg", caption: "Raising a glass together" },
  { src: "/images/SYDNEY080118_0034.jpg", caption: "Lunch with the group" },
  { src: "/images/SYDNEY080118_0048-2.jpg", caption: "The first pour of the day" },
  { src: "/images/SYDNEY080118_0120.jpg", caption: "Jimmy, plate in hand" },

  { src: "/images/Hunter-Valley-Tour-image-3.jpg", caption: "Vines across the valley" },
  { src: "/images/SYDNEY080118_0037-1.jpg", caption: "Plating up at the cellar door" },
  { src: "/images/SYDNEY080118_0106.jpg", caption: "Serving lunch over the vines" },
  { src: "/images/SYDNEY080118_0110.jpg", caption: "Tasting under the chandelier" },
  { src: "/images/SYDNEY080118_0161.jpg", caption: "Sharing a laugh over a glass" },

  { src: "/images/Hunter-Valley-Tour-image-2.jpg", caption: "An afternoon at the cellar door" },
  { src: "/images/SYDNEY080118_0010.jpg", caption: "Rolling a fresh roll for lunch" },
  { src: "/images/SYDNEY080118_0119.jpg", caption: "Chorizo, fresh off the grill" },
  { src: "/images/SYDNEY080118_0168.jpg", caption: "Scallops, straight off the coals" },
  { src: "/images/AdobeStock_170077815.jpeg", caption: "A crisp white, barrel-side" },

  { src: "/images/Hunter-Valley-Tour-image-4.jpg", caption: "Fresh produce, prepped on site" },
  { src: "/images/Hunter-Valley-Tour-image-5.jpg", caption: "Crème brûlée to finish" },
  { src: "/images/creme-brulee-and-white-wine-1024x439-1.jpg", caption: "Two wines, ready for dessert" },
  { src: "/images/SYDNEY080118_0170.jpg", caption: "Guests and Jimmy on the road" },
  { src: "/images/jimmy.webp", caption: "Jimmy — owner, driver & chef" },
];

export default function GalleryPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/AdobeStock_280928026.webp)" }}
      >
        <div className="wrap">
          <span className="eyebrow">Postcards from the road</span>
          <h1>Gallery of Good Memories</h1>
          <p>
            Cellar doors, chef-cooked lunches, and the guests who joined us
            along the way.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap">
          <GoodMemoriesGallery photos={PHOTOS} />
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Ready to make some memories of your own?</h2>
          <p>Monday and Wednesday, straight from Sydney.</p>
          <Link href="/hunter-valley-tour" className="btn btn-gold">
            See the Hunter Valley Tour
          </Link>
        </div>
      </section>
    </>
  );
}
