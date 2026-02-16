import Link from 'next/link';
import AuthRequiredCard from './components/AuthRequiredCard';
import SiteShell from './components/SiteShell';

const quickLinks = [
  {
    href: '/subscriptions',
    title: 'Subscriptions',
    description: 'Manage your plans, perks, and billing in one premium control center.'
  },
  {
    href: '/leaderboard',
    title: 'Leaderboard',
    description: 'Track seasonal rankings and compare your MMR against top competitors.'
  },
  {
    href: '/players',
    title: 'Players',
    description: 'Browse player profiles, recent matches, and role-based performance trends.'
  }
];

export default function Home() {
  return (
    <SiteShell
      title="Home"
      subtitle="Your command center for subscriptions, rankings, and player intelligence."
    >
      <section className="content-grid">
        <AuthRequiredCard context="subscriptions, leaderboards, and player pages" />

        <section className="panel-grid" aria-label="Available sections">
          {quickLinks.map((item) => (
            <article key={item.href} className="info-panel">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href} className="panel-link">
                Open {item.title}
              </Link>
            </article>
          ))}
        </section>
      </section>
    </SiteShell>
  );
}
