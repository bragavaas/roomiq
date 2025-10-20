import type { PropertyRecord } from "./types";

// 24 properties across US, CA, BR
export const PROPERTIES: PropertyRecord[] = [
  // US - Atlanta, GA
  { propertyId: "P100", name: "Peachtree House", country: "US", state: "GA", city: "Atlanta", lat: 33.7489, lng: -84.3900, propertyType: "co-living", bedrooms: 7, rooms: 12, amenities: ["wifi","laundry","cleaning-service"] },
  { propertyId: "P101", name: "Downtown Pods", country: "US", state: "GA", city: "Atlanta", lat: 33.7550, lng: -84.3905, propertyType: "co-living", bedrooms: 9, rooms: 20, amenities: ["wifi","kitchen","bike-storage"] },
  { propertyId: "P102", name: "Midtown Quarters", country: "US", state: "GA", city: "Atlanta", lat: 33.7815, lng: -84.3878, propertyType: "apartment", bedrooms: 5, rooms: 10 },
  { propertyId: "P103", name: "Grove Commons", country: "US", state: "GA", city: "Atlanta", lat: 33.7402, lng: -84.4140, propertyType: "house", bedrooms: 4, rooms: 8 },
  // US - Houston, TX
  { propertyId: "P110", name: "Midtown Flats", country: "US", state: "TX", city: "Houston", lat: 29.7420, lng: -95.3770, propertyType: "apartment", bedrooms: 6, rooms: 12 },
  { propertyId: "P111", name: "Bayou Co-Living", country: "US", state: "TX", city: "Houston", lat: 29.7608, lng: -95.3698, propertyType: "co-living", bedrooms: 10, rooms: 22 },
  { propertyId: "P112", name: "Medical Center Pods", country: "US", state: "TX", city: "Houston", lat: 29.7058, lng: -95.4010, propertyType: "co-living", bedrooms: 8, rooms: 16 },
  { propertyId: "P113", name: "Museum District House", country: "US", state: "TX", city: "Houston", lat: 29.7251, lng: -95.3903, propertyType: "house", bedrooms: 5, rooms: 9 },
  // US - Tampa, FL
  { propertyId: "P120", name: "Riverwalk Quarters", country: "US", state: "FL", city: "Tampa", lat: 27.9506, lng: -82.4572, propertyType: "co-living", bedrooms: 7, rooms: 12 },
  { propertyId: "P121", name: "Ybor Lofts", country: "US", state: "FL", city: "Tampa", lat: 27.9660, lng: -82.4385, propertyType: "apartment", bedrooms: 4, rooms: 8 },
  { propertyId: "P122", name: "Channelside Pods", country: "US", state: "FL", city: "Tampa", lat: 27.9420, lng: -82.4470, propertyType: "co-living", bedrooms: 9, rooms: 18 },
 ];
