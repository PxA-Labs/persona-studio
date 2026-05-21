import './globals.css';

export const metadata = {
  title: 'AI Influencer Studio',
  description: 'Manage, generate, and automate your virtual influencer.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
