import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CARE Beauty Solution',
  description:
    'Production-grade infrastructure foundation, DevOps, CI/CD pipelines, observability, security hardening, and pre-launch e-commerce platform for Care Beauty Solution.',
  metadataBase: new URL('https://carebeautysolution.com'),
  openGraph: {
    title: 'CARE Beauty Solution',
    description:
      'Production-grade infrastructure foundation, DevOps, CI/CD pipelines, observability, security hardening, and pre-launch e-commerce platform for Care Beauty Solution.',
    url: 'https://carebeautysolution.com',
    siteName: 'CARE Beauty Solution',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
