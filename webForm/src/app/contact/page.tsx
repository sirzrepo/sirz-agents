"use client"



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  // Removed company, website, employees, country as they are not relevant for a Shawarma and Grills website
};

// Mouth-Watering Shawarma
// Perfectly Spiced Meats
// Freshly Baked Bread
// Crisp Vegetables
// Succulent Grills
// Flame-Grilled Perfection
// Variety of Meats
// Signature Sauces
// Catering for Events
// Party Platters
// Customizable Menus
// Reliable Service

const listItems = [
  {
    title: "Mouth-Watering Shawarma",
    items: [
      "Perfectly Spiced Meats",
      "Freshly Baked Bread",
      "Crisp Vegetables"
    ]
  },
  {
    title: "Succulent Grills",
    items: [
      "Flame-Grilled Perfection",
      "Variety of Meats",
      "Signature Sauces"
    ]
  },
  {
    title: "Catering for Events",
    items: [
      "Party Platters",
      "Customizable Menus",
      "Reliable Service"
    ]
  }
]

const BASE_URL = `https://api.sirz.co.uk`; // Keep this if you're still using the same backend

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (submitStatus) {
      setIsModalOpen(true);
      // Auto-close the modal after 5 seconds
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation for Shawarma & Grills inquiries
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phone) {
      setSubmitStatus({
        success: false,
        message: 'Please fill in all required fields (First Name, Last Name, Email, and Phone).'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // You might want to create a new endpoint for "UncleReuben Shawarma and Grills" inquiries
      // For now, I'm keeping the existing one, but it's important to verify it's suitable.
      const response = await axios.post(`${BASE_URL}/api/uncle-reuben-inquiry`, formData); // Modified endpoint

      if (response.status === 200 || response.status === 201) {
        setSubmitStatus({
          success: true,
          message: 'Thank you for contacting UncleReuben! We will get back to you soon regarding your inquiry.'
        });
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        success: false,
        message: 'An error occurred while submitting your inquiry. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Success/Error Modal */}
      <AnimatePresence>
        {isModalOpen && submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 flex items-center justify-center  px-4"
          >
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              className={`relative max-w-md w-full p-6 rounded-lg shadow-xl ${
                submitStatus.success ? 'bg-green-50' : 'bg-red-50'
              }`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 h-6 w-6 ${
                  submitStatus.success ? 'text-green-500' : 'text-red-500'
                }`}>
                  {submitStatus.success ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-lg font-medium ${
                    submitStatus.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submitStatus.success ? 'Success!' : 'Error'}
                  </h3>
                  <div className={`mt-2 text-sm ${
                    submitStatus.success ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <p>{submitStatus.message}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(false);
                  }}
                  className="ml-auto -mx-1.5 -my-1.5 p-1.5 inline-flex h-8 w-8 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
                  aria-label="Close"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="md:grid md:grid-cols-2 gap-20 py-20 md:w-[80%] w-[90%] mx-auto">
        <div className="md:col-span-1">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Get in Touch with <span className="text-secondary">UncleReuben Shawarma and Grills</span>
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 ">
            Have questions about our delicious shawarma, juicy grills, or want to place a large order for an event? We&apos;d love to hear from you! Fill out the form, and we&apos;ll get back to you as soon as possible.
          </p>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400 mt-10 mb-5">Why Choose UncleReuben?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {
                listItems.map((item, index) => (
                  <div key={index}>
                    <h4 className="font-semibold text-gray-700 dark:text-white mb-3 mt-6">{item.title}</h4>
                    <ul className="list-none space-y-1">
                      {item.items.map((item, index) => (
                        <li key={index} className="flex tracking-wide text-gray-600 dark:text-gray-300 items-center py-1">
                          <svg className="w-5 h-5 text-secondary mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='sm:shadow-2xl font-sans'>
        <div className="md:col-span-1 sm:w-[90%] py-12 mx-auto">
          <div className="space-y-4 font-montserrat">
           <div className='grid sm:grid-cols-2 gap-6'>
            <Input 
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                type='text'
                placeholder='First Name'
                
            />

            <Input 
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                type='text'
                placeholder='Last Name'
                
            />
           </div>

           <div className='grid sm:grid-cols-2 gap-6'>
            <Input 
                name="email"
                onChange={handleChange}
                value={formData.email}
                type='email'
                placeholder='Email'
                    
              />

              <Input 
                name="phone"
                onChange={handleChange}
                value={formData.phone}
                type='number'
                placeholder='Phone Number'
                    
              />
           </div>

           <div className="relative pt-2">
            <div className="text-sm capitalize font-medium pb-2 font-montserrat">Message</div>
            <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full p-3 border border-gray-300 rounded-lg bg-transparent placeholder:text-[14px] placeholder:capitalize focus:outline-none focus:ring-1 dark:focus:ring-secondary focus:border-none focus:ring-primary font-montserrat`}
                placeholder='Type your message here'
            />
           </div>

            <div className="text-sm text-gray-500 py-2">
              At UncleReuben Shawarma and Grills we&apos;re committed to your privacy.The information you provide will only be used to respond to your inquiry. For more information, check out our Privacy Policy.
            </div>
            {submitStatus && (
              <div className={`p-4 rounded-md ${submitStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-secondary hover:bg-red-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending Message...' : 'Send Your Inquiry'}
              </button>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
}