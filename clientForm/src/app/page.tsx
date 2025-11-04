"use client"

import ApplicationWorkflow from "./clientOnbording/components/forms/applicationWorkflow"
import UserDetails from "./clientOnbording/components/forms/userDetails"
import { PreviewSubmit } from "./clientOnbording/components/questions/reviewSubmit"

export default function HomePage() {
  const allSectionData = {
    
  }
  const completionStatus = {
    
  }
  const sectionConfigs = {
    
  }
  const onSubmit = () => {
    
  }
  return (
    <>
      {/* <UserDetails /> */}
      {/* <PreviewSubmit 
        allSectionData={allSectionData}
        completionStatus={completionStatus}
        sectionConfigs={sectionConfigs}
        onSubmit={onSubmit}
       /> */}
      <ApplicationWorkflow />
    </>
  )
}

