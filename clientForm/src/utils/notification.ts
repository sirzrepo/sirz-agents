export const NOTIFICATION_TEMPLATES = {
  NEW_USER_REGISTERED: {
    title: "🎁 Welcome Bonus Unlocked!",
    message: {
      admin: "🥳 New User Alert! {{name}} just successfully registered on the platform. Review their profile and activity via the link below.",
      client: "🎉 Welcome to UncleReuben Shawarma & Grills! We're thrilled to have you join our community. To celebrate, enjoy a fantastic {{value}}% discount on your very first order with code 👉 {{code}}. Start exploring our delicious menu now!"
    },
    link: "/admin/users"
  },
  RETURNING_USER_LOGIN: {
    title: "User Login Notification",
    message: {
      admin: "🔔 User Login: {{name}} has just securely logged into their account.",
      client: "👋 Welcome back to UncleReuben Grills! We're glad to see you again. Your favorite meals are waiting!"
    },
    link: "/admin/users"
  },
  NEW_ORDER_RECEIVED: {
    title: "🔔 New Order Alert!",
    message: {
      admin: "🚨 URGENT: A new order, #{{orderId}}, has just been placed by {{name}}. Please process this order promptly.",
      client: "✅ Your order, #{{orderId}}, has been successfully received by UncleReuben Grills! We're now processing your delicious meal."
    },
    link: "/admin/orders"
  },
  ORDER_CONFIRMED: {
    title: "Order Confirmation",
    message: {
      admin: "👍 Order Confirmed: Order #{{orderId}} for {{name}} has been officially confirmed and is ready for the next stage of preparation.",
      client: "✨ Great news! Your order, #{{orderId}}, has been confirmed! We're getting everything ready for you."
    },
    link: "/admin/orders"
  },
  ORDER_PREPARING: {
    title: "Order Preparation Underway",
    message: {
      admin: "🍳 In Progress: Order #{{orderId}} for {{name}} is currently being prepared in the kitchen. Keep an eye on its status.",
      client: "🧑‍🍳 Your order, #{{orderId}}, is now being expertly prepared by our chefs! We're cooking up something delicious for you."
    },
    link: "/admin/orders"
  },
  ORDER_READY_FOR_PICKUP: {
    title: "🚗 Order Ready for Pickup!",
    message: {
      admin: "✅ Ready for Pickup: Order #{{orderId}} for {{name}} is now ready and waiting at the counter.",
      client: "✅ Your order #{{orderId}} is ready for pickup! Head over to UncleReuben Grills at your earliest convenience. We can't wait to serve you!"
    },
    link: "/admin/orders"
  },
  ORDER_OUT_FOR_DELIVERY: {
    title: "🚚 Order On Its Way!",
    message: {
      admin: "📦 Out for Delivery: Order #{{orderId}} for {{name}} is now with our delivery partner and on its way!",
      client: "🚗 Your delicious meal is on the move! Order #{{orderId}} is out for delivery and will be with you shortly. Get ready to enjoy!"
    },
    link: "/admin/orders"
  },
  ORDER_DELIVERED: {
    title: "🎉 Order Delivered Successfully!",
    message: {
      admin: "✅ Delivery Confirmed: Order #{{orderId}} has been successfully delivered to {{name}} at {{address}}. Marked as completed.",
      client: "🎉 Your order #{{orderId}} has been delivered! We hope you enjoy your meal from UncleReuben Grills. Don't forget to rate your experience!"
    },
    link: "/admin/orders"
  },
  ORDER_CANCELLED_BY_USER: {
    title: "❌ Order Cancelled by Customer",
    message: {
      admin: "🚫 Order Cancelled: Order #{{orderId}} was cancelled by {{name}}. Reason: {{reason}}",
      client: "❌ You've successfully cancelled order #{{orderId}}. We're sorry to see you go! Your refund (if applicable) will be processed shortly."
    },
    link: "/admin/orders/cancelled"
  },
  ORDER_CANCELLED_BY_ADMIN: {
    title: "⚠️ Order Cancelled by Admin",
    message: {
      admin: "❌ Admin Cancellation: You've cancelled order #{{orderId}} for {{name}}. Reason: {{reason}}",
      client: "⚠️ We regret to inform you that order #{{orderId}} has been cancelled by our team. Reason: {{reason}}. A full refund will be processed if payment was made."
    },
    link: "/admin/orders/cancelled"
  },
  PAYMENT_SUCCESSFUL: {
    title: "💳 Payment Received!",
    message: {
      admin: "✅ Payment Successful: {{name}} has successfully paid ₦{{amount}} for order #{{orderId}}.",
      client: "✅ Payment of ₦{{amount}} for order #{{orderId}} was successful! Your order is now being processed. Thank you for choosing UncleReuben Grills!"
    },
    link: "/admin/payments"
  },
  PAYMENT_FAILED: {
    title: "Payment Failed Notification",
    message: {
      admin: "🚫 Payment Failure: Payment from {{name}} has failed. Please investigate the cause.",
      client: "⚠️ Oh no! Your payment unfortunately failed. Please review your payment details and try again, or select an alternative payment method."
    },
    link: "/admin/payments/failed"
  },
  PHONE_NUMBER_UPDATED: {
    title: "Phone Number Update",
    message: {
      admin: "📱 **Profile Change:** {{name}} has successfully updated their registered phone number.",
      client: "🔒 Your registered **phone number has been successfully updated**. If this wasn't you, please contact support immediately."
    },
    link: "/admin/users"
  },
  PROFILE_UPDATED: {
    title: "User Profile Update",
    message: {
      admin: "✏️ **Profile Modified:** {{name}} has updated their profile information. Review changes if necessary.",
      client: "✅ Your profile information has been **updated successfully**. Your details are now current!"
    },
    link: "/admin/users"
  },
  ADDRESS_UPDATED: {
    title: "Address Information Updated",
    message: {
      admin: "📍 **Address Change:** {{name}} has updated one of their stored address entries.",
      client: "🏡 Your shipping address has been **updated successfully**! Future orders will use your latest details."
    },
    link: "/admin/users"
  },
  DEFAULT_ADDRESS_UPDATED: {
    title: "Default Address Changed",
    message: {
      admin: "📌 **Default Address Set:** {{name}} has updated their default address to **{{address}}**.",
      client: "✅ Your **default shipping address** has been successfully updated to: **{{address}}**. All future orders will use this address unless specified otherwise."
    },
    link: "/admin/users"
  },
  ADDRESS_DELETED: {
    title: "Address Entry Removed",
    message: {
      admin: "🗑️ **Address Deletion:** {{name}} has removed the address entry: **{{address}}**.",
      client: "🗑️ The address **{{address}}** has been **deleted successfully** from your account. You can add new addresses anytime."
    },
    link: "/admin/users"
  },
  PASSWORD_CHANGED: {
    title: "Password Change Confirmation",
    message: {
      admin: "🔐 **Security Alert:** {{name}} has recently changed their account password. Ensure this was an authorized action.",
      client: "🔑 Your account password has been **successfully changed**. If you did not perform this action, please contact our support team immediately for assistance."
    },
    link: "/admin/users"
  },
  NEW_DISCOUNT_CODE_USED: {
    title: "Discount Code Applied!",
    message: {
      admin: "💸 **Promotion Usage:** {{name}} successfully applied discount code **{{code}}** to order **#{{orderId}}**. Monitor campaign performance.",
      client: "💰 Sweet! You successfully used discount code **{{code}}** on your order **#{{orderId}}**. Enjoy your savings with UncleReuben Shawarma & Grills!"
    },
    link: "/admin/discounts"
  },
  REFERRAL_REWARD_CLAIMED: {
    title: "Referral Reward Claimed",
    message: {
      admin: "🎁 **Referral Success:** {{name}} has successfully claimed a reward via our referral program. Verify eligibility.",
      client: "🥳 Hooray! You've successfully **claimed your referral reward!** Thank you for spreading the word about UncleReuben Grills."
    },
    link: "/admin/referrals"
  },
  BIRTHDAY_TREAT_SENT: {
    title: "Birthday Offer Dispatched",
    message: {
      admin: "🎂 A special birthday treat was sent to {{name}}. Check their eligibility and the offer details.",
      client: "🎉 **Happy Birthday from UncleReuben Shawarma & Grills!** We've sent a special treat to your account to help you celebrate. Enjoy your day!"
    },
    link: "/admin/rewards"
  },
  CART_ABANDONED: {
    title: "Abandoned Cart Alert",
    message: {
      admin: "🛒 **Abandoned Cart:** {{name}} has left items in their shopping cart. Consider sending a reminder.",
      client: "🛍️ Just a friendly reminder! You still have delicious items waiting in your cart at UncleReuben Grills. Don't miss out – complete your order now!"
    },
    link: "/admin/carts"
  },
  REORDER_INITIATED: {
    title: "User Reorder Activity",
    message: {
      admin: "🔄 **Reorder Placed:** {{name}} has initiated a reorder for a previous meal. This indicates repeat business!",
      client: "🔁 Your reorder has been **successfully placed!** Get ready to enjoy your favorite UncleReuben Grills meal once again."
    },
    link: "/admin/orders"
  },
  MAINTENANCE_MODE_ENABLED: {
    title: "Scheduled System Maintenance",
    message: {
      admin: "⚙️ **System Maintenance:** Maintenance has been scheduled for **{{time}}**. Please ensure all teams are aware and prepared.",
      client: "🚧 **Heads up!** We'll be undergoing scheduled maintenance at **{{time}}** to improve our services. We apologize for any temporary inconvenience and appreciate your understanding."
    },
    link: "/admin/settings"
  },
  ACCOUNT_FLAGGED: {
    title: "User Account Flagged for Review",
    message: {
      admin: "🚩 **ACTION REQUIRED:** {{name}}'s account has been **flagged for review**. Please investigate this user's activity immediately.",
      client: "🚨 Important Notice: Your account has been **flagged for review** due to unusual activity. For assistance or clarification, please contact our support team promptly."
    },
    link: "/admin/users/flagged"
  },
  LOW_STOCK_ALERT: {
    title: "Inventory Alert: Low Stock",
    message: {
      admin: "⚠️ **LOW STOCK ALERT:** The stock level for **{{itemName}}** is critically low. Please initiate a restock order as soon as possible.",
      client: null // No client message needed for internal stock alerts
    },
    link: "/admin/inventory"
  },
  OUT_OF_STOCK: {
    title: "Item Out of Stock Notification",
    message: {
      admin: "❌ **OUT OF STOCK:** **{{itemName}}** is now completely out of stock. Update product listings and notify relevant teams.",
      client: "😔 We're very sorry, but **{{itemName}}** is currently **out of stock**. Please check back later, or explore other delicious options on our menu!"
    },
    link: "/admin/inventory"
  },
  NEW_FEEDBACK_RECEIVED: {
    title: "New Customer Feedback Submitted",
    message: {
      admin: "📝 **Customer Feedback:** New feedback has been submitted by **{{name}}**. Review it now to gain valuable insights.",
      client: "🙏 Thank you for your feedback! We genuinely appreciate you taking the time to share your thoughts with us. Your input helps us improve **UncleReuben Shawarma & Grills**."
    },
    link: "/admin/feedback"
  },
  DELIVERY_ISSUE_REPORTED: {
    title: "Delivery Issue Alert",
    message: {
      admin: "🚨 **DELIVERY ISSUE:** {{name}} has reported a delivery issue for order **#{{orderId}}**. Please investigate and resolve this matter swiftly.",
      client: "😟 We've received your report regarding a delivery issue with your order **#{{orderId}}**. Our team is actively looking into it and will get back to you shortly."
    },
    link: "/admin/support/tickets"
  },
  CONTACT_US_MESSAGE: {
    title: "New Contact Form Message",
    message: {
      admin: "📧 **New Inquiry:** A message has been submitted through the Contact Us form by **{{name}}**. Please respond to their query.",
      client: "📧 Thank you for reaching out to **UncleReuben Shawarma & Grills**! We've received your message and will get back to you as soon as possible."
    },
    link: "/admin/support/messages"
  },
  SUPPORT_TICKET_CREATED: {
    title: "New Support Ticket Generated",
    message: {
      admin: "🎫 **New Ticket:** {{name}} has created a new support ticket. Prioritize and assign to the appropriate team member.",
      client: "✅ Your support ticket has been **successfully submitted!** Our dedicated team will review your request and connect with you shortly to provide assistance."
    },
    link: "/admin/support/tickets"
  },
  TOAST_PROMOTION_STARTED: {
    title: "New Promotion Launched!",
    message: {
      admin: "📣 **PROMOTION LIVE:** A new promotion, **'{{promoTitle}}'**, is now active on the platform. Monitor its performance.",
      client: "🎉 **New Promotion Available!** Get ready to enjoy incredible savings with our latest offer: **{{promoTitle}}**. Tap here to check it out now and grab your favorites!"
    },
    link: "/admin/marketing/promotions"
  }
};