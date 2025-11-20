import React, { useState } from 'react';

export const NewsletterSignup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            setMessage('Please enter a valid email address.');
            return;
        }

        // Simulate API call
        setMessage(`Thank you for subscribing! A confirmation owl has been dispatched to ${email}.`);
        setEmail('');

        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div className="bg-[--bg-secondary] mt-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold font-cinzel text-[--accent]">Subscribe to Our Newsletter</h2>
                    <p className="mt-2 text-lg text-[--text-muted]">
                        Receive the latest news, exclusive offers, and magical insights directly to your inbox.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required
                            className="flex-grow w-full bg-[--bg-primary] border-2 border-[--border-color] rounded-full py-3 px-6 text-base text-[--text-primary] focus:outline-none focus:ring-2 focus:ring-[--accent] focus:border-transparent"
                        />
                        <button type="submit" className="px-8 py-3 bg-[--accent] text-[--bg-primary] font-bold text-lg rounded-full hover:bg-[--accent-hover] transition duration-300 transform hover:scale-105 shadow-lg shadow-[--accent]/20">
                            Subscribe
                        </button>
                    </form>
                    {message && (
                        <p className="mt-4 text-sm text-green-400">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
};
