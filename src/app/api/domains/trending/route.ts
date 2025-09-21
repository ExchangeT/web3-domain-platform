import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Here you would query your database for trending domains
    const mockTrending = [
      { id: '1', name: 'crypto', extension: 'web3', price: '2.5', change: '+15%', volume: '12.3 ETH' },
      { id: '2', name: 'defi', extension: 'dao', price: '1.8', change: '+8%', volume: '8.7 ETH' },
      { id: '3', name: 'nft', extension: 'crypto', price: '3.2', change: '+22%', volume: '15.1 ETH' },
      { id: '4', name: 'meta', extension: 'web3', price: '4.1', change: '+12%', volume: '9.8 ETH' },
      { id: '5', name: 'ai', extension: 'tech', price: '5.0', change: '+35%', volume: '20.5 ETH' }
    ];

    return NextResponse.json({ domains: mockTrending });
  } catch (error) {
    console.error('Error fetching trending domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trending domains' },
      { status: 500 }
    );
  }
}