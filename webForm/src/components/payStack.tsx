'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import { usePaystackPayment } from 'react-paystack';

interface PaystackReference {
  reference: string;
  transaction: string;
}

interface PaystackButtonProps {
  amount: number;
  email: string;
  metadata?: Record<string, any>;
  onSuccess?: (reference: PaystackReference) => void;
  onError?: (error: any) => void;
}

// Define interfaces for Paystack integration
interface PaystackMetadata {
  custom_fields: Array<{
    display_name: string;
    variable_name: string;
    value: string;
  }>;
  [key: string]: any;
}

interface PaystackProps {
  reference: string;
  email: string;
  amount: number;
  publicKey: string;
  metadata: PaystackMetadata;
  onSuccess: (response: any) => void;
  onClose: () => void;
}

// Client-side only component
const ClientPaystackButton = ({
  amount,
  email,
  metadata = {},
  onSuccess,
  onError,
}: PaystackButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  
  // Get Paystack public key
  const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  // Verify configuration on mount
  useEffect(() => {
    if (!paystackPublicKey) {
      setError('Payment configuration error: Paystack API key is missing');
      console.error('Missing NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY environment variable');
    } else {
      setError(null);
    }
  }, [paystackPublicKey]);
  
  // Create Paystack config
  const config: PaystackProps = {
    reference: new Date().getTime().toString(),
    email,
    amount: amount * 100, // Convert to kobo
    publicKey: paystackPublicKey || '',
    metadata: {
      ...metadata,
      custom_fields: [
        {
          display_name: 'Payment For',
          variable_name: 'payment_for',
          value: 'UncleReuben Order',
        },
      ],
    },
    onSuccess: (response: any) => {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess({
          reference: response.reference || '',
          transaction: response.transaction || response.trxref || ''
        });
      }
    },
    onClose: () => {
      setIsLoading(false);
      const error = new Error('Payment was cancelled by user');
      toast.error('Payment was cancelled');
      if (onError) onError(error);
    }
  };
  
  // Handle payment success
  const onSuccessCallback = (response: any) => {
    setIsLoading(false);
    if (onSuccess) {
      onSuccess({
        reference: response.reference || '',
        transaction: response.transaction || response.trxref || ''
      });
    }
  };
  
  // Handle payment close/cancel
  const onCloseCallback = () => {
    setIsLoading(false);
    const error = new Error('Payment was cancelled by user');
    toast.error('Payment was cancelled');
    if (onError) onError(error);
  };

  // Initialize payment at the top level (not conditionally)
  const initializePayment = usePaystackPayment(config);
  
  // Update payment initialization status
  useEffect(() => {
    if (!paymentInitialized && typeof initializePayment === 'function' && !error) {
      setPaymentInitialized(true);
    }
  }, [initializePayment, paymentInitialized, error]);

  const handlePayment = () => {
    if (error) {
      toast.error(error);
      if (onError) onError(new Error(error));
      return;
    }
    
    if (!initializePayment) {
      const errorMsg = 'Payment system not properly initialized';
      toast.error(errorMsg);
      if (onError) onError(new Error(errorMsg));
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Initialize payment with callbacks
      initializePayment({
        onSuccess: onSuccessCallback,
        onClose: onCloseCallback
      });
    } catch (err) {
      setIsLoading(false);
      const errorMsg = 'Error initializing payment';
      toast.error(errorMsg);
      console.error(errorMsg, err);
      if (onError) onError(err);
    }
  };

  // Show error UI if there's a configuration problem
  if (error) {
    return (
      <Button
        disabled={true}
        className="w-full bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
      >
        <AlertCircle className="mr-2 h-4 w-4" />
        {error}
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading || !paymentInitialized}
      className="w-full bg-primary hover:bg-primary/80 "
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Confirm Booking'
      )}
    </Button>
  );
};

// Dynamically import the client component with ssr disabled
const PaystackButton = dynamic(
  () => Promise.resolve(ClientPaystackButton),
  { 
    ssr: false,
    loading: () => (
      <Button disabled className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    )
  }
);

export default PaystackButton; 