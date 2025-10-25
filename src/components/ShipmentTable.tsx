import React from 'react';
import { ShipmentItem, CalculatedShipmentItem } from '../types.ts';

interface ShipmentTableProps {
  items: CalculatedShipmentItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof ShipmentItem, value: string | number) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ items, onRemoveItem, onUpdateItem }) => {
    const formatCurrency = (amount: number, currency: 'EGP' | 'USD' = 'EGP') => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };

    return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-slate-200 pb-3">قائمة الأصناف وتكاليفها</h2>
      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">لم تتم إضافة أي أصناف بعد.</p>
            <p>استخدم النموذج لإضافة الصنف الأول في شحنتك.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">الصنف</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">الكمية</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">شراء الوحدة (USD)</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">تكلفة الوحدة (EGP)</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">بيع الوحدة (EGP)</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">ربح (%)</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">مبلغ الربح</th>
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">إجراء</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">{formatCurrency(item.priceUSD, 'USD')}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">{formatCurrency(item.unitCostAfterExpenses)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-bold">{formatCurrency(item.itemUnitSalePrice)}</td>
                  
                  {/* ### بداية التعديل على خلية النسبة ### */}
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 w-40">
                    <div className="relative">
                      <input
                        type="number"
                        value={item.profitMargin}
                        onChange={(e) => onUpdateItem(item.id, 'profitMargin', e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition text-right pr-2 pl-8"
                      />
                      <span className="absolute end-2.5 inset-y-0 flex items-center text-slate-400 text-sm">%</span>
                    </div>
                  </td>
                  {/* ### نهاية التعديل على خلية النسبة ### */}

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">{formatCurrency(item.itemProfit)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onRemoveItem(item.id)} title="إزالة الصنف" className="text-red-600 hover:text-red-900 transition">
                      <svg xmlns="http://www.w.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
