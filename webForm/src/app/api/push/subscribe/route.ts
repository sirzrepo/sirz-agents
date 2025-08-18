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
    
    const subscription = await req.json();
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 }
      );
    }
    
    // Store the subscription in the database
    await db.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
} 