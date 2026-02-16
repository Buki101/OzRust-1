import AuthRequiredCard from '../components/AuthRequiredCard';
import SiteShell from '../components/SiteShell';

export default function SubscriptionsPage() {
  return (
    <SiteShell
      title="Subscriptions"
      subtitle="Choose your plan and unlock premium progression tracking features."
    >
      <section className="content-grid">
        <AuthRequiredCard context="subscriptions and payment settings" />

        <section className="panel-grid">
          <article className="info-panel">
            <h3>Starter</h3>
            <p>Entry access with public leaderboard insights.</p>
          </article>
          <article className="info-panel featured-panel">
            <h3>Pro</h3>
            <p>Advanced analytics, custom dashboards, and event alerts.</p>
          </article>
          <article className="info-panel">
            <h3>Legend</h3>
            <p>Team-level reports, export tools, and elite match intelligence.</p>
          </article>
        </section>
      </section>
    </SiteShell>
  );
}
