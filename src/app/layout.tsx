// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Web3Provider from '@/providers/Web3Provider';
import AppLayout from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { Toaster } from 'sonner';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Web3 Domain Platform',
  description: 'Decentralized domain registration and marketplace',
  keywords: ['web3', 'domains', 'blockchain', 'ethereum', 'decentralized'],
  authors: [{ name: 'Web3 Domain Platform' }],
  openGraph: {
    title: 'Web3 Domain Platform',
    description: 'Register and trade Web3 domains on the blockchain',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Web3Provider targetChainId={11155111}>
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster position="top-right" richColors />
          </Web3Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}