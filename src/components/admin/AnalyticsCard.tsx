import React from 'react';
import { Link } from 'react-router-dom';

interface AnalyticsCardProps {
    title: string;
    value: string;
    description: string;
    linkTo?: string;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, description, linkTo }) => {
    const content = (
        <div className="bg-[--bg-secondary] p-6 rounded-lg shadow-lg hover:bg-[--bg-tertiary] transition-colors border border-[--border-color] hover:border-[--accent]/50 hover:-translate-y-1 transform">
          <h3 className="text-lg font-semibold text-[--text-muted]">{title}</h3>
          <p className="text-4xl font-bold text-[--accent] mt-1">{value}</p>
          <p className="text-sm text-[--text-muted] mt-2">{description}</p>
        </div>
    );
    
    if (linkTo) {
        return <Link to={linkTo} className="block">{content}</Link>
    }

    return content;
};
