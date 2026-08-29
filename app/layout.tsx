import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codex Agent World — 3D AI Office',
  description: 'สำรวจโลกออฟฟิศ 3D ที่สร้างจากเอเจนต์ในโฟลเดอร์ .codex ของคุณ',
  openGraph: {
    title: 'Codex Agent World',
    description: '23 AI Agents · One Living Office',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Codex Agent World 3D office' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codex Agent World',
    description: '23 AI Agents · One Living Office',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
