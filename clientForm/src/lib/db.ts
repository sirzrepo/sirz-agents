// Simple in-memory database for push notifications
// In a production app, you would use a real database like Prisma, MongoDB, etc.

interface PushSubscription {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}

// In-memory storage
const pushSubscriptions: PushSubscription[] = [];

export const db = {
  pushSubscription: {
    create: async (data: { data: PushSubscription }) => {
      pushSubscriptions.push(data.data);
      return data.data;
    },
    findMany: async (params: { where: { userId: string } }) => {
      return pushSubscriptions.filter(sub => sub.userId === params.where.userId);
    },
    delete: async (params: { where: { userId_endpoint: { userId: string; endpoint: string } } }) => {
      const { userId, endpoint } = params.where.userId_endpoint;
      const index = pushSubscriptions.findIndex(
        sub => sub.userId === userId && sub.endpoint === endpoint
      );
      if (index !== -1) {
        pushSubscriptions.splice(index, 1);
      }
    },
    deleteMany: async (params: { where: { userId: string; endpoint: string } }) => {
      const { userId, endpoint } = params.where;
      const filtered = pushSubscriptions.filter(
        sub => !(sub.userId === userId && sub.endpoint === endpoint)
      );
      pushSubscriptions.length = 0;
      pushSubscriptions.push(...filtered);
    }
  }
}; 