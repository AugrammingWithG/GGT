import type { Metadata } from "next";
import BookingCta from "@/components/BookingCta";
import { FAREHARBOR_FLAGSHIP_ITEM_ID } from "@/lib/fareharbor";

export const metadata: Metadata = {
  title: "Jimmy's Recipes",
  description:
    "Three dishes from Jimmy's kitchen — a taste of what's cooked on the road, before you book the day.",
  alternates: { canonical: "/recipes" },
};

type Recipe = {
  eyebrow: string;
  name: string;
  intro: string;
  image: string;
  imageCaption: string;
  ingredients: string[];
  method: string[];
  note?: string;
};

const RECIPES: Recipe[] = [
  {
    eyebrow: "Starter",
    name: "Asparagus with Truffle Oil & Grated Parmesan",
    intro:
      "A five-minute plate that leans entirely on good produce — the kind of thing Jimmy throws together between cellar doors.",
    image: "/images/SYDNEY080118_0210-1.jpg",
    imageCaption: "Fresh local produce",
    ingredients: [
      "16 asparagus spears",
      "Truffle oil",
      "20g grated Parmesan cheese",
      "Salt and pepper",
      "Juice of ½ lemon",
    ],
    method: [
      "Trim the woody ends off the asparagus and cut each spear in half.",
      "Blanch in boiling salted water for 4 minutes, then plunge into ice water to stop the cooking.",
      "Pat dry and arrange on a serving plate.",
      "Drizzle generously with truffle oil, then top with Parmesan, salt, pepper and lemon juice.",
      "Serve warm or at room temperature.",
    ],
  },
  {
    eyebrow: "Main",
    name: "Pumpkin & Cashew Nut Stuffed Field Mushrooms",
    intro:
      "Slow-roasted pumpkin, crushed cashews and a hit of chilli, stuffed into field mushrooms and finished on the grill.",
    image: "/images/SYDNEY080118_0168.jpg",
    imageCaption: "On the grill",
    ingredients: [
      "¼ Japanese pumpkin, sliced",
      "½ bunch mint",
      "200g roasted salted cashews",
      "2 garlic cloves",
      "50g grated Parmesan",
      "1 brown onion",
      "1 bird's eye chilli",
      "20ml rice wine vinegar",
      "Salt and pepper",
      "12 field mushrooms",
      "100g fetta cheese",
      "Sliced shallots / green onions",
    ],
    method: [
      "Roast the pumpkin wedges with the whole chilli, garlic and halved onion at 180°C for 50 minutes until tender.",
      "Drop the oven to 140°C and continue roasting for another hour to reduce moisture.",
      "Finely chop the cooked onion, garlic and chilli.",
      "Crush the cashews with a mortar and pestle to a chunky texture.",
      "Mash the pumpkin to a chunky consistency and combine with the cashews and chilli mixture, seasoning with salt, pepper and vinegar.",
      "Fill the mushroom caps with the mixture and top with crumbled fetta.",
      "Bake, grill or barbecue until the mushrooms are cooked through.",
      "Garnish with green onions before serving.",
    ],
  },
  {
    eyebrow: "Dessert",
    name: "Jimmy's Wattleseed Crème Brûlée",
    intro:
      "A native twist on the classic — wattleseed through the custard, finished with a torched sugar crust.",
    image: "/images/creme-brulee-and-white-wine-1024x439-1.jpg",
    imageCaption: "The finished dish",
    ingredients: [
      "300ml cream",
      "200ml milk",
      "75g caster sugar, plus extra to caramelise",
      "5 egg yolks",
      "¼ vanilla bean pod",
      "1 tsp ground wattleseed",
    ],
    method: [
      "Preheat the oven to 160°C.",
      "Heat the cream, milk, vanilla bean and wattleseed until simmering, then remove from the heat.",
      "Whisk the egg yolks with the sugar until pale and the sugar has dissolved.",
      "Slowly add the hot mixture to the yolks while stirring constantly, then remove the vanilla pod and skim off any foam.",
      "Pour into 6 ramekins set in a deep baking tray.",
      "Fill the tray with hot water halfway up the sides of the ramekins and cover with foil.",
      "Bake for 30–35 minutes, until the centres wobble slightly like jelly.",
      "Cool, then refrigerate until set.",
      "Sprinkle about 1½ tsp sugar over each, tilt to spread evenly, and torch until nearly caramelised.",
      "Serve with a glass of Hunter Valley Botrytis.",
    ],
    note: "Jimmy's tip: pour the custard through a fine sieve before it hits the ramekins — it catches the foam and the odd bit of vanilla pod.",
  },
];

export default function RecipesPage() {
  return (
    <>
      <section
        className="page-hero"
        style={{ backgroundImage: "url(/images/SYDNEY080118_0119.jpg)" }}
      >
        <div className="wrap">
          <span className="eyebrow">A taste before you go</span>
          <h1>Jimmy&apos;s Recipes</h1>
          <p>
            Three dishes from the road — the rest, you&apos;ll taste on
            tour.
          </p>
        </div>
      </section>

      <section className="pad">
        <div className="wrap" style={{ display: "grid", gap: 44 }}>
          {RECIPES.map((r) => (
            <div key={r.name} className="recipe-card">
              <div
                className="recipe-photo"
                style={{ backgroundImage: `url(${r.image})` }}
              >
                <span>{r.imageCaption}</span>
              </div>
              <div className="recipe-body">
                <span className="eyebrow">{r.eyebrow}</span>
                <h3>{r.name}</h3>
                <p>{r.intro}</p>
                <ul className="recipe-ingredients">
                  {r.ingredients.map((ing) => (
                    <li key={ing}>{ing}</li>
                  ))}
                </ul>
                <ol className="recipe-method">
                  {r.method.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                {r.note && <p className="recipe-note">{r.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Taste it for yourself</h2>
          <p>Book the day, and let Jimmy cook for you.</p>
          <BookingCta
            itemId={FAREHARBOR_FLAGSHIP_ITEM_ID || undefined}
            className="btn btn-gold"
          >
            See the Hunter Valley tour
          </BookingCta>
        </div>
      </section>
    </>
  );
}
