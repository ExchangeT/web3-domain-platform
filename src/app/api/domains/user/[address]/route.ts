import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    // Here you would query your backend/blockchain for user domains
    console.log('Fetching domains for address:', address);

    // Mock data for development
    const mockDomains = [
      {
        id: '1',
        name: 'john',
        extension: 'web3',
        fullName: 'john.web3',
        currentOwner: address,
        resolvedAddress: '0x1234567890123456789012345678901234567890',
        isListed: false,
        mintedAt: '2024-09-01T10:00:00Z',
        timesSold: 0,
        textRecords: {
          email: 'john@example.com',
          url: 'https://john.portfolio.com'
        }
      },
      {
        id: '2',
        name: 'myproject',
        extension: 'dao',
        fullName: 'myproject.dao',
        currentOwner: address,
        isListed: true,
        price: '2.5',
        mintedAt: '2024-08-15T14:30:00Z',
        timesSold: 1
      }
    ];

    return NextResponse.json({ domains: mockDomains });
  } catch (error) {
    console.error('Error fetching user domains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    );
  }
}
