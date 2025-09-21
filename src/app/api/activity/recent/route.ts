import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const mockActivity = [
      { id: '1', type: 'registration', domain: 'john.web3', user: '0x1234...5678', timestamp: '2 min ago' },
      { id: '2', type: 'sale', domain: 'crypto.dao', price: '2.5 ETH', user: '0x9876...4321', timestamp: '5 min ago' },
      { id: '3', type: 'listing', domain: 'game.nft', price: '1.2 ETH', user: '0x5555...7777', timestamp: '8 min ago' },
      { id: '4', type: 'registration', domain: 'alice.defi', user: '0x1111...2222', timestamp: '12 min ago' },
      { id: '5', type: 'sale', domain: 'web3.crypto', price: '3.8 ETH', user: '0x3333...4444', timestamp: '15 min ago' }
    ];

    return NextResponse.json({ activities: mockActivity });
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activity' },
      { status: 500 }
    );
  }
}