import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jimmy's Recipes",
  description:
    "Three dishes from Jimmy's kitchen — a taste of what's cooked on the road, before you book the day.",
  alternates: { canonical: "/recipes" },
};

type Recipe = {
  name: string;
  image: string;
  ingredients: string[];
  method: string[];
  note?: string;
};

const RECIPES: Recipe[] = [
  {
    name: "Asparagus with Truffle Oil and Grated Parmesan Cheese",
    image:
      "/images/asparagus-truffle-oil-grated-parmesan-cheese-1152x1536-1.jpeg",
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
    name: "Pumpkin and Cashew Nut Stuffed Field Mushrooms",
    image:
      "/images/pumpkin-and-cashew-nut-stuffed-field-mushrooms-1536x960-1.jpg",
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
    name: "Jimmy's Wattleseed Crème Brûlée",
    image: "/images/jimmys-wattleseed-creme-brule-1536x960-1.jpg",
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

      <section className="pad recipes-section">
        <div className="wrap">
          <div className="recipes-grid">
            {RECIPES.map((r) => (
              <article key={r.name} className="recipe-card">
                <div
                  className="recipe-photo"
                  style={{ backgroundImage: `url(${r.image})` }}
                />
                <div className="recipe-body">
                  <h3>{r.name}</h3>
                  <span className="recipe-byline">By Jimmy Henry</span>
                  <details className="recipe-accordion">
                    <summary>Ingredients</summary>
                    <ul className="recipe-ingredients">
                      {r.ingredients.map((ing) => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  </details>
                  <details className="recipe-accordion">
                    <summary>Method</summary>
                    <ol className="recipe-method">
                      {r.method.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                    {r.note && <p className="recipe-note">{r.note}</p>}
                  </details>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <h2>Taste it for yourself</h2>
          <p>Book the day, and let Jimmy cook for you.</p>
          <Link href="/hunter-valley-tour" className="btn btn-gold">
            See the Hunter Valley tour
          </Link>
        </div>
      </section>
    </>
  );
}
