// FIXED apiService.ts — mock-only version

import { 
  Address, Carrier, HomePageContent, IntegrationSettings, Order, Product, 
  Promotion, ReturnRequest, Role, Seller, ThemeConfiguration, Transaction, 
  User, UserAddress, ShippingOption, ProductReview 
} from '../types';

import { TaxRates } from '../contexts/FinancialsContext';

// Import mock DB tables
import { MOCK_USERS } from '../data/users';
import { MOCK_ROLES } from '../data/roles';
import { MOCK_PRODUCTS } from '../data/products';
import { MOCK_SELLERS } from '../data/sellers';
import { MOCK_ORDERS } from '../data/orders';
import { MOCK_RETURN_REQUESTS } from '../data/returns';
import { MOCK_TRANSACTIONS } from '../data/transactions';
import { MOCK_THEME_CONFIGURATIONS } from '../data/themes';
import { INITIAL_INTEGRATION_SETTINGS } from '../data/integrations';
import { MOCK_HOME_PAGE_CONTENT } from '../data/content';
import { MOCK_REVIEWS } from '../data/reviews';
import { MOCK_CARRIERS } from '../data/carriers';
import { MOCK_PROMOTIONS } from '../data/promotions';
import { MOCK_TRACKING_HISTORY } from '../data/tracking';

// LOGGING
console.log("Using MOCK API service");

// Deep copies
let users = JSON.parse(JSON.stringify(MOCK_USERS));
let roles = JSON.parse(JSON.stringify(MOCK_ROLES));
let products = JSON.parse(JSON.stringify(MOCK_PRODUCTS));
let sellers = JSON.parse(JSON.stringify(MOCK_SELLERS));
let orders = JSON.parse(JSON.stringify(MOCK_ORDERS));
let returnRequests = JSON.parse(JSON.stringify(MOCK_RETURN_REQUESTS));
let transactions = JSON.parse(JSON.stringify(MOCK_TRANSACTIONS));
let platformThemes = JSON.parse(JSON.stringify(MOCK_THEME_CONFIGURATIONS));
let integrationSettings = JSON.parse(JSON.stringify(INITIAL_INTEGRATION_SETTINGS));
let homePageContent = JSON.parse(JSON.stringify(MOCK_HOME_PAGE_CONTENT));
let reviews = JSON.parse(JSON.stringify(MOCK_REVIEWS));
let carriers = JSON.parse(JSON.stringify(MOCK_CARRIERS));
let promotions = JSON.parse(JSON.stringify(MOCK_PROMOTIONS));
let taxRates: TaxRates = { "GB": 0.20, "US": 0.08, "CA": 0.13 };

const mockApi = (data, delay = 200) =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const apiService = {
  fetchProducts: () => mockApi(products),
  fetchTaxRates: () => mockApi(taxRates),
  fetchPlatformThemes: () => mockApi(platformThemes),
  fetchCarriers: () => mockApi(carriers),
  fetchPromotions: () => mockApi(promotions),
  fetchUsers: () => mockApi(users),
  fetchOrders: () => mockApi(orders),
  fetchReviews: () => mockApi(reviews),
  fetchHomePageContent: () => mockApi(homePageContent),
  fetchIntegrationSettings: () => mockApi(integrationSettings),
  fetchReturnRequests: () => mockApi(returnRequests),
  fetchSellers: () => mockApi(sellers),
  fetchRoles: () => mockApi(roles),
};
