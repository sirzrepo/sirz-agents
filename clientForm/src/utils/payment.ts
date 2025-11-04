/**
 * Payment utility functions
 */

/**
 * Generates a random account number for bank transfers
 * @param length The length of the account number (default: 10)
 * @returns A random account number string
 */
export const generateRandomAccountNumber = (length: number = 10): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
};

/**
 * Formats a payment reference for display
 * @param reference The payment reference
 * @returns Formatted reference string
 */
export const formatPaymentReference = (reference: string): string => {
  if (!reference) return '';
  
  // Format: REF-1234567890-123 -> REF-1234-5678-9012-3
  if (reference.startsWith('REF-')) {
    const parts = reference.split('-');
    if (parts.length === 3) {
      const timestamp = parts[1];
      const random = parts[2];
      
      // Format timestamp part (first 4 digits)
      const formattedTimestamp = timestamp.substring(0, 4);
      
      // Format random part (remaining digits)
      const formattedRandom = random.padStart(8, '0');
      
      return `REF-${formattedTimestamp}-${formattedRandom.substring(0, 4)}-${formattedRandom.substring(4, 8)}-${random.substring(0, 1)}`;
    }
  }
  
  return reference;
};

/**
 * Generates a unique payment reference
 * @returns A unique payment reference string
 */
export const generatePaymentReference = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `REF-${timestamp}-${random}`;
};

/**
 * Formats currency for Paystack (converts to kobo/cents)
 * @param amount The amount in the main currency unit
 * @returns The amount in the smallest currency unit (kobo/cents)
 */
export const formatAmountForPaystack = (amount: number): number => {
  return Math.round(amount * 100);
};

/**
 * Formats currency from Paystack (converts from kobo/cents)
 * @param amount The amount in the smallest currency unit (kobo/cents)
 * @returns The amount in the main currency unit
 */
export const formatAmountFromPaystack = (amount: number): number => {
  return amount / 100;
}; 