import './globals.css';

export const metadata = {
  title: 'Netherpunch Sign In',
  description: 'Premium sign-in surface for Netherpunch.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
