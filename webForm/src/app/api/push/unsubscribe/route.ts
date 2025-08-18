import { NextRequest, NextResponse } from 'next/server';
// Remove Clerk import
// import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Get user ID from session or token instead of Clerk
    // For demo purposes, we'll use a hardcoded user ID
    // In a real app, you would get this from your authentication system
    const userId = 'demo-user-id';
    
    // const { userId } = getAuth(req);
    
    // if (!userId) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }
    
    const { endpoint } = await req.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }
    
    // Remove subscription from database
    await db.pushSubscription.deleteMany({
      where: {
        userId,
        endpoint,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
} 