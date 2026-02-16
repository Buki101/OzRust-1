export default function AuthRequiredCard({ context }) {
  return (
    <section className="signin-card" aria-label="Sign in form">
      <p className="eyebrow">ACCOUNT ACCESS</p>
      <h2>SIGN IN REQUIRED</h2>
      <p className="subtitle">You need to sign in before using {context}.</p>

      <form>
        <label htmlFor="username">USERNAME</label>
        <input id="username" name="username" type="text" autoComplete="username" />

        <label htmlFor="password">PASSWORD</label>
        <input id="password" name="password" type="password" autoComplete="current-password" />

        <button type="submit">SIGN IN</button>
      </form>
    </section>
  );
}
