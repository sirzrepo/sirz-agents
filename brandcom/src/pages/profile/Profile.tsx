import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useFormik } from "formik";
import Loader from "../../features/loader";
import { BsPersonCircle } from "react-icons/bs";
import { MdCheck, MdEmail, MdEdit, MdPerson, MdWarning } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Profile() {
  const { user, isLoading, updateUserProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prevUser, setPrevUser] = useState(user);
  const [updateRequested, setUpdateRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Custom CSS for animations and toast styling
  const customStyles = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fadeIn {
      animation: fadeIn 0.3s ease-out forwards;
    }

    /* Custom Toast Styling */
    .Toastify__toast {
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .Toastify__toast--success {
      background-color: #f0fdf4;
      border-left: 4px solid #22c55e;
      color: #166534;
    }
    .Toastify__toast--error {
      background-color: #fef2f2;
      border-left: 4px solid #ef4444;
      color: #991b1b;
    }
    .Toastify__toast-body {
      font-family: inherit;
    }
    .Toastify__progress-bar--success {
      background-color: #22c55e;
    }
    .Toastify__progress-bar--error {
      background-color: #ef4444;
    }
  `;

  // Custom toast functions with icons
  const showSuccessToast = (message: string) => {
    toast.success(
      <div className="flex items-center">
        <div className="bg-green-200 p-1 rounded-full mr-2">
          <MdCheck className="text-green-600 text-lg" />
        </div>
        <span>{message}</span>
      </div>
    );
  };

  const showErrorToast = (message: string) => {
    toast.error(
      <div className="flex items-center">
        <div className="bg-red-200 p-1 rounded-full mr-2">
          <MdWarning className="text-red-600 text-lg" />
        </div>
        <span>{message}</span>
      </div>
    );
  };

  // Monitor user changes to detect when an update completes
  useEffect(() => {
    if (updateRequested && user !== prevUser) {
      console.log("User updated:", user);
      showSuccessToast("Profile updated successfully!");
      setUpdateRequested(false);
    }
    setPrevUser(user);
  }, [user, updateRequested]);

  useEffect(() => {
    // Set preview image from user data if available
    if (user?.image) {
      setPreviewImage(user.image);
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      image: user?.image || "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setIsUpdating(true);
        setUpdateRequested(true);
        
        // Prepare update data (exclude email as it's not editable)
        const updateData = {
          first_name: values.first_name,
          last_name: values.last_name,
          image: values.image,
        };
        
        const result = await updateUserProfile(updateData);
        console.log("Profile update result:", result);
        
        if (result.success) {
          showSuccessToast("Profile updated successfully!");
        } else {
          showErrorToast(result.message || "Failed to update profile");
        }
        
        setUpdateRequested(false);
      } catch (error: any) {
        console.error("Profile update error:", error);
        showErrorToast(error.message || "Failed to update profile");
        setUpdateRequested(false);
      } finally {
        setIsUpdating(false);
      }
    },
  });

  const handleImageClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For a real implementation, you would upload this to a server
      // and get back a URL. For now, we'll use a data URL.
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        formik.setFieldValue("image", imageUrl);
        showSuccessToast("Profile image updated! Click Save Changes to apply.");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12 min-h-[70vh]">
        <Loader />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto p-4 mt-4 mb-12">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-16"
      />
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === "profile"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === "settings"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </button>
        </div>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-12 relative">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div 
                  className="w-32 h-32 rounded-full border-4 border-white overflow-hidden cursor-pointer bg-white shadow-md"
                  onClick={handleImageClick}
                >
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt={user?.first_name || "Profile"} 
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImage(null)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <BsPersonCircle className="text-gray-400 text-5xl" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                  onClick={handleImageClick}
                >
                  <MdEdit className="text-lg" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="px-8 pt-20 pb-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                {formik.values.first_name || formik.values.last_name 
                  ? `${formik.values.first_name} ${formik.values.last_name}` 
                  : user?.email?.split('@')[0] || "User"}
              </h2>
              <p className="text-gray-500">{formik.values.email}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* First Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MdPerson className="mr-2 text-gray-500" />
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  placeholder="Enter your first name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MdPerson className="mr-2 text-gray-500" />
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  placeholder="Enter your last name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MdEmail className="mr-2 text-gray-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700"
                  readOnly
                />
                <p className="text-xs text-gray-500">
                  Email address cannot be changed
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className={`flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all ${
                  isUpdating 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isUpdating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Account Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive email notifications for account updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                Enable
              </button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg border-red-200 bg-red-50">
              <div>
                <h3 className="font-medium text-red-600">Delete Account</h3>
                <p className="text-sm text-red-500">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
} 