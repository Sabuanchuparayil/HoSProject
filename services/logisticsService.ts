import { ShippingAddress, ShippingOption, TrackingStatus, Carrier } from '../types';
import { apiService } from './apiService';


const getZoneForCountry = (countryCode: string): string => {
    switch (countryCode) {
        case 'GB': return 'UK';
        case 'US':
        case 'CA': return 'NA';
        default: return 'ROW'; // Rest of World
    }
};

/**
 * Calculates available shipping options for a given address by calling the backend.
 * @param address - The shipping address.
 * @param carriers - The array of available carriers (may not be needed if backend handles it).
 * @returns A promise that resolves to an array of ShippingOption.
 */
export const getShippingOptions = async (address: ShippingAddress, carriers: Carrier[]): Promise<ShippingOption[]> => {
    // In a real app, the backend would likely handle carrier logic based on the address.
    // This call simulates passing the destination to the backend to get rates.
    return apiService.getShippingOptions(address);
};

/**
 * Generates a mock tracking number for a given carrier.
 * @param carrierId - The ID of the carrier (e.g., 'owl-post').
 * @returns A formatted mock tracking number.
 */
export const generateTrackingNumber = (carrierId: string): string => {
    const prefix = carrierId.split('-')[0].toUpperCase();
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}-${randomNumber}`;
};


/**
 * Retrieves tracking history for a given tracking number from the backend API.
 * @param trackingNumber - The tracking number to look up.
 * @returns A promise resolving to an array of TrackingStatus objects.
 */
export const getTrackingInfo = async (trackingNumber: string): Promise<TrackingStatus[]> => {
    console.log(`Fetching tracking for ${trackingNumber}`);
    return apiService.getTrackingInfo(trackingNumber);
};