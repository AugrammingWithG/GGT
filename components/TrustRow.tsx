import TrustBadges from "./TrustBadges";

export default function TrustRow({ lead }: { lead: string }) {
  return (
    <section className="trust">
      <div className="wrap" style={{ textAlign: "center", padding: "24px 24px 0" }}>
        <p style={{ maxWidth: "56ch", margin: "0 auto", color: "var(--ink-soft)", fontSize: ".95rem" }}>
          {lead}
        </p>
      </div>
      <TrustBadges />
    </section>
  );
}
