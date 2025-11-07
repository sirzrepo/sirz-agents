"use client"
import { RootState } from "@/store/store"
import { Lock, CheckCircle } from "lucide-react"
import { useSelector } from "react-redux"

interface StageItem {
  id: string
  title: string
  stage: "one" | "two" | "preview"
}

const stageOneItems: StageItem[] = [
  { id: "identity", title: "Identity and Background", stage: "one" },
  { id: "goalsIntent", title: "Goals and Intent", stage: "one" },
  { id: "ecommerceExperience", title: "Ecommerce Experience & Skills", stage: "one" },
  { id: "challengesSupport", title: "Challenges & Support Needs", stage: "one" },
  { id: "readinessExpectations", title: "Readiness & Expectations", stage: "one" },
]

const stageTwoItems: StageItem[] = [
  { id: "validation", title: "Product & Idea Validation", stage: "two" },
  { id: "setupPrefrences", title: "Platform & Store Setup Preferences", stage: "two" },
  { id: "strategy", title: "Marketing & Launch Strategy", stage: "two" },
  { id: "timeline", title: "Timeline & Commitment", stage: "two" },
]

const stageTwoBItems: StageItem[] = [
  { id: "aboutStore", title: "About Your Store", stage: "two" },
  { id: "marketingGoals", title: "Marketing Goals", stage: "two" },
  { id: "contentNeeds", title: "Content Needs", stage: "two" },
  { id: "challengesAndSupport", title: "Challenges & Support", stage: "two" },
  { id: "gettingStarted", title: "Getting Started", stage: "two" },
]

function ProgressRing({
  progress,
  size = 40,
}: {
  progress: number
  size?: number
}) {
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth="2" />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.3s ease" }}
      />
      {/* Progress text */}
      {/* <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.3em"
        className="text-xs font-semibold fill-gray-900"
        fontSize="10"
      >
        {Math.round(progress)}%
      </text> */}
    </svg>
  )
}

function SidebarItem({
  item,
  isSelected,
  isLocked,
  isCompleted,
  progress,
  totalQuestions,
  onClick,
}: {
  item: StageItem
  isSelected: boolean
  isLocked: boolean
  isCompleted: boolean
  progress: number
  totalQuestions: number
  onClick: () => void
}) {
  const progressPercentage = totalQuestions > 0 ? (progress / totalQuestions) * 100 : 0

  return (
    <div
      onClick={() => !isLocked && onClick()}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isLocked
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer " + (isSelected ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-100")
      }`}
    >
      <div className="relative flex-shrink-0">
        {isCompleted ? (
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        ) : (
          <ProgressRing progress={progressPercentage} size={40} />
        )}
        {isLocked && <Lock className="w-3 h-3 text-gray-500 absolute top-1 right-1" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-medium ${isSelected ? "text-blue-900" : "text-gray-900"}`}>{item.title}</p>
        <p className="text-xs text-gray-500">{isCompleted ? "Completed" : `${progress}/${totalQuestions} answered`}</p>
      </div>
      {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
    </div>
  )
}

export default function Sidebar({
  selectedSection,
  onSelectSection,
  completionStatus,
  isStageOneComplete,
  progressStatus,
  sectionConfigs,
  overallProgress = 0,
}: {
  selectedSection: string
  onSelectSection: (id: string) => void
  completionStatus: Record<string, boolean>
  isStageOneComplete: boolean
  progressStatus: Record<string, number>
  sectionConfigs: Record<string, any>
  overallProgress?: number
}) {
  const { isHaveStore } = useSelector((state: RootState) => state.haveStore);
  const allSectionsComplete = Object.values(completionStatus).every((status) => status)

  return (
    <div className="w-76 h-screen bg-white border-r border-gray-200 p-6 overflow-y-auto flex-shrink-0">
      <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-xs font-semibold text-blue-600 mb-1">OVERALL PROGRESS</p>
        {/* <p className="text-2xl font-bold text-blue-900">{overallProgress}%</p> */}
        <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Application Status Header */}
      <div className="mb-8 text-center">
        <h2 className="text-sm font-semibold text-gray-600 mb-1">Application Status</h2>
        <p className="text-lg font-bold text-gray-900">Sirz Client Onboarding Form</p>
      </div>

      {/* Stage One */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 bg-blue-900 text-white px-4 py-2 rounded mb-3">Stage One</h3>
        <div className="space-y-1">
          {stageOneItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isSelected={selectedSection === item.id}
              isLocked={false}
              isCompleted={completionStatus[item.id]}
              progress={progressStatus[item.id]}
              totalQuestions={sectionConfigs[item.id].totalQuestions}
              onClick={() => onSelectSection(item.id)}
            />
          ))}
        </div>
      </div>

      {/* Stage Two */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-900 bg-blue-900 text-white px-4 py-2 rounded mb-3">Stage Two</h3>
        {!isStageOneComplete && (
          <p className="text-xs text-gray-500 px-4 py-2 mb-3 italic">Complete Stage One to unlock</p>
        )}
        <div className="space-y-1">
          <>
          { 
          isHaveStore ? stageTwoBItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isSelected={selectedSection === item.id}
              isLocked={!isStageOneComplete}
              isCompleted={completionStatus[item.id]}
              progress={progressStatus[item.id]}
              totalQuestions={sectionConfigs[item.id].totalQuestions}
              onClick={() => onSelectSection(item.id)}
            />
          )) : 
          stageTwoItems.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              isSelected={selectedSection === item.id}
              isLocked={!isStageOneComplete}
              isCompleted={completionStatus[item.id]}
              progress={progressStatus[item.id]}
              totalQuestions={sectionConfigs[item.id].totalQuestions}
              onClick={() => onSelectSection(item.id)}
            />
          ))
        }
          </>
        </div>
      </div>

      {!allSectionsComplete && (
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => onSelectSection("preview")}
            className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
              selectedSection === "preview"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            Review & Submit
          </button>
        </div>
      )}
    </div>
  )
}
