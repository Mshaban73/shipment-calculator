
import React from 'react';

export const Footer: React.FC = () => (
  <footer className="bg-white mt-12">
    <div className="container mx-auto py-4 px-4 text-center text-slate-500">
      <p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة شركة المتحدة جروب AHK</p>
    </div>
  </footer>
);