import { NextRequest, NextResponse } from 'next/server';
import { backendRequest } from '@/lib/backend';

export async function GET(request: NextRequest) {
  try {
    const response = await backendRequest('/categories', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}