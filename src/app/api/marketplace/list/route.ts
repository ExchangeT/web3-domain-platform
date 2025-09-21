import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { domain, price, seller } = await request.json();

    if (!domain || !price || !seller) {
      return NextResponse.json(
        { error: 'Domain, price, and seller are required' },
        { status: 400 }
      );
    }

    // Here you would interact with your marketplace contract
    console.log('Listing domain:', { domain, price, seller });

    // Simulate successful listing
    const result = {
      success: true,
      transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
      domain: domain,
      price: price,
      seller: seller,
      listedAt: new Date().toISOString()
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Domain listing error:', error);
    return NextResponse.json(
      { error: 'Failed to list domain' },
      { status: 500 }
    );
  }
}