declare module '@paystack/inline-js' {
  interface PaystackOptions {
    key: string;
    email: string;
    amount: number;
    ref?: string;
    callback?: (response: any) => void;
    onClose?: () => void;
    onCancel?: () => void;
    onError?: () => void;
    metadata?: Record<string, any>;
  }

  class PaystackPop {
    newTransaction(options: PaystackOptions): void;
  }

  export default PaystackPop;
} 