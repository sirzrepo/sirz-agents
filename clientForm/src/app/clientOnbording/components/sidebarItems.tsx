import { Check, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import ProgressRing from "./progressRing"

export interface SidebarItemProps {
  item: {
    id: string
    title: string
    description?: string
    icon?: React.ReactNode
  }
  isSelected: boolean
  isLocked: boolean
  isCompleted: boolean
  progress: number // This should be a percentage (0-100)
  totalQuestions: number
  onClick: () => void
}

function SidebarItem({ 
  item, 
  isSelected, 
  isLocked, 
  isCompleted, 
  progress, 
  totalQuestions, 
  onClick 
}: SidebarItemProps) {
  const answeredCount = Math.round((progress / 100) * totalQuestions);
  const showProgressText = progress > 0 && progress < 100;

  const handleClick = () => {
    if (!isLocked) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group flex items-center gap-3 rounded-lg p-3 text-sm font-medium transition-colors",
        isSelected 
          ? "bg-blue-50 border-l-4 border-blue-600 text-blue-800" 
          : "text-gray-700 hover:bg-gray-50",
        isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      )}
      aria-disabled={isLocked}
    >
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
        isSelected 
          ? "border-blue-200 bg-blue-50" 
          : "border-gray-200 bg-white group-hover:border-blue-100"
      )}>
        {isLocked ? (
          <Lock className="h-4 w-4 text-gray-400" />
        ) : isCompleted ? (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
            <Check className="h-4 w-4" />
          </div>
        ) : (
          <ProgressRing 
            progress={progress} 
            size={32} 
            showText={false}
            strokeWidth={3}
          />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium truncate">{item.title}</span>
          {!isLocked && !isCompleted && showProgressText && (
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {answeredCount}/{totalQuestions}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {isCompleted 
            ? "Completed" 
            : showProgressText 
              ? `${answeredCount} of ${totalQuestions} answered`
              : "Not started"}
        </p>
      </div>
    </div>
  );
}

export { SidebarItem };
export default SidebarItem;