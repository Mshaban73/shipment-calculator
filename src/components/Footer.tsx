import React from 'react';

interface FooterProps {
  className?: string; // Prop to accept className
}

export const Footer: React.FC<FooterProps> = ({ className }) => (
  // Apply the passed className here
  <footer className={`bg-white mt-12 ${className}`}>
    <div className="container mx-auto py-4 px-4 text-center text-slate-500">
      <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة شركة المتحدة جروب AHK</p>
    </div>
  </footer>
);
