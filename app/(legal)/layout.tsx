/**
 * Shell for the policy pages. Header/Footer/CurrencyProvider now come from
 * the root layout (app/layout.tsx), same as every other page, so this only
 * needs to lay out the legal content itself as a plain paper card
 * (see .legal/.legal-inner in globals.css).
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="legal-shell">
      <main className="legal">
        <div className="wrap">
          <div className="legal-inner">{children}</div>
        </div>
      </main>
    </div>
  );
}
