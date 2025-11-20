import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter as Router, Route, Routes, Outlet, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { ProductDetail } from './components/ProductDetail';
import { CartPage } from './components/CartPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CurrencyProvider, useCurrency } from './contexts/CurrencyContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LogisticsProvider } from './contexts/LogisticsContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { PromotionsProvider } from './contexts/PromotionsContext';
import { FinancialsProvider } from './contexts/FinancialsContext';
import { Product, Seller, SellerTheme, ProductWithTotalStock, AuditLogEntry, Order, PayoutRecord, ReturnRequest, Theme as ThemeType, User, ThemeConfiguration, HomePageLayoutId, Role, Transaction, OrderAuditLogEntry, IntegrationSettings, HomePageContent, ProductReview } from './types';
import { AdminLayout } from './components/admin/AdminLayout';
import { SellerDashboardPage } from './components/admin/SellerDashboardPage';
import { AdminProductsPage } from './components/admin/AdminProductsPage';
import { AdminUsersPage } from './components/admin/AdminUsersPage';
import { AdminOrdersPage } from './components/admin/AdminOrdersPage';
import { AdminPromotionsPage } from './components/admin/AdminPromotionsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProfilePage } from './components/ProfilePage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderConfirmationPage } from './components/OrderConfirmationPage';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { OrderDetailPage } from './components/OrderDetailPage';
import { SellerOnboardingPage } from './components/SellerOnboardingPage';
import { AdminSellersPage } from './components/admin/AdminSellersPage';
import { FinancialsDashboard } from './components/admin/FinancialsDashboard';
import { AdminReturnsPage } from './components/admin/AdminReturnsPage';
import { AdminRolesPage } from './components/admin/AdminRolesPage';
import { ProductCardSkeleton } from './components/skeletons/ProductCardSkeleton';
import { injectThemeStyles, removeAllInjectedStyles } from './services/themeStyleService';
import { AdminPlatformThemesPage } from './components/admin/AdminPlatformThemesPage';
import { ThemeManagementRouter } from './components/admin/ThemeManagementRouter';
import { StandardHeroLayout } from './components/layouts/StandardHeroLayout';
import { FeaturedProductLayout } from './components/layouts/FeaturedProductLayout';
import { EnchantedHomepageLayout } from './components/layouts/EnchantedHomepageLayout';
import { AdminOrderDetailPage } from './components/admin/AdminOrderDetailPage';
import { LogisticsDashboard } from './components/admin/LogisticsDashboard';
import { ShippingPolicyPage } from './components/ShippingPolicyPage';
import { ReturnsPolicyPage } from './components/ReturnsPolicyPage';
import { GeminiChat } from './components/GeminiChat';
import { fuzzyMatch } from './services/searchService';
import { AdminIntegrationsPage } from './components/admin/AdminIntegrationsPage';
import { WishlistProvider } from './contexts/WishlistContext';
import { WishlistPage } from './components/WishlistPage';
import { RecentlyViewedProvider } from './contexts/RecentlyViewedContext';
import { AdminContentHomePage } from './components/admin/AdminContentHomePage';
import { SearchPage } from './components/SearchPage';
import { SellerPayoutsPage } from './components/admin/SellerPayoutsPage';
import { AdminBulkUploadPage } from './components/admin/AdminBulkUploadPage';
import { PickerDashboardPage } from './components/admin/PickerDashboardPage';
import { DeliveryCoordinatorPage } from './components/admin/DeliveryCoordinatorPage';
import { NewsletterSignup } from './components/NewsletterSignup';
import { ChatProvider } from './contexts/ChatContext';
import { apiService } from './services/apiService';


const LAYOUTS: Record<HomePageLayoutId, React.ComponentType<any>> = {
    standard: StandardHeroLayout,
    featured: FeaturedProductLayout,
    enchanted: EnchantedHomepageLayout,
};

const HomePage: React.FC<{ products: ProductWithTotalStock[], isLoading: boolean, homePageContent: HomePageContent | null, allOrders: Order[] }> = ({ products, isLoading, homePageContent, allOrders }) => {
    const { currency, formatPrice } = useCurrency();
    const { t } = useLanguage();
    const { activeThemeConfig } = useTheme();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFandom, setSelectedFandom] = useState('All');
    const [sortOrder, setSortOrder] = useState('default');

    const PRODUCTS_PER_PAGE = 50;

    const maxPrice = useMemo(() => {
        if (products.length === 0) return 1000;
        const max = Math.ceil(Math.max(...products.map(p => p.pricing[currency] || 0)));
        return max > 0 ? max : 1000;
    }, [products, currency]);

    const [priceLimit, setPriceLimit] = useState(maxPrice);

    // Reset price limit when maxPrice changes from props
    useEffect(() => {
        setPriceLimit(maxPrice);
    }, [maxPrice]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [priceLimit, selectedFandom, sortOrder]);


    const filteredAndSortedProducts = useMemo(() => {
        let sortedProducts = products
            .filter(p => selectedFandom === 'All' || p.taxonomy.fandom === selectedFandom)
            .filter(p => (p.pricing[currency] || 0) <= priceLimit);

        switch (sortOrder) {
            case 'price-asc':
                sortedProducts.sort((a, b) => (a.pricing[currency] || 0) - (b.pricing[currency] || 0));
                break;
            case 'price-desc':
                sortedProducts.sort((a, b) => (b.pricing[currency] || 0) - (a.pricing[currency] || 0));
                break;
            case 'newest':
                sortedProducts.sort((a, b) => b.id - a.id);
                break;
            case 'rating-desc':
                sortedProducts.sort((a, b) => b.averageRating - a.averageRating);
                break;
            case 'default':
            default:
                break;
        }

        return sortedProducts;
    }, [products, priceLimit, currency, selectedFandom, sortOrder]);

    // Pagination logic
    const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredAndSortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
    }, [filteredAndSortedProducts, currentPage]);

    const LayoutComponent = LAYOUTS[activeThemeConfig.layout] || StandardHeroLayout;
    
    const paginationControls = totalPages > 1 ? (
        <div className="flex justify-center items-center gap-1 sm:gap-2 mt-12" role="navigation" aria-label="Pagination">
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-[--bg-secondary] border border-[--border-color] rounded-md hover:bg-[--bg-tertiary] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
            >
                Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`hidden sm:inline-block px-4 py-2 text-sm border rounded-md transition-colors ${
                        currentPage === pageNumber
                            ? 'bg-[--accent] text-[--accent-foreground] border-[--accent] font-bold'
                            : 'bg-[--bg-secondary] border-[--border-color] hover:bg-[--bg-tertiary]'
                    }`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                    {pageNumber}
                </button>
            ))}
             <span className="sm:hidden text-sm text-[--text-muted]">Page {currentPage} of {totalPages}</span>
            <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-[--bg-secondary] border border-[--border-color] rounded-md hover:bg-[--bg-tertiary] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
            >
                Next
            </button>
        </div>
    ) : null;


    return (
        <LayoutComponent 
            products={paginatedProducts}
            allProducts={products}
            isLoading={isLoading}
            homePageContent={homePageContent}
            allOrders={allOrders}
            filterControls={
                <div id="product-section" className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="price-filter" className="block text-sm font-medium text-[--text-muted] mb-2">
                                Filter by Price: <span>Up to {formatPrice(priceLimit, currency)}</span>
                            </label>
                            <input
                                id="price-filter"
                                type="range"
                                min={0}
                                max={maxPrice}
                                value={priceLimit}
                                onChange={(e) => setPriceLimit(Number(e.target.value))}
                                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="sort-order" className="block text-sm font-medium text-[--text-muted] mb-2">Sort by</label>
                            <select 
                                id="sort-order"
                                value={sortOrder}
                                onChange={e => setSortOrder(e.target.value)}
                                className="w-full bg-[--bg-primary] border border-[--border-color] rounded-md py-2 px-3 text-[--text-primary] focus:ring-[--accent] focus:border-[--accent]"
                            >
                                <option value="default">Default</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="newest">Newest Arrivals</option>
                                <option value="rating-desc">Highest Rated</option>
                            </select>
                        </div>
                    </div>
                </div>
            }
            paginationControls={paginationControls}
            onSelectFandom={setSelectedFandom}
        />
    );
};

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <NewsletterSignup />
      <Footer />
      <GeminiChat />
    </div>
  )
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, allowedRoles?: User['role'][] }> = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if(allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = (user.role === 'admin' || user.role === 'seller') ? '/admin' : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <>{children}</>;
};


const AppContent: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [platformThemes, setPlatformThemes] = useState<ThemeConfiguration[]>([]);
  const [integrationSettings, setIntegrationSettings] = useState<IntegrationSettings | null>(null);
  const [homePageContent, setHomePageContent] = useState<HomePageContent | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  
  const { activeThemeConfig, setPreviewThemeId } = useTheme();
  const { user, users, addUser, adminUpdateUser, deleteUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const themeClass = isAdminRoute
    ? 'admin-dashboard'
    : `theme-${activeThemeConfig.id}`;

  // Inject custom theme styles into the document head
  useEffect(() => {
      if(platformThemes.length === 0) return;
      removeAllInjectedStyles(); // Clear old styles on change
      platformThemes.forEach(theme => {
          if (theme.isCustom && theme.cssContent) {
              injectThemeStyles(theme.id, theme.cssContent);
          }
      });
      return () => removeAllInjectedStyles();
  }, [platformThemes]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          productsData,
          sellersData,
          ordersData,
          rolesData,
          returnsData,
          transactionsData,
          themesData,
          integrationsData,
          contentData,
          reviewsData,
        ] = await Promise.all([
          apiService.fetchProducts(),
          apiService.fetchSellers(),
          apiService.fetchOrders(),
          apiService.fetchRoles(),
          apiService.fetchReturnRequests(),
          apiService.fetchTransactions(),
          apiService.fetchPlatformThemes(),
          apiService.fetchIntegrationSettings(),
          apiService.fetchHomePageContent(),
          apiService.fetchReviews(),
        ]);

        setProducts(productsData);
        setSellers(sellersData);
        setOrders(ordersData);
        setRoles(rolesData);
        setReturnRequests(returnsData);
        setTransactions(transactionsData);
        setPlatformThemes(themesData);
        setIntegrationSettings(integrationsData);
        setHomePageContent(contentData);
        setReviews(reviewsData);

      } catch (error) {
        console.error("Failed to fetch initial data:", error);
        // Here you could set an error state to show a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const productsWithDerivedData = useMemo(() => {
    return products.map(product => {
        const productReviews = reviews.filter(r => r.productId === product.id);
        const reviewCount = productReviews.length;
        const averageRating = reviewCount > 0
            ? productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
            : 0;
        
        const stock = product.hasVariations && product.variations
            ? product.variations.reduce((total, v) => total + v.inventory.reduce((sum, loc) => sum + loc.stock, 0), 0)
            : product.inventory.reduce((sum, loc) => sum + loc.stock, 0);

        return {
            ...product,
            stock,
            averageRating,
            reviewCount,
        };
    });
  }, [products, reviews]);

  const addProduct = async (productData: Omit<Product, 'id' | 'sellerId'> & { sellerId?: number }) => {
    try {
        // FIX: The apiService expects a sellerId, but the productData type allows it to be optional.
        // The form validation should ensure a sellerId is present before submission,
        // so we cast the type to satisfy the API contract.
        const newProduct = await apiService.addProduct(productData as Omit<Product, 'id'>);
        setProducts(prev => [...prev, newProduct]);
    } catch (error) {
        console.error("Failed to add product:", error);
        alert("Error: Could not add product.");
    }
  };

  const updateProduct = async (updatedProduct: Product) => {
    try {
        const savedProduct = await apiService.updateProduct(updatedProduct);
        setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
    } catch (error) {
        console.error("Failed to update product:", error);
        alert("Error: Could not update product.");
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
        await apiService.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Error: Could not delete product.");
    }
  };

  const addSeller = async (application: Omit<Seller, 'id' | 'theme' | 'status' | 'applicationDate' | 'isVerified' | 'performance' | 'auditLog' | 'financials' | 'unlockedThemes' | 'payoutsEnabled'>) => {
    try {
        const newSeller = await apiService.addSeller(application);
        setSellers(prev => [...prev, newSeller]);
    } catch (error) {
        console.error("Failed to add seller:", error);
        alert("Error: Could not submit seller application.");
    }
  };
  
  const adminAddSeller = async (sellerData: Pick<Seller, 'name' | 'businessName' | 'contactEmail' | 'type' | 'status'>) => {
    try {
        const newSeller = await apiService.addSeller(sellerData);
        setSellers(prev => [...prev, newSeller]);
    } catch (error) {
        console.error("Failed to add seller:", error);
        alert("Error: Could not add seller.");
    }
  };
  
  const adminUpdateSeller = async (updatedSeller: Seller) => {
    try {
        const savedSeller = await apiService.updateSeller(updatedSeller);
        setSellers(prev => prev.map(s => s.id === savedSeller.id ? savedSeller : s));
    } catch (error) {
        console.error("Failed to update seller:", error);
        alert("Error: Could not update seller.");
    }
  };

  const updateSellerStatus = async (sellerId: number, status: 'approved' | 'rejected') => {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return;
    const newLogEntry: AuditLogEntry = {
        action: status,
        admin: user?.name || 'Admin',
        timestamp: new Date().toISOString(),
    };
    await adminUpdateSeller({ ...seller, status, auditLog: [...seller.auditLog, newLogEntry] });
  };
  
  const toggleSellerVerification = async (sellerId: number) => {
    const seller = sellers.find(s => s.id === sellerId);
    if (!seller) return;
    const newVerifiedStatus = !seller.isVerified;
    const newLogEntry: AuditLogEntry = {
        action: newVerifiedStatus ? 'verified' : 'unverified',
        admin: user?.name || 'Admin',
        timestamp: new Date().toISOString(),
    };
    await adminUpdateSeller({ ...seller, isVerified: newVerifiedStatus, auditLog: [...seller.auditLog, newLogEntry] });
  };

  const updateSellerTheme = async (sellerId: number, theme: SellerTheme) => {
    const seller = sellers.find(s => s.id === sellerId);
    if (seller) {
        await adminUpdateSeller({ ...seller, theme });
    }
  };
  
  const unlockThemeForSeller = async (sellerId: number, theme: ThemeConfiguration) => {
    try {
        const updatedSeller = await apiService.unlockTheme(sellerId, theme.id);
        setSellers(prev => prev.map(s => s.id === updatedSeller.id ? updatedSeller : s));
        alert(`Theme unlocked! ${theme.price} GBP has been deducted from the balance.`);
    } catch (error) {
        console.error("Failed to unlock theme:", error);
        alert("Failed to unlock theme. The seller may have insufficient balance.");
    }
  };

  const addOrder = async (order: Order) => {
    try {
        const newOrder = await apiService.addOrder(order);
        setOrders(prev => [newOrder, ...prev]);
        // Transactions should be created on the backend when an order is created.
        // We'll fetch updated transactions to reflect the change.
        apiService.fetchTransactions().then(setTransactions);
        apiService.fetchSellers().then(setSellers); // Refresh seller balance
    } catch (error) {
        console.error("Failed to add order:", error);
        alert("Error: Could not place order.");
    }
  };

  const addReview = async (reviewData: Omit<ProductReview, 'id' | 'isVerifiedPurchase' | 'userName' | 'userId'>) => {
    try {
        // FIX: The apiService expects a full review object. We enrich the reviewData
        // with user information and verification status before sending it.
        if (!user) {
            alert('You must be logged in to submit a review.');
            return;
        }

        // The backend should ultimately verify this, but we can determine it here to satisfy the type.
        const hasPurchased = orders.some(order => 
            order.shippingAddress.email === user.email &&
            order.items.some(item => item.id === reviewData.productId) &&
            order.status === 'Delivered'
        );

        const newReview = await apiService.addReview({
            ...reviewData,
            userId: user.id,
            userName: user.name,
            isVerifiedPurchase: hasPurchased,
        });
        setReviews(prev => [newReview, ...prev]);
        // Loyalty points should be handled by the backend.
        // Refresh user data if needed.
        if (user) {
            adminUpdateUser({ ...user, loyaltyPoints: (user.loyaltyPoints || 0) + 10 }); // Optimistic update
        }
    } catch (error) {
        console.error("Failed to add review:", error);
        alert("Error: Could not submit review.");
    }
  };

  const updateOrderStatus = async (
    orderId: string, 
    updates: Partial<Pick<Order, 'status' | 'carrier' | 'trackingNumber' | 'trackingUrl' | 'shippingNotes'>>, 
    notes?: string
  ) => {
    try {
        const updatedOrder = await apiService.updateOrder(orderId, { updates, notes });
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    } catch (error) {
        console.error("Failed to update order status:", error);
        alert("Error: Could not update order status.");
    }
  };
  
  const processSellerPayout = async (sellerId: number, currency: string) => {
    try {
        const result = await apiService.processPayout({ sellerId, currency });
        if (result.success) {
            // Refresh seller and transaction data
            apiService.fetchSellers().then(setSellers);
            apiService.fetchTransactions().then(setTransactions);
        }
    } catch (error) {
        console.error("Failed to process payout:", error);
        alert("Error: Could not process payout.");
    }
  };
  
  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date' | 'processedBy'>) => {
    try {
        const newTransaction = await apiService.addTransaction(transaction);
        setTransactions(prev => [newTransaction, ...prev]);
        // Refresh seller balance
        apiService.fetchSellers().then(setSellers);
    } catch (error) {
        console.error("Failed to add transaction:", error);
        alert("Error: Could not add manual transaction.");
    }
  };

  const addReturnRequest = async (request: ReturnRequest) => {
    try {
        const newRequest = await apiService.addReturnRequest(request);
        setReturnRequests(prev => [...prev, newRequest]);
        // Update the order status locally for immediate feedback
        setOrders(prev => prev.map(o => o.id === newRequest.orderId ? { ...o, status: 'Return Requested' } : o));
    } catch (error) {
        console.error("Failed to add return request:", error);
        alert("Error: Could not submit return request.");
    }
  };

  const updateReturnRequest = async (updatedRequest: Partial<ReturnRequest> & { id: string }) => {
    try {
        const savedRequest = await apiService.updateReturnRequest(updatedRequest);
        setReturnRequests(prev => prev.map(r => r.id === savedRequest.id ? savedRequest : r));
        // Refresh related orders and transactions if a refund was processed
        if (savedRequest.status.startsWith('Completed') || savedRequest.status.startsWith('Rejected')) {
            apiService.fetchOrders().then(setOrders);
            apiService.fetchTransactions().then(setTransactions);
            apiService.fetchSellers().then(setSellers);
        }
    } catch (error) {
        console.error("Failed to update return request:", error);
        alert("Error: Could not update return request.");
    }
  };
  
  const addTheme = async (theme: ThemeConfiguration) => {
    try {
        const newTheme = await apiService.addTheme(theme);
        setPlatformThemes(prev => [...prev, newTheme]);
    } catch (error) {
        console.error("Failed to add theme:", error);
        alert("Error: Could not add theme.");
    }
  };
  
  const updateTheme = async (updatedTheme: ThemeConfiguration) => {
    try {
        const savedTheme = await apiService.updateTheme(updatedTheme);
        setPlatformThemes(prev => prev.map(t => t.id === savedTheme.id ? savedTheme : t));
    } catch (error) {
        console.error("Failed to update theme:", error);
        alert("Error: Could not update theme.");
    }
  };

  const addRole = async (role: Omit<Role, 'id'>) => {
    try {
        const newRole = await apiService.addRole(role);
        setRoles(prev => [...prev, newRole]);
    } catch (error) {
        console.error("Failed to add role:", error);
        alert("Error: Could not add role.");
    }
  };
  
  const updateIntegrationSettings = async (settings: IntegrationSettings) => {
    try {
      const savedSettings = await apiService.updateIntegrationSettings(settings);
      setIntegrationSettings(savedSettings);
    } catch (error) {
        console.error("Failed to update integration settings:", error);
        alert("Error: Could not update integration settings.");
    }
  };
  
  const updateHomePageContent = async (content: HomePageContent) => {
    try {
        const savedContent = await apiService.updateHomePageContent(content);
        setHomePageContent(savedContent);
    } catch (error) {
        console.error("Failed to update homepage content:", error);
        alert("Error: Could not update homepage content.");
    }
  }

  return (
    <div className={`${themeClass} bg-[--bg-primary] min-h-screen text-[--text-primary]`}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage products={productsWithDerivedData} isLoading={isLoading} homePageContent={homePageContent} allOrders={orders} />} />
            <Route path="search" element={<SearchPage products={productsWithDerivedData} />} />
            <Route path="product/:id" element={<ProductDetail products={productsWithDerivedData} sellers={sellers} isLoading={isLoading} reviews={reviews} orders={orders} onAddReview={addReview} />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="shipping-policy" element={<ShippingPolicyPage />} />
            <Route path="returns-policy" element={<ReturnsPolicyPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="seller-onboarding" element={<SellerOnboardingPage onAddSeller={addSeller} />} />
            <Route path="checkout" element={<ProtectedRoute allowedRoles={['customer']}><CheckoutPage onAddOrder={addOrder} /></ProtectedRoute>} />
            <Route path="order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="profile" element={<ProtectedRoute allowedRoles={['customer']}><ProfilePage /></ProtectedRoute>} />
            <Route path="orders" element={<ProtectedRoute allowedRoles={['customer']}><OrderHistoryPage orders={orders} /></ProtectedRoute>} />
            <Route path="orders/:id" element={<ProtectedRoute allowedRoles={['customer']}><OrderDetailPage orders={orders} returnRequests={returnRequests} onAddReturnRequest={addReturnRequest} /></ProtectedRoute>} />
            <Route path="wishlist" element={<ProtectedRoute allowedRoles={['customer']}><WishlistPage products={productsWithDerivedData} /></ProtectedRoute>} />
        </Route>
        
        <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'finance_manager', 'accountant', 'order_manager', 'shipping_coordinator', 'support_agent', 'content_moderator', 'marketing_manager', 'warehouse_operative', 'logistics_coordinator', 'customer_support_lead', 'catalog_manager', 'delivery_coordinator']}>
                <AdminLayout user={user} roles={roles}/>
            </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SellerDashboardPage user={user} products={productsWithDerivedData} orders={orders} sellers={sellers} />} />
          <Route path="products" element={
            <AdminProductsPage 
              products={productsWithDerivedData} 
              sellers={sellers}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct} 
            />
          } />
          <Route path="bulk-upload" element={
            <ProtectedRoute allowedRoles={['admin', 'seller', 'content_moderator', 'catalog_manager']}>
                <AdminBulkUploadPage
                    products={productsWithDerivedData}
                    onAddProduct={addProduct}
                    onUpdateProduct={updateProduct}
                />
            </ProtectedRoute>
          } />
          <Route path="sellers" element={
            <AdminRoute>
              <AdminSellersPage 
                sellers={sellers}
                onUpdateSellerStatus={updateSellerStatus} 
                onToggleSellerVerification={toggleSellerVerification}
                onAddSeller={adminAddSeller}
                onUpdateSeller={adminUpdateSeller}
              />
            </AdminRoute>
          } />
          <Route path="users" element={
              <AdminRoute>
                <AdminUsersPage 
                    users={users} 
                    onAddUser={addUser} 
                    onUpdateUser={adminUpdateUser} 
                    onDeleteUser={deleteUser}
                />
              </AdminRoute>
          } />
           <Route path="roles" element={
              <AdminRoute>
                <AdminRolesPage 
                    roles={roles}
                    users={users}
                    onAddRole={addRole}
                />
              </AdminRoute>
          } />
          <Route path="orders" element={<AdminOrdersPage orders={orders} />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage orders={orders} onUpdateStatus={updateOrderStatus} roles={roles}/>} />
          <Route path="picking-dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'warehouse_operative', 'shipping_coordinator']}>
                  <PickerDashboardPage orders={orders} products={productsWithDerivedData} />
              </ProtectedRoute>
          } />
           <Route path="delivery-dashboard" element={
              <ProtectedRoute allowedRoles={['admin', 'delivery_coordinator']}>
                  <DeliveryCoordinatorPage orders={orders} onUpdateStatus={updateOrderStatus} />
              </ProtectedRoute>
          } />
          <Route path="promotions" element={
            <ProtectedRoute allowedRoles={['admin', 'marketing_manager']}>
                <AdminPromotionsPage />
            </ProtectedRoute>
          } />
          <Route path="returns" element={<AdminReturnsPage returnRequests={returnRequests} orders={orders} onUpdateReturnRequest={updateReturnRequest} />} />
          <Route path="financials" element={
             <ProtectedRoute allowedRoles={['admin', 'finance_manager', 'accountant']}>
              <FinancialsDashboard
                sellers={sellers} 
                orders={orders} 
                transactions={transactions}
                onProcessPayout={processSellerPayout} 
                onAddTransaction={addTransaction}
              />
             </ProtectedRoute>
          } />
          <Route path="banking" element={
            <ProtectedRoute allowedRoles={['seller']}>
              <SellerPayoutsPage sellers={sellers} onUpdateSeller={adminUpdateSeller} />
            </ProtectedRoute>
          } />
          <Route path="logistics" element={
            <ProtectedRoute allowedRoles={['admin', 'shipping_coordinator', 'logistics_coordinator']}>
              <LogisticsDashboard orders={orders} returnRequests={returnRequests} />
            </ProtectedRoute>
          } />
          <Route path="content/home" element={
            <ProtectedRoute allowedRoles={['admin', 'marketing_manager']}>
              <AdminContentHomePage content={homePageContent} onUpdateContent={updateHomePageContent} allProducts={productsWithDerivedData} />
            </ProtectedRoute>
          } />
           <Route path="integrations" element={
            <AdminRoute>
              <AdminIntegrationsPage settings={integrationSettings} onUpdate={updateIntegrationSettings} />
            </AdminRoute>
          } />
          <Route path="theme" element={
            <ThemeManagementRouter
              sellers={sellers} 
              onUpdateSellerTheme={updateSellerTheme} 
              onPreviewThemeChange={setPreviewThemeId}
              platformThemes={platformThemes}
              onUnlockTheme={unlockThemeForSeller}
            />
          } />
          <Route path="platform-themes" element={
            <AdminRoute>
              <AdminPlatformThemesPage 
                themes={platformThemes} 
                onAddTheme={addTheme} 
                onUpdateTheme={updateTheme} 
              />
            </AdminRoute>
          } />
        </Route>
      </Routes>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <LogisticsProvider>
            <PromotionsProvider>
              <CartProvider>
                <WishlistProvider>
                  <RecentlyViewedProvider>
                    <ThemeProvider>
                      <FinancialsProvider>
                        <ChatProvider>
                          <Router>
                            <AppContent />
                          </Router>
                        </ChatProvider>
                      </FinancialsProvider>
                    </ThemeProvider>
                  </RecentlyViewedProvider>
                </WishlistProvider>
              </CartProvider>
            </PromotionsProvider>
          </LogisticsProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
