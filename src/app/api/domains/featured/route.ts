import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockFeatured = [
      {
        id: '1',
        name: 'bitcoin',
        extension: 'crypto',
        fullName: 'bitcoin.crypto',
        price: '50.0',
        description: 'Premium cryptocurrency domain perfect for Bitcoin-related projects',
        category: 'finance',
        featured: true
      },
      {
        id: '2',
        name: 'metaverse',
        extension: 'web3',
        fullName: 'metaverse.web3',
        price: '25.0',
        description: 'Ideal for virtual world and metaverse applications',
        category: 'gaming',
        featured: true
      },
      {
        id: '3',
        name: 'exchange',
        extension: 'defi',
        fullName: 'exchange.defi',
        price: '15.0',
        description: 'Perfect for decentralized exchange platforms',
        category: 'finance',
        featured: true
      }
    ];

    return NextResponse.json({ domains: mockFeatured });
  } catch (error) {
    console.error('Error fetching featured domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured domains' },
      { status: 500 }
    );
  }
}