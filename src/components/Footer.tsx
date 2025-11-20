import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const handleNewsletterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const newsletterSection = document.getElementById('newsletter-email');
    if (newsletterSection) {
      newsletterSection.focus({ preventScroll: true });
      newsletterSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return (
    <footer className="bg-[--bg-tertiary] border-t border-[--accent]/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold font-cinzel text-[--accent] mb-4">House of Spells</h3>
            <p className="text-[--text-muted] mb-4">Your portal to the world of authentic fandom merchandise.</p>
             <div className="flex space-x-6">
              <a href="#" aria-label="Visit our Twitter page" className="text-[--text-muted] hover:text-[--accent] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Visit our Instagram page" className="text-[--text-muted] hover:text-[--accent] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                </svg>
              </a>
              <a href="#" aria-label="Visit our Facebook page" className="text-[--text-muted] hover:text-[--accent] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9.198 21.5h4v-8.01h2.598l.39-3.018h-2.988V8.404c0-.872.243-1.464 1.488-1.464h1.588V4.075c-.276-.037-1.22-.118-2.32-.118-2.39 0-4.025 1.47-4.025 4.142v2.215H6.03v3.018h2.168z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[--text-primary] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-[--text-muted] hover:text-[--accent] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-[--text-muted] hover:text-[--accent] transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-[--text-muted] hover:text-[--accent] transition-colors">FAQ</Link></li>
              <li><a href="#newsletter-email" onClick={handleNewsletterClick} className="text-[--text-muted] hover:text-[--accent] transition-colors">Newsletter</a></li>
              <li><Link to="/seller-onboarding" className="text-[--text-muted] hover:text-[--accent] transition-colors">Seller Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[--text-primary] mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-[--text-muted] hover:text-[--accent] transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-[--text-muted] hover:text-[--accent] transition-colors">Terms of Service</Link></li>
              <li><Link to="/shipping-policy" className="text-[--text-muted] hover:text-[--accent] transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns-policy" className="text-[--text-muted] hover:text-[--accent] transition-colors">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-[--text-primary] mb-4">Join Our Coven</h4>
            <p className="text-[--text-muted]">Subscribe to our newsletter to receive exclusive updates, magical offers, and early access to new arrivals.</p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[--border-color] text-center text-[--text-muted]">
          <p>&copy; {new Date().getFullYear()} House of Spells. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};