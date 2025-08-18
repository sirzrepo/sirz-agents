/**
 * Formats a number as a currency string
 * @param value - The number to format
 * @param currency - The currency code (default: 'USD')
 * @returns Formatted currency string
 */
// export function formatCurrency(value: number, currency: string = 'USD'): string {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency,
//   }).format(value);
// } 

import axios from "axios";

export function formatCurrency(value: number, currency: string = 'NGN'): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
  }).format(value);
}


// Utility function to format date as relative time
export const formatRelativeTime = (date: Date | number | string): string => {
  const now = new Date();
  const inputDate = new Date(date);
  const diff = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.floor(diff / minute)} minute${diff >= minute * 2 ? 's' : ''} ago`;
  if (diff < day) return `${Math.floor(diff / hour)} hour${diff >= hour * 2 ? 's' : ''} ago`;
  if (diff < week) return `${Math.floor(diff / day)} day${diff >= day * 2 ? 's' : ''} ago`;
  if (diff < month) return `${Math.floor(diff / week)} week${diff >= week * 2 ? 's' : ''} ago`;
  if (diff < year) return `${Math.floor(diff / month)} month${diff >= month * 2 ? 's' : ''} ago`;
  return `${Math.floor(diff / year)} year${diff >= year * 2 ? 's' : ''} ago`;
};



// export const haversineDistance = (branchLat: number, branchLon: number, userLat: number, userLon: number): number => {
//   const R = 6371; // Radius of Earth in km
//   const dLat = (userLat - branchLat) * (Math.PI / 180);
//   const dLon = (userLon - branchLon) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos(branchLat * (Math.PI / 180)) * Math.cos(userLat * (Math.PI / 180)) *
//     Math.sin(dLon / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// }

// export const haversineDistance = (
//   branchLat: number,
//   branchLon: number,
//   userLat: number,
//   userLon: number
// ): number => {
//   const toRad = (deg: number) => deg * (Math.PI / 180);

//   const R = 6371; // Earth's radius in kilometers
//   const φ1 = toRad(branchLat);
//   const φ2 = toRad(userLat);
//   const Δφ = toRad(userLat - branchLat);
//   const Δλ = toRad(userLon - branchLon);

//   const a =
//     Math.sin(Δφ / 2) ** 2 +
//     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//   return R * c;
// };

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number): number => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}





export const getCoordinatesFromGoogle = async (address: string): Promise<{ lat: number; lon: number } | null> => {
  const API_KEY = "AIzaSyAdfmkEw27gmD5LWZlEUiwkDNDJkL4aEcw"; // Replace with your actual key
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    const result = response.data.results?.[0];

    if (result) {
      return {
        lat: result.geometry.location.lat,
        lon: result.geometry.location.lng,
      };
    }

    return null;
  } catch (error) {
    console.error("Google Geocoding error:", error);
    return null;
  }
};

