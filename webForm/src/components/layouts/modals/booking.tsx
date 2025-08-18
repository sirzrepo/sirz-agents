import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "convex/react";
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "react-toastify";
import PaystackButton from "@/components/payStack";

interface BookingModalProps {
    showBookingModal: boolean;
    setShowBookingModal: (show: boolean) => void;
    
    handleBookingSubmit?: (e: React.FormEvent) => void;
    handleBookingChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    bookingData?: {
      phone: string;
      deliveryMethod: string;
      price: number;
      message: string;
      preferredDate: string;
      quantity: number;
    };
    price: number;
    formatPrice: (price: number) => string;
    availableQuantity?: number;
    deliveryMethods?: string[];
}

// Delivery method options mapping
const deliveryMethodLabels: Record<string, string> = {
  pickup: "I'll pick it up",
  meet: "Meet at public location",
  delivery: "Delivery to my location"
};

export default function BookingModal({
    showBookingModal,
    setShowBookingModal,
    handleBookingSubmit,
    handleBookingChange,
    bookingData,
    price,
    formatPrice,
    availableQuantity = 1,
    deliveryMethods = []
}: BookingModalProps) {
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [totalPrice, setTotalPrice] = useState(price);

    console.log("bookingData", bookingData);
    const user = useQuery(api.resources.users.authenticated);

    console.log("user", user);

     const handlePaymentSuccess = () => {
        console.log('Payment successful:');
        // TODO: Implement payment success logic
      };
    
      const handlePaymentError = (error: any) => {
        console.error('Payment failed:', error);
        // TODO: Implement payment error logic
      };
    

    // useEffect(() => {
    //   if (showBookingModal && quantity === 1 && price > 0) {
    //     handleBookingChange?.({
    //       target: {
    //         name: 'price',
    //         value: price.toString(),
    //       },
    //     } as React.ChangeEvent<HTMLInputElement>);
    
    //     handleBookingChange?.({
    //       target: {
    //         name: 'quantity',
    //         value: '1',
    //       },
    //     } as React.ChangeEvent<HTMLInputElement>);
    //   }
    // }, [showBookingModal]); 
    
    useEffect(() => {
      if (showBookingModal) {
        if (user) {
    
          if (!bookingData?.phone) {
            handleBookingChange?.({
              target: {
                name: 'phone',
                value: user.phone,
              },
            } as React.ChangeEvent<HTMLInputElement>);
          }
        }
    
        // Price and quantity setup
        if (quantity === 1 && price > 0) {
          handleBookingChange?.({
            target: {
              name: 'price',
              value: price.toString(),
            },
          } as React.ChangeEvent<HTMLInputElement>);
    
          handleBookingChange?.({
            target: {
              name: 'quantity',
              value: '1',
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }, [showBookingModal, user]);
    

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= availableQuantity) {
            setQuantity(newQuantity);
            setTotalPrice(newQuantity * price);
            
            // Simulate quantity change event
        handleBookingChange?.({
          target: {
            name: 'quantity',
            value: newQuantity.toString(),
          },
        } as React.ChangeEvent<HTMLInputElement>);

        console.log("total price", totalPrice)

        // Simulate price change event
        handleBookingChange?.({
          target: {
            name: 'price',
            value: (newQuantity * price).toString(),
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book this item</DialogTitle>
            <DialogDescription>
              Fill in your details to book this item. We&apos;ll contact you to confirm your booking.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookingSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={bookingData?.phone || ""}
                onChange={handleBookingChange}
                placeholder="+234 800 000 0000"
                required
              />
            </div>
            
            {/* Delivery Method */}
            {
              deliveryMethods?.length > 0 && (
                <div className="space-y-2">
                  <Label className="block mb-2">Delivery Method</Label>
                  <div className="grid gap-2">
                    {deliveryMethods?.map((method) => (
                      <label key={method} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                        <input
                          type="radio"
                          name="deliveryMethod"
                          value={method}
                          checked={bookingData?.deliveryMethod === method}
                          onChange={handleBookingChange}
                          className="h-4 w-4 focus:ring-[#088b56] border-gray-300"
                          required
                        />
                        <span className="text-sm  font-medium">{deliveryMethodLabels[method] || method}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            }
            
            <div className="space-y-2">
              <Label htmlFor="preferredDate">Preferred Date</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={bookingData?.preferredDate || ''}
                  onChange={handleBookingChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                name="message"
                value={bookingData?.message || ''}
                onChange={handleBookingChange}
                placeholder="Any special requests or additional information..."
                rows={3}
              />
            </div>
            
            {availableQuantity > 1 && (
              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= availableQuantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-500 ml-2">
                    {availableQuantity} available
                  </span>
                </div>
              </div>
            )}
            <div className="mt-6 space-y-4">
              {availableQuantity > 1 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price per item</span>
                  <span className="font-medium">{formatPrice(price)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {availableQuantity > 1 ? 'Quantity' : 'Item Price'}
                </span>
                <div className="flex items-center">
                  {availableQuantity > 1 && (
                    <span className="mr-2">{quantity} × {formatPrice(price)}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating Booking...' : 'Confirm Booking'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
}
    