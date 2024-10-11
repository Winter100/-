import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: '둥글둥글',
  description: '둥글둥글 길드원 엿보기 구멍',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
