import { TrackingStatus } from '../types';

type TrackingHistory = {
    [trackingNumber: string]: TrackingStatus[];
}

export const MOCK_TRACKING_HISTORY: TrackingHistory = {
    'ROM-123456789': [
        { timestamp: '2023-08-03T09:30:00Z', status: 'Delivered', location: 'Little Whinging, GB' },
        { timestamp: '2023-08-03T07:00:00Z', status: 'Out for delivery', location: 'Surrey Sorting Office, GB' },
        { timestamp: '2023-08-02T18:00:00Z', status: 'In transit to local facility', location: 'London Central Hub, GB' },
        { timestamp: '2023-08-02T14:00:00Z', status: 'Dispatched from sender', location: 'Diagon Alley, London, GB' },
    ]
};
