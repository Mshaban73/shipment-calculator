import React from 'react';

interface GlobalInputsProps {
  shipmentName: string;
  onNameChange: (name: string) => void;
  exchangeRate: number;
  setExchangeRate: (value: number) => void;
  totalExpenses: number;
  onOpenExpensesModal: () => void;
}

export const GlobalInputs: React.FC<GlobalInputsProps> = ({ shipmentName, onNameChange, exchangeRate, setExchangeRate, totalExpenses, onOpenExpensesModal }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', minimumFractionDigits: 2 }).format(amount);
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-slate-200 pb-3">بيانات الشحنة</h2>
        <div className="space-y-4">
           <div>
            <label htmlFor="shipmentName" className="block text-sm font-medium text-slate-600 mb-1">
              اسم الشحنة
            </label>
            <input
                type="text"
                id="shipmentName"
                value={shipmentName}
                onChange={(e) => onNameChange(e.target.value)}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="مثال: شحنة أبريل 2024"
                required
            />
           </div>
          <div>
            <label htmlFor="exchangeRate" className="block text-sm font-medium text-slate-600 mb-1">
              سعر صرف الدولار (مقابل الجنيه)
            </label>
            <div className="relative">
              <input
                type="number"
                id="exchangeRate"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value) || 0)}
                className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pl-12"
                placeholder="مثال: 50"
              />
              <span className="absolute end-3 inset-y-0 flex items-center text-slate-500">EGP</span>
            </div>
          </div>
          <div>
            <label htmlFor="customsAndExpenses" className="block text-sm font-medium text-slate-600 mb-1">
              إجمالي تكلفة الجمارك والمصروفات
            </label>
            <div className="flex items-center gap-2">
                <div className="w-full p-3 border border-slate-200 rounded-lg bg-slate-100 text-slate-800 font-bold text-lg">
                    {formatCurrency(totalExpenses)}
                </div>
                <button 
                    onClick={onOpenExpensesModal}
                    className="bg-slate-200 text-slate-700 font-bold p-3 rounded-lg hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                >
                    تفاصيل
                </button>
            </div>
          </div>
        </div>
      </div>
    );
};