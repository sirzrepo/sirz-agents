
import { CheckCircle, XCircle, AlertTriangle, Loader2, MessageSquare } from "lucide-react"
import Button from "../common/ui/Button"
import { useDispatch, useSelector } from "react-redux"
import { onCloseNotificationModal } from "@/store/notificationModal"
import type { RootState } from "@/store/store"
import { Notification, NotificationType } from "@/types"
import { useEffect, useState } from "react"


export default function NotificationModal({ 
  type,
  title,
  message,
  details,
  id,
 }: Notification) {
  const { isOpen, modalId } = useSelector((state: RootState) => state.notificationModal);
  const dispatch = useDispatch();
  const [responseData, setResponseData] = useState<Notification | null>(null);
  
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-12 h-12 text-green-500" />
      case "error":
        return <XCircle className="w-12 h-12 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />
      case "loading":
        return <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      default:
        return <MessageSquare className="w-12 h-12 text-gray-500" />
    }
  }

  const getBackgroundColor = (type: NotificationType) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "loading":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  useEffect(() => {
    switch (type) {
      case "success":
        setResponseData({
          type: "success",
          title: title || "Success!",
          message: message || "Your request has been processed successfully.",
          details: details || "A confirmation email has been sent to your inbox.",
        })
        break
      case "error":
        setResponseData({
          type: "error",
          title: title || "Something went wrong!",
          message: message || "We encountered an error while processing your request.",
          details: details || "Please check your internet connection and try again. If the problem persists, contact support.",
        })
        break
      case "loading":
        setResponseData({
          type: "loading",
          title: title || "Processing...",
          message: message || "Please wait while we process your request.",
          details: details || "",
        })
        break
      default:
        setResponseData(null)
        break
    }
  }, [type, title, message, details])

  const onCloseModal = () => {
    dispatch(onCloseNotificationModal());
    // Reset form or retry logic here
  }

  // const onRetryModal = () => {
  //   dispatch(onCloseNotificationModal());
  //   // onRetry?.();
  // }

  const onContinueModal = () => {
    dispatch(onCloseNotificationModal());
    // onContinue?.();
  }



  const isModalOpen = isOpen && modalId === id;


  return (
    <section id={id ?? undefined}>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCloseModal} />

          {/* Modal */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6">
            <div className=" space-y-4">
              <div className="flex justify-center">{getIcon(responseData?.type || "loading")}</div>
              <h2 className="text-xl font-bold pt-1">{responseData?.title}</h2>
            </div>

            <div className="space-y-4 mt-4">
              {/* Main message */}
              <div className={`p-4 rounded-lg border ${getBackgroundColor(responseData?.type || "loading")}`}>
                <p className="text-center font-medium text-gray-700">{responseData?.message}</p>
              </div>

              {/* Additional details */}
              {responseData?.details && <div className="text-sm text-gray-600 text-center">{responseData?.details}</div>}

              {/* Action buttons */}
              <div className="flex gap-2 pt-4">
                {responseData?.type === "error" && (
                  <Button onClick={onCloseModal} variant="outline" className="flex-1">
                    Try Again
                  </Button>
                )}

                {responseData?.type === "success" && (
                  <Button onClick={onContinueModal} className="flex-1 bg-black">
                    Continue
                  </Button>
                )}

                <Button
                  onClick={onCloseModal}
                  variant={responseData?.type === "success" ? "outline" : "default"}
                  className="flex-1"
                >
                  {responseData?.type === "loading" ? "Cancel" : "Close"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
