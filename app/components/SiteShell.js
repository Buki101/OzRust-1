import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/subscriptions', label: 'Subscriptions' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/players', label: 'Players' }
];

export default function SiteShell({ title, subtitle, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link href="/" className="top-link">
          <span className="icon" aria-hidden="true">
            🎮
          </span>
          NETHERPUNCH
        </Link>

        <nav className="top-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="page-wrap">
        <section className="page-hero">
          <p className="eyebrow">COMPETITIVE HUB</p>
          <h1>{title}</h1>
          <p className="subtitle">{subtitle}</p>
        </section>

        {children}
      </main>
    </div>
  );
}
