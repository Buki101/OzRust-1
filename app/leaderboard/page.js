import AuthRequiredCard from '../components/AuthRequiredCard';
import SiteShell from '../components/SiteShell';

const entries = [
  ['#1', 'NyxPrime', '2,980 MMR'],
  ['#2', 'VantaFox', '2,940 MMR'],
  ['#3', 'AegisRune', '2,901 MMR'],
  ['#4', 'EmberShift', '2,866 MMR']
];

export default function LeaderboardPage() {
  return (
    <SiteShell
      title="Leaderboard"
      subtitle="See who is dominating this season and where your squad stacks up."
    >
      <section className="content-grid">
        <AuthRequiredCard context="leaderboard filters and full seasonal standings" />

        <section className="info-panel leaderboard-panel" aria-label="Leaderboard preview">
          <h3>Top Ranked This Week</h3>
          <ul>
            {entries.map(([rank, name, score]) => (
              <li key={rank}>
                <span>{rank}</span>
                <strong>{name}</strong>
                <em>{score}</em>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </SiteShell>
  );
}
