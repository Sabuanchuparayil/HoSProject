import { ReturnRequest } from '../types';

export const MOCK_RETURN_REQUESTS: ReturnRequest[] = [
    {
        id: 'RET-HOS-1672574400000-1',
        orderId: 'HOS-1672574400000',
        items: [{ productId: 5, quantity: 1 }],
        reasonCode: 'UNWANTED',
        reasonDetail: "I thought it would fly.",
        status: 'Completed - Refunded',
        requestDate: '2023-08-15T10:00:00Z',
        resolutionType: 'Refund',
        adminNotes: 'Customer refunded for one Golden Snitch.',
        resolutionDate: '2023-08-18T16:00:00Z',
    }
];
