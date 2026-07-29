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
  { src: "/images/AdobeStock_280928026.webp", caption: "Kangaroos in the vines", position: "80% center" },
  { src: "/images/Hunter-Valley-Tour-image-1.jpg", caption: "Raising a glass together", position: "center 25%" },
  { src: "/images/SYDNEY080118_0034.jpg", caption: "Lunch with the group", position: "58% center" },
  { src: "/images/SYDNEY080118_0048-2.jpg", caption: "The first pour of the day" },
  { src: "/images/SYDNEY080118_0120.jpg", caption: "Jimmy, plate in hand", position: "60% center" },

  { src: "/images/Hunter-Valley-Tour-image-3.jpg", caption: "Vines across the valley", position: "62% center" },
  { src: "/images/SYDNEY080118_0037-1.jpg", caption: "Plating up at the cellar door", position: "center 28%" },
  { src: "/images/SYDNEY080118_0106.jpg", caption: "Serving lunch over the vines" },
  { src: "/images/SYDNEY080118_0110.jpg", caption: "Tasting under the chandelier" },
  { src: "/images/SYDNEY080118_0161.jpg", caption: "Sharing a laugh over a glass" },

  { src: "/images/Hunter-Valley-Tour-image-2.jpg", caption: "An afternoon at the cellar door", position: "35% center" },
  { src: "/images/SYDNEY080118_0010.jpg", caption: "Rolling a fresh roll for lunch" },
  { src: "/images/SYDNEY080118_0119.jpg", caption: "Chorizo, fresh off the grill" },
  { src: "/images/SYDNEY080118_0168.jpg", caption: "Scallops, straight off the coals" },
  { src: "/images/AdobeStock_170077815.jpeg", caption: "A crisp white, barrel-side", position: "68% center" },

  { src: "/images/Hunter-Valley-Tour-image-4.jpg", caption: "Fresh produce, prepped on site", position: "60% center" },
  { src: "/images/Hunter-Valley-Tour-image-5.jpg", caption: "Crème brûlée to finish", position: "center 40%" },
  { src: "/images/creme-brulee-and-white-wine-1024x439-1.jpg", caption: "Two wines, ready for dessert", position: "35% center" },
  { src: "/images/SYDNEY080118_0170.jpg", caption: "Guests and Jimmy on the road" },
  { src: "/images/jimmy.webp", caption: "Jimmy — owner, driver & chef", position: "75% center" },

  { src: "/images/ggt-pictures/beaches-bbq.jpg", caption: "BBQ by the beach", position: "45% center" },
  { src: "/images/ggt-pictures/beaches-bbq-1.jpg", caption: "Beachside barbecue with the group", position: "center 42%" },
  { src: "/images/ggt-pictures/blue-mountains.jpg", caption: "Blue Mountains lookout", position: "78% center" },
  { src: "/images/ggt-pictures/blue-mountains-1.jpg", caption: "Exploring the Blue Mountains", position: "center 60%" },
  { src: "/images/ggt-pictures/blue-mountains-2.jpg", caption: "Views across the Blue Mountains" },
  { src: "/images/ggt-pictures/cooking-over-campfire.jpg", caption: "Cooking over the campfire" },
  { src: "/images/ggt-pictures/cooking-over-campfire-1.jpg", caption: "Campfire cooking, Jimmy style", position: "center 58%" },
  { src: "/images/ggt-pictures/cooking-over-campfire-2.jpg", caption: "Fireside feast in the making" },
  { src: "/images/ggt-pictures/ggt-jimmy.jpg", caption: "Jimmy on tour", position: "center 42%" },
  { src: "/images/ggt-pictures/ggt-jimmy-1.jpg", caption: "Jimmy, always ready with a plate" },
  { src: "/images/ggt-pictures/sydney-beaches-tour.jpg", caption: "Sydney beaches tour" },
  { src: "/images/ggt-pictures/sydney-beaches-tour-1.jpg", caption: "A day exploring Sydney's beaches", position: "center 70%" },
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
