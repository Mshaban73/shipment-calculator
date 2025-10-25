import React from 'react';

interface HeaderProps {
  view: 'list' | 'calculator';
  onSave?: () => void;
  onGoBack?: () => void;
  onOpenPrintView?: () => void;
  className?: string; // Prop to accept className
}

export const Header: React.FC<HeaderProps> = ({ view, onSave, onGoBack, onOpenPrintView, className }) => (
  // Apply the passed className here
  <header className={`bg-white shadow-md sticky top-0 z-40 ${className}`}>
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className='text-center sm:text-start'>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800">
          حاسبة تكلفة الشحنات
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base hidden sm:block">أداة شاملة لإدارة تكاليف الاستيراد والأرباح</p>
      </div>
      <div className="flex items-center gap-2">
        {view === 'calculator' && (
          <>
             <button
              onClick={onGoBack}
              title="العودة إلى قائمة الشحنات"
              className="flex items-center gap-2 bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-lg hover:bg-slate-300 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span className="hidden md:inline">عودة</span>
            </button>
            <button
              onClick={onOpenPrintView}
              title="طباعة ملخص الشحنة"
              className="flex items-center gap-2 bg-slate-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7V9h6v3z" clipRule="evenodd" />
              </svg>
              <span className="hidden md:inline">طباعة</span>
            </button>
            <button
              onClick={onSave}
              title="حفظ الشحنة الحالية"
              className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V4zm3 0a1 1 0 00-1 1v1a1 1 0 001 1h4a1 1 0 001-1V5a1 1 0 00-1-1H8z" />
              </svg>
              <span className="hidden md:inline">حفظ</span>
            </button>
          </>
        )}
      </div>
    </div>
  </header>
);
