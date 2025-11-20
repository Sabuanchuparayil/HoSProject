import { ReturnReason } from '../types';

export const RETURN_REASONS: ReturnReason[] = [
    { code: 'WRONG_ITEM', description: 'Received the wrong item' },
    { code: 'DAMAGED', description: 'Item arrived damaged' },
    { code: 'UNWANTED', description: 'No longer want/need the item' },
    { code: 'WRONG_SIZE', description: 'Item is the wrong size/fit' },
    { code: 'OTHER', description: 'Other (please specify)' },
];