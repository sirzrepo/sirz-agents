"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useLocation } from 'react-router-dom';
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
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

  interface SectionConfig {
    title: string
    description: string
    component: React.ComponentType<any>
    totalQuestions: number
  }

  // Base section configs that are always included
  const baseSectionConfigs: Record<string, SectionConfig> = {
    // Stage One questions
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
  };

  // Stage Two questions (for users without a store)
  const stageTwoConfigs: Record<string, SectionConfig> = {
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
  };

  // Stage Two B questions (for users with a store)
  const stageTwoBConfigs: Record<string, SectionConfig> = {
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
  };

  // Base completion status that's always present
  const baseCompletionStatus = {
    identity: false,
    goalsIntent: false,
    ecommerceExperience: false,
    challengesSupport: false,
    readinessExpectations: false,
  };

  // Stage 2 completion status (for users without a store)
  const stageTwoCompletionStatus = {
    validation: false,
    setupPrefrences: false,
    strategy: false,
    timeline: false,
  };

  // Stage 2B completion status (for users with a store)
  const stageTwoBCompletionStatus = {
    aboutStore: false,
    marketingGoals: false,
    contentNeeds: false,
    challengesAndSupport: false,
    gettingStarted: false,
  };

  // Initialize with base status only, we'll combine it with the appropriate stage 2 status in the component
  const initialCompletionStatus = { ...baseCompletionStatus }

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
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string>("identity")
  const { isHaveStore } = useSelector((state: RootState) => state.haveStore);
  const [completionStatus, setCompletionStatus] = useState<Record<string, boolean>>(() => ({
    ...baseCompletionStatus,
    ...(isHaveStore ? stageTwoBCompletionStatus : stageTwoCompletionStatus)
  }))
  const [progressStatus, setProgressStatus] = useState(initialProgressStatus)
  const [allSectionData, setAllSectionData] = useState<Record<string, Record<string, string>>>({})
  const [showSidebarOnMobile, setShowSidebarOnMobile] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  // Combine base configs with the appropriate stage two configs based on isHaveStore
  const sectionConfigs: Record<string, SectionConfig> = {
    ...baseSectionConfigs,
    ...(isHaveStore ? stageTwoBConfigs : stageTwoConfigs)
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlUserId = params.get("userId");
      setUserId(urlUserId);
      
      // Only redirect if there's no userId in the URL after checking
      if (!urlUserId) {
        console.log('No userId found in URL, redirecting...');
        window.location.href = "https://client.sirz.co.uk/";
      }
    }
  }, []);


  // Log progress status changes
  useEffect(() => {
    console.log('Progress Status Updated:', progressStatus)
    const currentSection = selectedSection
    if (currentSection) {
      console.log(`Current Section (${currentSection}) Progress:`, progressStatus[currentSection] || 0)
    }
  }, [progressStatus, selectedSection])


  const updateUserOnboardingStatus = async () => { 
    console.log("Updating user onboarding status...>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
    try {
      const response = await axios.put(`${BASE_URL}/api/onboardingProfiles/user/onboarding-status`, {
        userId,
        onboardingStatus: "in_progress"
      });
      console.log("✅ User onboarding status updated:", response.data);
    } catch (error) {
      console.log("❌ User onboarding status update failed:", error);
    }
  };

  const initializeApplicationForm = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/onboardingProfiles`, {
        userId,
        applicationFormData: [],
        completionStatus: {},
        progressStatus: {},
        isComplete: false
      });

      updateUserOnboardingStatus()
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
        const res = await axios.get(`${BASE_URL}/api/onboardingProfiles/user/${userId}`);
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

  useEffect(() => {
    if (!userId || !isLoaded) return;
    const updateSelectedSection = async () => {
      try {
        await axios.put(`${BASE_URL}/api/onboardingProfiles/${userId}/selected-section`, {
          sectionName: selectedSection,
        });
        console.log(`📌 Selected section updated: ${selectedSection}`);
      } catch (error: any) {
        console.error("⚠️ Failed to update selected section", error?.response?.data || error.message);
      }
    };
    updateSelectedSection();
  }, [selectedSection, userId, isLoaded]);

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

  const handleSelectSection = (sectionId: string) => {
    setSelectedSection(sectionId)
    if (window.innerWidth < 768) {
      setShowSidebarOnMobile(false)
    }
  }

  const handleBackClick = () => {
    if (window.innerWidth < 768) {
      setShowSidebarOnMobile(true)
    }
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
      // console.log("*************************", progressStatus)
      
      // Update backend
      try {
        // First update the specific section
        await axios.put(
          `${BASE_URL}/api/onboardingProfiles/${userId}/section/${sectionId}`, 
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

    setShowSidebarOnMobile(true)
    
    try {
      const payload = {
        data: data && Object.keys(data).length > 0 ? data : {}, // fallback
        isComplete: true,
        progress: updatedProgressStatus[sectionId] ?? 0, // use latest
      };
      // Update the section with all necessary data
      const response = await axios.put(
        `${BASE_URL}/api/onboardingProfiles/${userId}/section/${sectionId}`,
        payload
      );

      updateUserOnboardingStatus()
      
      console.log(`✅ Section "${sectionId}" updated:`, response.data);
      // setShowSidebarOnMobile(true)
      
      // Update the selected section
      await axios.put(
        `${BASE_URL}/api/onboardingProfiles/${userId}/selected-section`,
        { 
          sectionName: sectionId,
        }
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
      // alert("Application submitted successfully!")
    }

  const overallProgress = calculateOverallProgress()

    if (selectedSection === "preview") {
      return (
        <div className="flex h-screen bg-blue-900">
          <div className="hidden md:block">
            <Sidebar
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
              completionStatus={completionStatus}
              isStageOneComplete={isStageOneComplete()}
              progressStatus={progressStatus}
              sectionConfigs={sectionConfigs}
              overallProgress={overallProgress}
            />
          </div>

          {showSidebarOnMobile && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={() => setShowSidebarOnMobile(false)}
            />
          )}

          <div
            className={`fixed left-0 top-0 h-screen z-50 md:hidden transform transition-transform duration-300 ${
              showSidebarOnMobile ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              selectedSection={selectedSection}
              onSelectSection={handleSelectSection}
              completionStatus={completionStatus}
              isStageOneComplete={isStageOneComplete()}
              progressStatus={progressStatus}
              sectionConfigs={sectionConfigs}
              overallProgress={overallProgress}
            />
          </div>

        <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Review & Submit</h1>
        <p className="text-gray-200">Please review your information before submitting your application</p>
        </div>

        <PreviewSubmit
        formData={allSectionData}
          allSectionData={allSectionData}
          completionStatus={completionStatus}
          sectionConfigs={sectionConfigs}
          onSubmit={handleSubmit}
          userId={userId}
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
    <div className="hidden md:block">
      <Sidebar
        selectedSection={selectedSection}
        onSelectSection={handleSelectSection}
        completionStatus={completionStatus}
        isStageOneComplete={isStageOneComplete()}
        progressStatus={progressStatus}
        sectionConfigs={sectionConfigs}
        overallProgress={overallProgress}
      />
    </div>

        {showSidebarOnMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowSidebarOnMobile(false)}
          />
        )}

        <div
          className={`fixed left-0 top-0 h-screen z-50 md:hidden transform transition-transform duration-300 ${
            showSidebarOnMobile ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            selectedSection={selectedSection}
            onSelectSection={handleSelectSection}
            completionStatus={completionStatus}
            isStageOneComplete={isStageOneComplete()}
            progressStatus={progressStatus}
            sectionConfigs={sectionConfigs}
            overallProgress={overallProgress}
          />
        </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
        <div className="md:hidden mb-4 flex items-center justify-between">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setShowSidebarOnMobile(true)}
              className="text-white hover:text-gray-200 transition-colors text-sm font-medium"
            >
              Menu
            </button>
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
