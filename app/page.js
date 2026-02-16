const featureCards = [
  {
    title: 'Live Arena Tracking',
    description: 'Follow active matches with instant stat updates, objective timing, and real-time combat heatmaps.'
  },
  {
    title: 'Elite Squad Analytics',
    description: 'Break down team performance with role efficiency, win-condition trends, and progression insights.'
  },
  {
    title: 'Season Rewards Hub',
    description: 'Track premium milestones, battle pass rewards, and exclusive cosmetics across every tier.'
  }
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    perks: ['Public leaderboard access', 'Basic profile stats', 'Community match recaps']
  },
  {
    name: 'Pro',
    price: '$9/mo',
    perks: ['Advanced analytics', 'Custom stat dashboards', 'Priority event notifications'],
    highlighted: true
  },
  {
    name: 'Legend',
    price: '$19/mo',
    perks: ['Squad performance suite', 'Coach-level data exports', 'Private meta trend reports']
  }
];

export default function Home() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#" className="top-link">
          <span className="icon" aria-hidden="true">
            🎮
          </span>
          HOME
        </a>

        <nav className="top-nav" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#leaderboard">Leaderboard</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <h1>NETHERPUNCH</h1>
      </header>

      <main className="page-content">
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow">PREMIUM COMPETITIVE PLATFORM</p>
            <h2>Own The Meta With Deeper Match Intelligence</h2>
            <p className="subtitle">
              Netherpunch gives players and squads a high-fidelity view of performance, progression, and strategy.
              Turn every match into an edge.
            </p>
            <div className="hero-actions">
              <button type="button">Start Free</button>
              <a href="#features" className="ghost-link">
                Explore Features
              </a>
            </div>
          </div>

          <section className="signin-card" aria-label="Sign in form">
            <p className="eyebrow">ACCOUNT ACCESS</p>
            <h3>SIGN IN REQUIRED</h3>
            <p className="subtitle">Sign in to unlock subscriptions, leaderboards, and player progression pages.</p>

            <form>
              <label htmlFor="username">USERNAME</label>
              <input id="username" name="username" type="text" autoComplete="username" />

              <label htmlFor="password">PASSWORD</label>
              <input id="password" name="password" type="password" autoComplete="current-password" />

              <button type="submit">SIGN IN</button>
            </form>
          </section>
        </section>

        <section className="section" id="features">
          <div className="section-heading">
            <p className="eyebrow">PLATFORM CAPABILITIES</p>
            <h3>Everything You Need To Compete At The Top</h3>
          </div>
          <div className="feature-grid">
            {featureCards.map((feature) => (
              <article key={feature.title} className="glass-panel">
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section split" id="leaderboard">
          <article className="glass-panel leaderboard-panel">
            <p className="eyebrow">TOP RANKED THIS WEEK</p>
            <h3>Leaderboard Snapshot</h3>
            <ul>
              <li>
                <span>#1</span> NyxPrime <strong>2,980 MMR</strong>
              </li>
              <li>
                <span>#2</span> VantaFox <strong>2,940 MMR</strong>
              </li>
              <li>
                <span>#3</span> AegisRune <strong>2,901 MMR</strong>
              </li>
              <li>
                <span>#4</span> EmberShift <strong>2,866 MMR</strong>
              </li>
            </ul>
          </article>

          <article className="glass-panel">
            <p className="eyebrow">SEASON PROGRESSION</p>
            <h3>Track Your Climb</h3>
            <p>
              Follow your rank history, role consistency, and objective efficiency with timeline-based reports built for
              serious competitors.
            </p>
            <a href="#pricing" className="ghost-link">
              View Plans
            </a>
          </article>
        </section>

        <section className="section" id="pricing">
          <div className="section-heading">
            <p className="eyebrow">SUBSCRIPTIONS</p>
            <h3>Choose The Right Competitive Tier</h3>
          </div>
          <div className="pricing-grid">
            {pricingTiers.map((tier) => (
              <article key={tier.name} className={`glass-panel pricing-card${tier.highlighted ? ' featured' : ''}`}>
                <h4>{tier.name}</h4>
                <p className="price">{tier.price}</p>
                <ul>
                  {tier.perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
                <button type="button">Select Plan</button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Netherpunch. All rights reserved.</p>
        <div>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
}
