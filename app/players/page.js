import AuthRequiredCard from '../components/AuthRequiredCard';
import SiteShell from '../components/SiteShell';

const players = [
  { name: 'NyxPrime', role: 'Duelist', wr: '64%' },
  { name: 'VantaFox', role: 'Controller', wr: '61%' },
  { name: 'AegisRune', role: 'Sentinel', wr: '59%' }
];

export default function PlayersPage() {
  return (
    <SiteShell
      title="Players"
      subtitle="Analyze player history, role efficiency, and recent match momentum."
    >
      <section className="content-grid">
        <AuthRequiredCard context="player profiles and advanced match analytics" />

        <section className="panel-grid" aria-label="Player preview list">
          {players.map((player) => (
            <article className="info-panel" key={player.name}>
              <h3>{player.name}</h3>
              <p>
                Role: {player.role} <br />
                Win Rate: {player.wr}
              </p>
            </article>
          ))}
        </section>
      </section>
    </SiteShell>
  );
}
