// Renamed from convexService to apiService
// This service will handle all API calls without Convex

// User-related functions
export const apiService = {
  // Get the authenticated user
  getAuthenticatedUser: async () => {
    try {
      // Mock implementation
      return null;
    } catch (error) {
      console.error('Error getting authenticated user:', error);
      return null;
    }
  },

  // Register a new user
  registerUser: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      // Mock implementation
      return { success: true, userId: 'mock-user-id' };
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login a user
  loginUser: async (email: string, password: string) => {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Product-related functions
  getProducts: async (options?: {
    searchQuery?: string;
    category?: string;
    available?: boolean;
  }) => {
    try {
      // Mock implementation
      return [];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  },

  getProductById: async (id: string) => {
    try {
      // Mock implementation
      return null;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  },

  // Order-related functions
  createOrder: async (orderData: any) => {
    try {
      // Mock implementation
      return { success: true, orderId: 'mock-order-id' };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  getUserOrders: async () => {
    try {
      // Mock implementation
      return [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  },

  getBranches: async (): Promise<Branch[]> => {
    try {
      // Mock implementation
      return [
        {
          id: '1',
          name: 'Downtown Branch',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phone: '212-555-1234',
          isOpen: true,
          latitude: 40.7128,
          longitude: -74.0060
        },
        {
          id: '2',
          name: 'Uptown Branch',
          address: '456 Park Ave',
          city: 'New York',
          state: 'NY',
          zipCode: '10022',
          phone: '212-555-5678',
          isOpen: true,
          latitude: 40.7589,
          longitude: -73.9851
        },
        {
          id: '3',
          name: 'Brooklyn Branch',
          address: '789 Bedford Ave',
          city: 'Brooklyn',
          state: 'NY',
          zipCode: '11211',
          phone: '718-555-9012',
          isOpen: true,
          latitude: 40.7182,
          longitude: -73.9584
        }
      ];
    } catch (error) {
      console.error('Error fetching branches:', error);
      throw error;
    }
  },
};

// Add the Branch interface
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
} 