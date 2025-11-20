import { IntegrationSettings, IntegrationName } from '../types';

interface IntegrationField {
    key: string;
    label: string;
    type: 'text' | 'password';
    placeholder: string;
    helpText: string;
}

export interface IntegrationConfig {
    id: IntegrationName;
    name: string;
    description: string;
    fields: IntegrationField[];
}

export const INTEGRATION_CONFIGS: IntegrationConfig[] = [
    {
        id: 'stripe',
        name: 'Stripe',
        description: 'Payment processing for credit cards and digital wallets.',
        fields: [
            {
                key: 'publicKey',
                label: 'Publishable Key',
                type: 'text',
                placeholder: 'pk_live_...',
                helpText: 'Found in your Stripe Dashboard under API Keys.'
            },
            {
                key: 'secretKey',
                label: 'Secret Key',
                type: 'password',
                placeholder: 'sk_live_...',
                helpText: 'This key is sensitive and should be kept confidential.'
            }
        ]
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'Enable customers to pay with their PayPal accounts.',
        fields: [
            {
                key: 'clientId',
                label: 'Client ID',
                type: 'text',
                placeholder: 'AbCdE...',
                helpText: 'Found in your PayPal Developer Dashboard.'
            },
            {
                key: 'clientSecret',
                label: 'Client Secret',
                type: 'password',
                placeholder: 'XyZ123...',
                helpText: 'This key is sensitive and should be kept confidential.'
            }
        ]
    },
    {
        id: 'shipstation',
        name: 'ShipStation',
        description: 'Sync orders for streamlined shipping and fulfillment.',
        fields: [
            {
                key: 'apiKey',
                label: 'API Key',
                type: 'password',
                placeholder: 'a1b2c3d4...',
                helpText: 'Generate an API Key in your ShipStation account settings.'
            },
            {
                key: 'apiSecret',
                label: 'API Secret',
                type: 'password',
                placeholder: 'e5f6g7h8...',
                helpText: 'This key is sensitive and should be kept confidential.'
            }
        ]
    }
];

// NOTE: In a real application, these values would be stored securely on a server,
// not in frontend code. This is for demonstration purposes only.
export const INITIAL_INTEGRATION_SETTINGS: IntegrationSettings = {
    stripe: {
        publicKey: '',
        secretKey: '',
    },
    paypal: {
        clientId: '',
        clientSecret: '',
    },
    shipstation: {
        apiKey: '',
        apiSecret: '',
    },
};
