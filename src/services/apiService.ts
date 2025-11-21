import axios from "axios";

import { MOCK_PRODUCTS } from "../data/products";
import { MOCK_SELLERS } from "../data/sellers";
import { MOCK_ORDERS } from "../data/orders";
import { MOCK_USERS } from "../data/users";
import { MOCK_RETURN_REQUESTS } from "../data/returns";
import { MOCK_TRANSACTIONS } from "../data/transactions";
import { MOCK_THEME_CONFIGURATIONS } from "../data/themes";
import { INITIAL_INTEGRATION_SETTINGS } from "../data/integrations";
import { MOCK_HOME_PAGE_CONTENT } from "../data/content";
import { MOCK_REVIEWS } from "../data/reviews";
import { MOCK_CARRIERS } from "../data/carriers";
import { MOCK_PROMOTIONS } from "../data/promotions";
import { MOCK_TRACKING_HISTORY } from "../data/tracking";

import { ThemeConfiguration } from "../types";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://hos-backend-production-31dc.up.railway.app";

console.log("API Base URL:", BASE_URL);

// REAL BACKEND API CLIENT
const real = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// FALLBACK MOCK RESPONSE
const fallback = <T>(data: T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), 200));

export const apiService = {
  fetchPlatformThemes: async (): Promise<ThemeConfiguration[]> => {
    try {
      const r = await real.get("/platform/themes");
      return r.data;
    } catch {
      console.warn("Themes API failed → using mock themes");
      return MOCK_THEME_CONFIGURATIONS;
    }
  },

  fetchProducts: async () => {
    try {
      const r = await real.get("/products");
      return r.data;
    } catch {
      return MOCK_PRODUCTS;
    }
  },

  fetchOrders: async () => {
    try {
      const r = await real.get("/orders");
      return r.data;
    } catch {
      return fallback(MOCK_ORDERS);
    }
  },

  fetchUsers: async () => fallback(MOCK_USERS),

  fetchTaxRates: async () => {
    try {
      const r = await real.get("/tax");
      return r.data;
    } catch {
      return { GB: 0.20, US: 0.08, CA: 0.13 };
    }
  },
};
