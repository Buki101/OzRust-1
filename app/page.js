export default function Home() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <a href="#" className="top-link">
          <span className="icon" aria-hidden="true">
            🎮
          </span>{' '}
          HOME
        </a>
        <h1>NETHERPUNCH</h1>
      </header>

      <main className="hero">
        <section className="signin-card" aria-label="Sign in form">
          <p className="eyebrow">ACCOUNT ACCESS</p>
          <h2>SIGN IN REQUIRED</h2>
          <p className="subtitle">
            You need to sign in before using subscriptions, leaderboards, or player pages.
          </p>

          <form>
            <label htmlFor="username">USERNAME</label>
            <input id="username" name="username" type="text" autoComplete="username" />

            <label htmlFor="password">PASSWORD</label>
            <input id="password" name="password" type="password" autoComplete="current-password" />

            <button type="submit">SIGN IN</button>
          </form>
        </section>
      </main>
    </div>
  );
}
