import { Permission } from '../types';

interface PermissionInfo {
    id: Permission;
    label: string;
    description: string;
}

export const PERMISSION_MODULES: { [moduleName: string]: PermissionInfo[] } = {
    "Products": [
        { id: 'read:products', label: 'View Products', description: 'Can view all product information.' },
        { id: 'write:products', label: 'Create/Edit Products', description: 'Can add new products and modify existing ones.' },
        { id: 'delete:products', label: 'Delete Products', description: 'Can permanently delete products.' },
    ],
    "Sellers": [
        { id: 'read:sellers', label: 'View Sellers', description: 'Can view seller profiles and applications.' },
        { id: 'write:sellers', label: 'Manage Sellers', description: 'Can approve, reject, verify, and edit seller accounts.' },
    ],
    "Users": [
        { id: 'read:users', label: 'View Users', description: 'Can view all user accounts and their details.' },
        { id: 'write:users', label: 'Create/Edit Users', description: 'Can create new users and modify existing profiles.' },
        { id: 'delete:users', label: 'Delete Users', description: 'Can permanently delete user accounts.' },
    ],
    "Orders & Returns": [
        { id: 'read:orders', label: 'View Orders & Returns', description: 'Can view all customer orders and return requests.' },
        { id: 'write:orders', label: 'Manage Orders & Returns', description: 'Can update order statuses and process return requests.' },
    ],
    "Promotions": [
        { id: 'read:promotions', label: 'View Promotions', description: 'Can view discount codes and promotions.' },
        { id: 'write:promotions', label: 'Manage Promotions', description: 'Can create, edit, and deactivate promotions.' },
    ],
    "Logistics": [
        { id: 'manage:logistics', label: 'Manage Logistics', description: 'Can manage shipping carriers, rates, and view tracking.' },
    ],
    "Financials": [
        { id: 'read:financials', label: 'View Financials', description: 'Can view platform revenue and seller balances.' },
        { id: 'execute:payouts', label: 'Process Payouts', description: 'Can initiate payouts to seller accounts.' },
    ],
    "Content Management": [
        { id: 'manage:content', label: 'Manage Homepage Content', description: 'Can edit homepage hero, featured sections, and collections.' },
    ],
    "Platform Settings": [
        { id: 'manage:themes', label: 'Manage Platform Themes', description: 'Can upload, edit, and manage global themes for sellers.' },
        { id: 'manage:roles', label: 'Manage Roles & Permissions', description: 'Can create and modify user roles and their permissions.' },
        { id: 'manage:integrations', label: 'Manage Integrations', description: 'Can configure third-party API keys and settings.' },
    ]
};