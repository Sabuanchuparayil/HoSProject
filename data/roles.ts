import { Role, Permission } from '../types';
import { PERMISSION_MODULES } from './permissions';

const ALL_PERMISSIONS = Object.values(PERMISSION_MODULES).flat().map(p => p.id);

export const MOCK_ROLES: Role[] = [
    {
        id: 'admin',
        name: 'Administrator',
        description: 'Has full access to all platform features.',
        permissions: ALL_PERMISSIONS,
    },
    {
        id: 'seller',
        name: 'Seller',
        description: 'Manages their own products, orders, and storefront.',
        permissions: [
            'read:products', 'write:products', 'delete:products',
            'read:orders', 'write:orders', 'read:order_audit_log',
        ]
    },
    {
        id: 'customer',
        name: 'Customer',
        description: 'Can browse, purchase, and review products.',
        permissions: []
    },
    {
        id: 'finance_manager',
        name: 'Finance Manager',
        description: 'Manages all financial aspects of the platform.',
        permissions: ['read:financials', 'execute:payouts', 'read:sellers', 'read:orders']
    },
    {
        id: 'warehouse_operative',
        name: 'Warehouse Operative',
        description: 'Picks and packs orders for shipment.',
        permissions: ['read:orders', 'access:picking_dashboard']
    },
];
