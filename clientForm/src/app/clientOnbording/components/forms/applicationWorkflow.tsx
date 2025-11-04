"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { IdentityAndBackground } from "../questions/sectionOne/identityBackground"
// Removed dummy data import - using local storage instead
import { PreviewSubmit } from "../questions/reviewSubmit"
import Sidebar from "../sidebar"
import axios from "axios"
import { BASE_URL } from "@/lib/utils"
import { GoalsIntent } from "../questions/sectionOne/goalsIntent"
import { EcommerceExperience } from "../questions/sectionOne/ecommerceExperience"
import { ChallengesSupport } from "../questions/sectionOne/challengesSupport"
import { ReadinessExpectations } from "../questions/sectionOne/readinessExpectation"
import { Validation } from "../questions/sectionTwo/validation"
import { SetupPrefrences } from "../questions/sectionTwo/setupPreferences"
import { Strategy } from "../questions/sectionTwo/strategy"
import { TimelineAndCommitment } from "../questions/sectionTwo/timeline"
import { AboutStore } from "../questions/sectionTwoB/aboutStore"
import { MarketingGoals } from "../questions/sectionTwoB/marketingGoals"
import { ContentNeeds } from "../questions/sectionTwoB/contentNeeds"
import { Challenges } from "../questions/sectionTwoB/challenges"
import { GettingStarted } from "../questions/sectionTwoB/gettingStarted"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

interface SectionConfig {
title: string
description: string
component: React.ComponentType<any>
totalQuestions: number
}

const sectionConfigs: Record<string, SectionConfig> = {

// Stage One
identity: {
title: "Identity and Background",
description:
"Helps us understand who you are and your business idea",
component: IdentityAndBackground,
totalQuestions: 4,
},
goalsIntent: {
title: "Goals and Intent",
description: "Helps us understand what you want to achieve and your level of commitment",
component: GoalsIntent,
totalQuestions: 3,
},
ecommerceExperience: {
title: "Ecommerce Experience & Skills",
description: "Helps us see if you’re new to eCommerce or already experienced",
component: EcommerceExperience,
totalQuestions: 4,
},
challengesSupport: {
title: "Challenges & Support Needs",
description: "Helps us identify where beginners need guidance",
component: ChallengesSupport,
totalQuestions: 3,
},
readinessExpectations: {
title: "Readiness & Expectations",
description: "Helps us see if you are ready to take action and if SIRZ is the right fit",
component: ReadinessExpectations,
totalQuestions: 3,
},

// Stage Two
validation: {
title: "Product & Idea Validation",
description: "Helps us understand if your product or idea is validated",
component: Validation,
totalQuestions: 3,
},
setupPrefrences: {
title: "Platform & Store Setup Preferences",
description: "Helps us understand your preferences for platform and store setup",
component: SetupPrefrences,
totalQuestions: 3,
},
strategy: {
title: "Marketing & Launch Strategy",
description: "Shows readiness to attract customers and generate sales",
component: Strategy,
totalQuestions: 3,
},
timeline: {
title: "Timeline & Commitment",
description: "Assesses readiness to take action and launch their store",
component: TimelineAndCommitment,
totalQuestions: 3,
},
// Stage Two B
aboutStore: {
title: "About Your Store",
description: "Helps us understand your store",
component: AboutStore,
totalQuestions: 4,
},
marketingGoals: {
title: "Marketing Goals",
description: "Helps us understand your marketing goals",
component: MarketingGoals,
totalQuestions: 4,
},
contentNeeds: {
title: "Content Needs",
description: "Helps us understand your content needs",
component: ContentNeeds,
totalQuestions: 4,
},
challengesAndSupport: {
title: "Challenges & Support",
description: "Helps us identify where beginners need guidance",
component: Challenges,
totalQuestions: 3,
},
gettingStarted: {
title: "Getting Started",
description: "Helps us understand your preferences for platform and store setup",
component: GettingStarted,
totalQuestions: 4,
},
}

const initialCompletionStatus: Record<string, boolean> = {
identity: false,
goalsIntent: false,
ecommerceExperience: false,
challengesSupport: false,
readinessExpectations: false,

// ssection 2
validation: false,
setupPrefrences: false,
strategy: false,
timeline: false,

// section 2 B
aboutStore: false,
marketingGoals: false,
contentNeeds: false,
challengesAndSupport: false,
gettingStarted: false,
}

const initialProgressStatus: Record<string, number> = {
identity: 0,
goalsIntent: 0,
ecommerceExperience: 0,
challengesSupport: 0,
readinessExpectations: 0,

// ssection 2
validation: 0,
setupPrefrences: 0,
strategy: 0,
timeline: 0,

// section 2 B
aboutStore: 0,
marketingGoals: 0,
contentNeeds: 0,
challengesAndSupport: 0,
gettingStarted: 0,
}

export default function ApplicationWorkflow() {
// TODO: Replace this with actual user authentication logic
const [userId, setUserId] = useState<string>("68615a01da004964b2905b2d")
const [selectedSection, setSelectedSection] = useState<string>("identity")
const [completionStatus, setCompletionStatus] = useState(initialCompletionStatus)
const [progressStatus, setProgressStatus] = useState(initialProgressStatus)
const [allSectionData, setAllSectionData] = useState<Record<string, Record<string, string>>>({})
const [updateProgressStatus, setUpdateProgressStatus] = useState(false)

// Log progress status changes
useEffect(() => {
  console.log('Progress Status Updated:', progressStatus)
  const currentSection = selectedSection
  if (currentSection) {
    console.log(`Current Section (${currentSection}) Progress:`, progressStatus[currentSection] || 0)
  }
}, [progressStatus, selectedSection])
const [isLoaded, setIsLoaded] = useState(false)
const { isHaveStore } = useSelector((state: RootState) => state.haveStore);

const initializeApplicationForm = async () => {
try {
const response = await axios.post(`${BASE_URL}/api/onboarding`, {
userId,
applicationFormData: [],
completionStatus: {},
progressStatus: {},
isComplete: false
});

console.log("✅ Application form initialized:", response.data);
return response.data;
} catch (error) {
if (error) {
console.error("❌ Server error:", error);
} else {
console.error("⚠️ Request failed:", error);
}
}
};

useEffect(() => {
if (!userId) return;

const fetchForm = async () => {
try {
const res = await axios.get(`${BASE_URL}/api/onboarding/user/${userId}`);
if (res.data.success && res.data.data) {
const form = res.data.data;

// Restore data from backend
setAllSectionData(
Object.fromEntries(form.applicationFormData.map((s: any) => [s.sectionName, s.data]))
);
setCompletionStatus(form.completionStatus || {});
setProgressStatus(form.progressStatus || {});
setSelectedSection(form.selectedSection || "identity");
setIsLoaded(true);
console.log("✅ Loaded form from backend:", form);
} else {
// Initialize a new one if not found
console.log("⚠️ No existing form found — initializing new one...");
await initializeApplicationForm();
setIsLoaded(true);
}
} catch (error: any) {
console.error("❌ Error fetching form:", error?.response?.data || error.message);
}
};

fetchForm();
}, [userId]);

// Save data to local storage whenever it changes
useEffect(() => {
if (isLoaded && typeof window !== "undefined" && userId) {
localStorage.setItem(`applicationFormData_${userId}`, JSON.stringify(allSectionData))
// initializeApplicationForm();
}
}, [allSectionData, isLoaded, userId])

// Save completion status to local storage
useEffect(() => {
if (isLoaded && typeof window !== "undefined" && userId) {
localStorage.setItem(`completionStatus_${userId}`, JSON.stringify(completionStatus))
}
}, [completionStatus, isLoaded, userId])

// Save progress status to local storage
useEffect(() => {
if (isLoaded && typeof window !== "undefined" && userId) {
localStorage.setItem(`progressStatus_${userId}`, JSON.stringify(progressStatus))
}
}, [progressStatus, isLoaded, userId])

// Save selected section to local storage
// useEffect(() => {
// if (isLoaded && typeof window !== "undefined" && userId) {
// localStorage.setItem(`selectedSection_${userId}`, selectedSection)
// }
// }, [selectedSection, isLoaded, userId])

useEffect(() => {
if (!userId || !isLoaded) return;
const updateSelectedSection = async () => {
try {
await axios.put(`${BASE_URL}/api/onboarding/${userId}/selected-section`, {
sectionName: selectedSection,
});
console.log(`📌 Selected section updated: ${selectedSection}`);
} catch (error: any) {
console.error("⚠️ Failed to update selected section", error?.response?.data || error.message);
}
};
updateSelectedSection();
}, [selectedSection, userId, isLoaded]);

// useEffect(() => {
// const sendApplicationData = async () => {
// // Run only when user and data are ready
// // if (!isLoaded || typeof window === "undefined" || !userId) return;

// try {
// const payload = {
// userId,
// applicationFormData: allSectionData ?? {},
// completionStatus: completionStatus ?? {},
// progressStatus: progressStatus ?? {},
// selectedSection: selectedSection ?? "",
// isComplete: false,
// };

// const response = await axios.post(`${BASE_URL}/api/onboarding`, payload);

// console.log("✅ Application form data sent successfully:", response.data);
// return response.data;
// } catch (error: any) {
// console.error("❌ Error sending data to backend:", error?.response?.data || error.message);
// }
// };

// sendApplicationData();
// }, [allSectionData, completionStatus, progressStatus, selectedSection, isLoaded, userId]);

console.log("allSectionData", allSectionData)

const calculateOverallProgress = () => {
const totalQuestions = Object.values(sectionConfigs).reduce((sum, config) => sum + config.totalQuestions, 0)
const answeredQuestions = Object.values(progressStatus).reduce((sum, count) => sum + count, 0)
return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0
}

const isStageOneComplete = () => {
const stageOneItems = ["identity", "goalsIntent", "ecommerceExperience", "challengesSupport", "readinessExpectations"]
return stageOneItems.every((item) => completionStatus[item])
}

const markSectionComplete = (sectionId: string) => {
setCompletionStatus((prev) => ({
...prev,
[sectionId]: true,
}))
}

const updateSectionProgress = useCallback(
  async (sectionId: string, answeredCount: number) => {
    // Update frontend state
    const updatedProgressStatus = {
      ...progressStatus,
      [sectionId]: answeredCount,
    };

    console.log("Updated progress status:", updatedProgressStatus, "Answered count:", answeredCount);
    
    setProgressStatus(updatedProgressStatus);
    console.log("*************************", progressStatus)
    
    // Update backend
    try {
      // First update the specific section
      await axios.put(
        `${BASE_URL}/api/onboarding/${userId}/section/${sectionId}`, 
        {
          progress: answeredCount,
          // isComplete: completionStatus[sectionId],
        }
      );
      
      // Then update the complete status object
      // await axios.put(
      //   `${BASE_URL}/api/onboarding/${userId}/status`,
      //   {
      //     progressStatus: updatedProgressStatus,
      //     completionStatus: completionStatus, // Keep existing completion status
      //   }
      // );
      
      console.log(`📤 Progress for "${sectionId}" updated to ${answeredCount}`);
    } catch (error: any) {
      console.error(
        `⚠️ Failed to update progress for "${sectionId}"`, 
        error?.response?.data || error.message
      );
    }
  },
  [userId, completionStatus, progressStatus]
);


const saveSectionData = async (sectionId: string, data: Record<string, string>, answeredCount: number) => {


  const updatedProgressStatus = {
    ...progressStatus,
    [sectionId]: answeredCount,
  };

  console.log("^^^^^^^^^^^^^^^^^^^^^^^^", progressStatus)

  console.log("Saving section data:", "Answered count:", answeredCount, updatedProgressStatus);
  
  // Calculate if section should be marked as complete
  const isSectionComplete = answeredCount >= 4; // Assuming 4 is max progress
  
  // 1️⃣ Update frontend state
  setAllSectionData(prev => ({
    ...prev,
    [sectionId]: data,
  }));
  
  setCompletionStatus(prev => ({
    ...prev,
    [sectionId]: isSectionComplete,
  }));

  setProgressStatus(prev => ({
    ...prev,
    [sectionId]: answeredCount,
  }));
  
  try {
    // Update the section with all necessary data
    const response = await axios.put(
      `${BASE_URL}/api/onboarding/${userId}/section/${sectionId}`,
      {
        data: data,
        isComplete: true,
        progress: progressStatus[sectionId]
      }
    );
    
    console.log(`✅ Section "${sectionId}" updated:`, response.data);
    
    // Update the selected section
    await axios.put(
      `${BASE_URL}/api/onboarding/${userId}/selected-section`,
      { sectionName: sectionId }
    );
    
  } catch (error: any) {
    console.error(
      `❌ Failed to update section "${sectionId}"`,
      error?.response?.data || error.message
    );
  }
};


const handleSubmit = () => {
console.log("Submitting application with data:", allSectionData)
// Here you can send the data to your backend
alert("Application submitted successfully!")
}

const overallProgress = calculateOverallProgress()

if (selectedSection === "preview") {
return (
<div className="flex h-screen bg-blue-900">
<Sidebar
selectedSection={selectedSection}
onSelectSection={setSelectedSection}
completionStatus={completionStatus}
isStageOneComplete={isStageOneComplete()}
progressStatus={progressStatus}
sectionConfigs={sectionConfigs}
overallProgress={overallProgress}
/>

<div className="flex-1 p-8 overflow-y-auto">
<div className="max-w-3xl mx-auto">
<div className="mb-8">
<h1 className="text-3xl font-bold text-white mb-2">Review & Submit</h1>
<p className="text-gray-200">Please review your information before submitting your application</p>
</div>

<PreviewSubmit
allSectionData={allSectionData}
completionStatus={completionStatus}
sectionConfigs={sectionConfigs}
onSubmit={handleSubmit}
/>
</div>
</div>
</div>
)
}

const config = sectionConfigs[selectedSection]

// Safety check: if selectedSection doesn't exist in sectionConfigs, default to identity
if (!config) {
console.warn(`Section '${selectedSection}' not found in sectionConfigs. Defaulting to 'identity'.`)
setSelectedSection("identity")
return null
}

const ContentComponent = config.component

return (
<div className="flex h-screen bg-blue-900">
<Sidebar
selectedSection={selectedSection}
onSelectSection={setSelectedSection}
completionStatus={completionStatus}
isStageOneComplete={isStageOneComplete()}
progressStatus={progressStatus}
sectionConfigs={sectionConfigs}
overallProgress={overallProgress}
/>

<div className="flex-1 p-8 overflow-y-auto">
<div className="max-w-3xl mx-auto">
<div className="mb-8 bg-white bg-opacity-10 rounded-lg p-4 mb-6">
<div className="flex items-center justify-between">
<div>
<p className="text-gray-200 text-sm">Overall Application Progress</p>
<p className="text-white text-2xl font-bold">{overallProgress}%</p>
</div>
<div className="w-24 h-24">
<svg viewBox="0 0 100 100" className="w-full h-full">
<circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="3" />
<circle
cx="50"
cy="50"
r="45"
fill="none"
stroke="#10b981"
strokeWidth="3"
strokeDasharray={`${2 * Math.PI * 45}`}
strokeDashoffset={`${2 * Math.PI * 45 * (1 - overallProgress / 100)}`}
strokeLinecap="round"
style={{
transition: "stroke-dashoffset 0.3s ease",
transform: "rotate(-90deg)",
transformOrigin: "50% 50%",
}}
/>
<text
x="50"
y="50"
textAnchor="middle"
dy="0.3em"
className="text-lg font-bold fill-white"
fontSize="20"
>
{overallProgress}%
</text>
</svg>
</div>
</div>
</div>

{/* Header */}
<div className="mb-8">
<h1 className="text-3xl font-bold text-white mb-2">{config.title}</h1>
<p className="text-gray-200">{config.description}</p>
</div>

<ContentComponent
initialData={allSectionData[selectedSection]}
onComplete={() => markSectionComplete(selectedSection)}
// onComplete={() => {}}
onProgressUpdate={(answeredCount: number) => updateSectionProgress(selectedSection, answeredCount)}
// onProgressUpdate={() => {}}
onSaveData={(data: Record<string, string>, answeredCount: number) => saveSectionData(selectedSection, data, answeredCount)}
/>
</div>
</div>
</div>
)
}

