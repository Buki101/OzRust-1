import './globals.css';

export const metadata = {
  title: 'Netherpunch',
  description: 'Netherpunch competitive hub for subscriptions, leaderboards, and player pages.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
