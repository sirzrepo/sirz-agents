import { OnboardingProfile, OnboardingStage } from '@/types/onboarding';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/onboarding';

// Helper function to handle API errors
const handleApiError = async (response: Response, defaultMessage: string): Promise<never> => {
  let errorMessage = defaultMessage;
  try {
    const errorData = await response.json();
    errorMessage = errorData.message || errorMessage;
  } catch (e) {
    errorMessage = response.statusText || errorMessage;
  }
  return Promise.reject(new Error(errorMessage));
};

// Helper function to create an empty profile
const createEmptyProfile = (userId: string): OnboardingProfile => ({
  _id: '',
  userId,
  stage1: { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
  stage2: { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
  stage2b: { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
  overallProgress: 0,
  completed: false,
  lastUpdated: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

interface CreateProfileResponse {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const createOnboardingProfile = async (userId: string): Promise<CreateProfileResponse> => {
  try {
    // First check if profile already exists
    const existingProfile = await getOnboardingProfile(userId).catch(() => null);
    
    if (existingProfile && existingProfile._id) {
      // If we have a profile but it doesn't have all required fields, update it
      if (!existingProfile.stage1 || !existingProfile.stage2 || !existingProfile.stage2b) {
        const now = new Date().toISOString();
        return updateOnboardingProfile(userId, {
          stage1: existingProfile.stage1 || { answers: {}, progress: 0, completed: false, lastUpdated: now },
          stage2: existingProfile.stage2 || { answers: {}, progress: 0, completed: false, lastUpdated: now },
          stage2b: existingProfile.stage2b || { answers: {}, progress: 0, completed: false, lastUpdated: now },
          lastUpdated: now,
          updatedAt: now
        }).then(profile => {
          if (!profile._id) {
            throw new Error('Profile ID is missing');
          }
          return {
            _id: profile._id,
            userId: profile.userId,
            createdAt: profile.createdAt || now,
            updatedAt: profile.updatedAt || now
          };
        });
      }
      
      return { 
        _id: existingProfile._id, 
        userId, 
        createdAt: existingProfile.createdAt || new Date().toISOString(), 
        updatedAt: existingProfile.updatedAt || new Date().toISOString() 
      };
    }

    const now = new Date().toISOString();
    const initialProfile: OnboardingProfile = {
      userId,
      stage1: { 
        answers: {}, 
        progress: 0, 
        completed: false,
        lastUpdated: now
      },
      stage2: { 
        answers: {}, 
        progress: 0, 
        completed: false,
        lastUpdated: now
      },
      stage2b: { 
        answers: {}, 
        progress: 0, 
        completed: false,
        lastUpdated: now
      },
      overallProgress: 0,
      completed: false,
      lastUpdated: now,
      createdAt: now,
      updatedAt: now
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initialProfile),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create onboarding profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Error in createOnboardingProfile:', error);
    throw error;
  }
};

export const updateOnboardingProfile = async (
  userId: string,
  updates: Partial<OnboardingProfile> & { [key: string]: any }
): Promise<OnboardingProfile> => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        // If update fails with 404, try creating a new profile with the updates
        console.log('Profile not found, creating new one with provided data...');
        try {
          // Create a new profile with the updates
          const newProfile: OnboardingProfile = {
            userId,
            stage1: updates.stage1 || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
            stage2: updates.stage2 || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
            stage2b: updates.stage2b || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
            overallProgress: updates.overallProgress || 0,
            completed: false,
            lastUpdated: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...updates
          };
          
          const createResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile)
          });
          
          if (!createResponse.ok) {
            throw new Error('Failed to create new profile after update failed');
          }
          
          return createResponse.json();
        } catch (createError) {
          console.error('Failed to create new profile after update failed:', createError);
          throw new Error('Profile not found and failed to create a new one');
        }
      }
      
      let errorMessage = 'Failed to update onboarding profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.error('Failed to parse error response:', e);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('Error in updateOnboardingProfile:', error);
    throw error;
  }
};

export const updateOnboardingSection = async (
  userId: string,
  stage: 'stage1' | 'stage2' | 'stage2b',
  sectionId: string,
  data: any
): Promise<OnboardingProfile> => {
  try {
    // First get the current profile to update progress
    const currentProfile = await getOnboardingProfile(userId);
    
    // Update the specific section data
    const updates: any = {
      [`${stage}.answers.${sectionId}`]: data,
      [`${stage}.lastUpdated`]: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate progress for the stage
    const currentStage = currentProfile[stage] || { answers: {} };
    const stageAnswers = { ...currentStage.answers, [sectionId]: data };
    const answeredCount = Object.values(stageAnswers).filter(Boolean).length;
    const progress = Math.min(100, Math.round((answeredCount / 10) * 100)); // Cap at 100%

    // Update progress
    updates[`${stage}.progress`] = progress;
    updates[`${stage}.completed`] = progress === 100;

    // Update the profile with the changes
    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      return handleApiError(response, 'Failed to update onboarding section');
    }

    // Get the updated profile to ensure we have the latest data
    return getOnboardingProfile(userId);
  } catch (error) {
    console.error('Error in updateOnboardingSection:', error);
    throw error;
  }
};

interface StageUpdateData {
  answers?: Record<string, any>;
  progress?: number;
  completed?: boolean;
}

export const updateOnboardingStage = async (
  userId: string,
  stageId: 'stage1' | 'stage2' | 'stage2b',
  updates: StageUpdateData
): Promise<OnboardingProfile> => {
  try {
    // First ensure the profile exists
    await createOnboardingProfile(userId);
    
    // Prepare the update payload according to the MongoDB schema
    const updatePayload: any = {
      ...updates,
      lastUpdated: new Date().toISOString()
    };

    const response = await fetch(`${API_URL}/user/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        [`${stageId}`]: updatePayload
      }, (key, value) => {
        // Convert Date objects to ISO strings
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      })
    });

    if (!response.ok) {
      return handleApiError(response, 'Failed to update stage');
    }

    // The server will handle:
    // 1. Updating the specific stage data
    // 2. Recalculating overallProgress
    // 3. Updating timestamps
    
    return response.json();
  } catch (error) {
    console.error('Error in updateOnboardingStage:', error);
    throw error;
  }
};

export const getOnboardingProfile = async (userId: string): Promise<OnboardingProfile> => {
  try {
    const response = await fetch(`${API_URL}/user/${userId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return createEmptyProfile(userId);
      }
      return handleApiError(response, 'Failed to fetch onboarding profile');
    }

    const data = await response.json();
    
    // Ensure all stages exist in the response
    return {
      ...data,
      stage1: data.stage1 || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
      stage2: data.stage2 || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
      stage2b: data.stage2b || { answers: {}, progress: 0, completed: false, lastUpdated: new Date().toISOString() },
    };
  } catch (error) {
    console.error('Error in getOnboardingProfile:', error);
    throw error;
  }
};



/**
 * Updates onboarding profile for a specific stage (e.g., stage1 for identity)
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {object} data - Object containing the identity answers (form data)
 */
export async function updateOnboardingProfileStages(userId: string, data: any, stageId: string) {
  try {
    // compute progress automatically based on answered count
    const answers = data.identityAndBackground
    const totalQuestions = Object.keys(answers).length
    const answeredCount = Object.values(answers).filter((v: any) => v.trim() !== "").length
    const progress = Math.round((answeredCount / totalQuestions) * 100)
    const completed = progress === 100

    const payload = {
      answers,
      progress,
      completed,
      $mergeAnswers: true,
    }

    const response = await axios.put(`${API_URL}/${userId}/stage/${stageId}`, payload)
    return response.data
  } catch (error) {
    console.error("Error updating onboarding profile:", error)
    throw error
  }
}
