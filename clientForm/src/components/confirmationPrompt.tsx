import { useTheme } from 'next-themes';

const messageTypes = {
  delete: "/images/delete.svg",
  success: "/images/success.svg",
  error: "/images/error.svg",
  purchase: "/images/successful-purchase.svg"
}

const blobScene = {
  light: "/images/blob-scene-haikei_5.svg",
  dark: "/images/blob-scene-haikei.svg"
}

interface ConfirmationPromptProps {
  title?: string
  message?: string
  messageType?: "delete" | "success" | "error" | "purchase",
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export function ConfirmationPrompt({ 
  title,
  message,
  messageType = "delete",
  confirmLabel = "Yes",
  cancelLabel = "No",
  onConfirm, 
  onCancel,
  isDeleting = false 
}: ConfirmationPromptProps) {

  const { resolvedTheme } = useTheme();
  const backgroundImage = resolvedTheme === 'dark' ? blobScene.dark : blobScene.light;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
       className="w-full max-w-sm max-sm:max-w-[300px] rounded-lg bg-white/80 dark:bg-zinc-100/80 backdrop-blur-sm p-6">
        <div className="flex flex-col items-center text-center">
          <img src={
              messageType === "delete" ? messageTypes.delete : 
              messageType === "success" ? messageTypes.success : 
              messageType === "error" ? messageTypes.error : 
              messageType === "purchase" ? messageTypes.purchase : 
              messageTypes.delete} alt="Delete" 
              className="my-6 h-24 sm:h-32 w-auto" 
            />
          <h3 className="text-lg text-zinc-900 dark:text-zinc-100 mb-2 font-semibold">{title}</h3>
          <p className="text-sm text-zinc-900 dark:text-zinc-100 text-muted-foreground">
            {message}
          </p>

          <div className="mt-6 flex w-full justify-end gap-3">
            {
              cancelLabel && (
                <button
                  className="rounded-md dark:bg-[#000000a8] bg-zinc-300 px-4 py-2 text-sm font-medium dark:text-muted-foreground text-primary hover:bg-muted"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </button>
              )
            }
            <button
              className={isDeleting ? "rounded-md bg-white border text-black shadow-xl  px-6 py-2 text-sm font-medium text-white hover:bg-zinc-100" : "rounded-md bg-white text-black shadow-xl px-4 py-2 text-sm font-medium hover:bg-zinc-100"}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 