'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '@/services/apiService';

interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
}

interface BranchContextType {
  branches: Branch[];
  selectedBranch: Branch | null;
  isLoading: boolean;
  selectBranch: (branchId: string) => void;
  findNearestBranch: (latitude: number, longitude: number) => Branch | null;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load branches from localStorage on initial render
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setIsLoading(true);
        const apiBranches = await apiService.getBranches();
        setBranches(apiBranches);
        
        // Load selected branch from localStorage
        const storedBranchId = localStorage.getItem('selectedBranchId');
        if (storedBranchId) {
          const branch = apiBranches.find(b => b.id === storedBranchId);
          if (branch) {
            setSelectedBranch(branch);
          }
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast.error('Failed to load branches');
        
        // Fall back to mock branches if there's an error
        const mockBranches: Branch[] = [
          {
            id: '1',
            name: 'Downtown Branch',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '212-555-1234',
            isOpen: true,
            latitude: 40.7128,
            longitude: -74.0060
          },
          {
            id: '2',
            name: 'Uptown Branch',
            address: '456 Park Ave',
            city: 'New York',
            state: 'NY',
            zipCode: '10022',
            phone: '212-555-5678',
            isOpen: true,
            latitude: 40.7589,
            longitude: -73.9851
          },
          {
            id: '3',
            name: 'Brooklyn Branch',
            address: '789 Bedford Ave',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11211',
            phone: '718-555-9012',
            isOpen: true,
            latitude: 40.7182,
            longitude: -73.9584
          }
        ];
        
        setBranches(mockBranches);
        
        // Load selected branch from localStorage
        const storedBranchId = localStorage.getItem('selectedBranchId');
        if (storedBranchId) {
          const branch = mockBranches.find(b => b.id === storedBranchId);
          if (branch) {
            setSelectedBranch(branch);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBranches();
  }, []);

  // Save selected branch to localStorage when it changes
  useEffect(() => {
    if (selectedBranch) {
      localStorage.setItem('selectedBranchId', selectedBranch.id);
    } else {
      localStorage.removeItem('selectedBranchId');
    }
  }, [selectedBranch]);

  const selectBranch = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
      toast.success(`Selected branch: ${branch.name}`);
    } else {
      toast.error('Branch not found');
    }
  };

  const findNearestBranch = (latitude: number, longitude: number): Branch | null => {
    if (!branches.length) return null;

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius of the Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c; // Distance in km
    };

    return branches
      .filter((branch: Branch) => branch.latitude && branch.longitude)
      .sort((a: Branch, b: Branch) => {
        const distanceA = calculateDistance(latitude, longitude, a.latitude!, a.longitude!);
        const distanceB = calculateDistance(latitude, longitude, b.latitude!, b.longitude!);
        return distanceA - distanceB;
      })[0] || null;
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        selectedBranch,
        isLoading,
        selectBranch,
        findNearestBranch
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
} 