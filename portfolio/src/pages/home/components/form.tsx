import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../../utils'
import { openModal, closeModal } from '../../../store/modalSlice'
import { RootState } from '../../../store/store'
import Modal from '../../../components/common/Modal'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { modalId } = useSelector((state: RootState) => state.modal)
  const dispatch = useDispatch()

  // Reset form after successful submission
  useEffect(() => {
    if (modalId === 'contact-success') {
      const timer = setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          companyName: "",
          subject: "",
          message: "",
        })
        dispatch(closeModal())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [modalId, dispatch])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    const messageText = `
      <div class="space-y-2">
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.companyName}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong> ${formData.message}</p>
      </div>
    `;

    const payload = {
      from: formData.email,
      subject: `New Contact: ${formData.subject}`,
      text: `New message from ${formData.fullName} (${formData.email})`,
      html: messageText,
    };

    try {
      await axios.post(`${BASE_URL}/portfolio-leads`, payload);
      dispatch(openModal('contact-success'));
    } catch (error) {
      console.error("Error:", error);
      dispatch(openModal('contact-error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact" className="bg-[#141414] text-white py-10 md:py-16">
      <div className="sm:w-[80%] w-[95%] mx-auto">
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-5">
            <div className="w-[1px] h-6 bg-cyan-400"></div>
            <span className="text-gray-300 font-medium text-md">Got A Project?</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-medium tracking-wide">LET'S TALK</h1>
        </div>

        <form
          className="w-full mx-auto space-y-6 relative"
          onSubmit={handleSubmit}
        >
          {/* Loading overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 rounded-xl flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-700 dark:text-gray-200">Sending message...</p>
              </div>
            </div>
          )}

          <div className={`space-y-6 ${isSubmitting ? 'opacity-50' : ''}`}>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-sm text-gray-300">
                  Full Name <span className="text-white">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white outline-none py-3 text-white placeholder-gray-500 transition-colors"
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm text-gray-300">
                  Email Address <span className="text-white">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white outline-none py-3 text-white placeholder-gray-500 transition-colors"
                  placeholder=""
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm text-gray-300">
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white outline-none py-3 text-white placeholder-gray-500 transition-colors"
                  placeholder=""
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm text-gray-300">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white outline-none py-3 text-white placeholder-gray-500 transition-colors"
                  placeholder=""
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm text-gray-300">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="w-full bg-transparent border-0 border-b border-gray-600 focus:border-white outline-none py-3 text-white placeholder-gray-500 resize-none transition-colors"
                placeholder=""
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {/* Success Modal */}
            <Modal modalId="contact-success">
              <div className="text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">Message Sent!</h3>
                <p className="text-gray-700">Thank you for reaching out. I'll get back to you soon!</p>
              </div>
            </Modal>

            {/* Error Modal */}
            <Modal modalId="contact-error">
              <div className="text-center p-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-black mb-2">Something went wrong</h3>
                <p className="text-gray-700 mb-4">There was an error sending your message. Please try again later.</p>
                <button
                  onClick={() => dispatch(closeModal())}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </Modal>
          </div>
        </form>
      </div>
    </div>
  )
}
