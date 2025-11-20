import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductWithTotalStock, Seller, Theme, ProductReview, Order } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { ProductDetailSkeleton } from './skeletons/ProductDetailSkeleton';
import { useRecentlyViewed } from '../contexts/RecentlyViewedContext';
import { ProductMediaGallery } from './ProductMediaGallery';
import { ProductInfoPane } from './ProductInfoPane';
import { ProductRelatedItems } from './ProductRelatedItems';

interface ProductDetailProps {
  products: ProductWithTotalStock[];
  sellers: Seller[];
  isLoading: boolean;
  reviews: ProductReview[];
  orders: Order[];
  onAddReview: (review: Omit<ProductReview, 'id' | 'isVerifiedPurchase' | 'userName' | 'userId'>) => void;
}

const applyCustomizations = (themeName: Theme, customizations: Record<string, string> | undefined) => {
  const styleId = 'seller-theme-overrides';
  let styleElement = document.getElementById(styleId);

  if (styleElement) {
    styleElement.remove();
  }

  if (!customizations || Object.keys(customizations).length === 0) {
    return;
  }

  styleElement = document.createElement('style');
  styleElement.id = styleId;

  const styles = Object.entries(customizations)
    .map(([key, value]) => `${key}: ${value} !important;`)
    .join(' ');
    
  styleElement.innerHTML = `
    .theme-${themeName} {
      ${styles}
    }
  `;

  document.head.appendChild(styleElement);
};

const clearCustomizations = () => {
   const styleId = 'seller-theme-overrides';
   const styleElement = document.getElementById(styleId);
   if (styleElement) {
     styleElement.remove();
   }
};

export const ProductDetail: React.FC<ProductDetailProps> = ({ products, sellers, isLoading, reviews, orders, onAddReview }) => {
  const { id } = useParams<{ id: string }>();
  const { setPreviewThemeId, activeThemeConfig } = useTheme();
  const { addRecentlyViewed } = useRecentlyViewed();
  
  const product = products.find(p => p.id === parseInt(id || ''));
  const seller = product ? sellers.find(s => s.id === product.sellerId) : undefined;
  
  // Add to recently viewed when product is loaded
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
    }
  }, [product, addRecentlyViewed]);

  useEffect(() => {
    let sellerThemeWasApplied = false;
    if (seller?.theme) {
      setPreviewThemeId(seller.theme.name);
      applyCustomizations(seller.theme.name, seller.theme.customizations);
      sellerThemeWasApplied = true;
    }
    
    return () => {
      clearCustomizations();
      if (sellerThemeWasApplied) {
        setPreviewThemeId(null); 
      }
    };
  }, [seller, setPreviewThemeId]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="text-center py-20 container mx-auto">
        <h2 className="text-3xl font-bold font-cinzel mb-4">Oops! Product Not Found</h2>
        <p className="text-[--text-muted] mb-8">The magical item you're looking for seems to have vanished.</p>
        <Link to="/" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
          Return to All Products
        </Link>
      </div>
    );
  }

  const layout = activeThemeConfig.productPageLayout || 'classic-split';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
       <nav aria-label="Breadcrumb" className="mb-4 text-sm text-[--text-muted]">
        <ol className="flex items-center space-x-1">
            <li><Link to="/" className="hover:text-[--accent]">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><span className="font-semibold text-[--text-secondary]">{product.taxonomy.fandom}</span></li>
            <li><span className="mx-2">/</span></li>
            <li><span className="font-semibold text-[--text-secondary]">{product.taxonomy.subCategory}</span></li>
        </ol>
      </nav>

      {layout === 'classic-split' && (
        <div className="bg-[--bg-secondary] rounded-lg shadow-xl overflow-hidden md:flex">
            <div className="md:w-1/2">
                <ProductMediaGallery product={product} />
            </div>
            <div className="p-8 md:w-1/2 flex flex-col">
                <ProductInfoPane product={product} seller={seller} orders={orders} onAddReview={onAddReview} />
            </div>
        </div>
      )}

      {layout === 'image-focused-stack' && (
        <div className="bg-[--bg-secondary] rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
            <ProductMediaGallery product={product} />
            <div className="p-8">
                <ProductInfoPane product={product} seller={seller} orders={orders} onAddReview={onAddReview} />
            </div>
        </div>
      )}

      <ProductRelatedItems
        product={product}
        allProducts={products}
        reviews={reviews}
        orders={orders}
        onAddReview={onAddReview}
        isLoading={isLoading}
      />
    </div>
  );
};