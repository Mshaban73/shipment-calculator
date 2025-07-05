import React, { useState, useEffect } from 'react';
import { DetailedExpenses } from '../types.ts';

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expenses: DetailedExpenses) => void;
  initialExpenses: DetailedExpenses;
}

const ExpenseInput: React.FC<{
  label: string;
  id: keyof DetailedExpenses;
  value: number;
  onChange: (field: keyof DetailedExpenses, value: number) => void;
}> = ({ label, id, value, onChange }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <div className="relative">
       <input
        type="number"
        id={id}
        value={value || ''}
        onChange={(e) => onChange(id, Number(e.target.value) || 0)}
        className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pl-14"
        placeholder="0"
      />
      <span className="absolute end-3 inset-y-0 flex items-center text-slate-500">EGP</span>
    </div>
  </div>
);

export const ExpensesModal: React.FC<ExpensesModalProps> = ({ isOpen, onClose, onSave, initialExpenses }) => {
  const [expenses, setExpenses] = useState<DetailedExpenses>(initialExpenses);

  useEffect(() => {
    if (isOpen) {
      setExpenses(initialExpenses);
    }
  }, [initialExpenses, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: keyof DetailedExpenses, value: number) => {
    setExpenses(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(expenses);
  };
  
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
        onClose();
    }
  };

  const total = Object.values(expenses).reduce((sum, val) => sum + (val || 0), 0);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
        onClick={e => e.stopPropagation()}
        style={{ animationName: 'scale-in', animationDuration: '0.2s', animationFillMode: 'forwards' }}
      >
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-700">تفاصيل المصروفات</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <ExpenseInput label="رسوم الجمارك" id="customs" value={expenses.customs} onChange={handleFieldChange} />
            <ExpenseInput label="مصروفات التخليص" id="clearance" value={expenses.clearance} onChange={handleFieldChange} />
            <ExpenseInput label="مصروفات النقل" id="transport" value={expenses.transport} onChange={handleFieldChange} />
            <ExpenseInput label="مصروفات بنكية" id="bankFees" value={expenses.bankFees} onChange={handleFieldChange} />
            <ExpenseInput label="مصروفات التحويل" id="transferFees" value={expenses.transferFees} onChange={handleFieldChange} />
            <ExpenseInput label="مصروفات أخرى" id="other" value={expenses.other} onChange={handleFieldChange} />
          </div>
        </div>
        <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex flex-wrap justify-between items-center gap-4">
            <div>
                 <span className="text-slate-600">الإجمالي:</span>
                 <span className="font-bold text-xl text-indigo-600 mr-2">
                    {new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(total)}
                </span>
            </div>
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              حفظ وإغلاق
            </button>
        </div>
      </div>
       <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};