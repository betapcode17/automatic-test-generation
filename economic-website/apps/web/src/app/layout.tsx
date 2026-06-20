import type { Metadata } from 'next';
import { Header } from '@/components/layout/header';
import { QueryProvider } from '@/components/layout/query-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Economic Website',
  description: 'Modern e-commerce MVP'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <QueryProvider>
          <Header />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
