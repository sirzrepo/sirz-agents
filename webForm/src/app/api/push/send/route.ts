import { NextRequest, NextResponse } from 'next/server';
// Remove Clerk import
// import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import webpush from 'web-push';

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  'mailto:your_app_email@yourdomain.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

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
    
    const { title, body, data } = await req.json();
    
    if (!title || !body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      );
    }
    
    // Get all subscriptions for the user
    const subscriptions = await db.pushSubscription.findMany({
      where: { userId },
    });
    
    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No subscriptions found for user' },
        { status: 404 }
      );
    }
    
    // Send push notification to all user's subscriptions
    const notifications = subscriptions.map(async (subscription: any) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify({
            title,
            body,
            data,
          })
        );
      } catch (error: any) {
        console.error('Error sending push notification:', error);
        
        // If the subscription is no longer valid, remove it
        if (error.statusCode === 410) {
          await db.pushSubscription.delete({
            where: {
              userId_endpoint: {
                userId,
                endpoint: subscription.endpoint,
              },
            },
          });
        }
      }
    });
    
    await Promise.all(notifications);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send push notifications' },
      { status: 500 }
    );
  }
} 