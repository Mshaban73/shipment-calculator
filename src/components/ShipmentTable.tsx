import React, { useState } from 'react';
import { ShipmentItem, CalculatedShipmentItem } from '../types.ts';

interface ShipmentTableProps {
  items: CalculatedShipmentItem[];
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, field: keyof ShipmentItem, value: string | number) => void;
}

export const ShipmentTable: React.FC<ShipmentTableProps> = ({ items, onRemoveItem, onUpdateItem }) => {
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const formatCurrency = (amount: number, currency: 'EGP' | 'USD' = 'EGP') => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
    };

    const totalQuantity = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalItemProfit = items.reduce((sum, item) => sum + item.itemProfit, 0);
    
    return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-slate-200 pb-3">قائمة الأصناف وتكاليفها</h2>
      <div className="overflow-x-auto">
        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <p className="text-lg">لم تتم إضافة أي أصناف بعد.</p>
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
                <th scope="col" className="px-4 py-3 text-start text-xs font-bold text-slate-500 uppercase tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {items.map((item) => {
                const isEditing = editingItemId === item.id;
                return (
                  <tr key={item.id} className={isEditing ? "bg-indigo-50" : "hover:bg-slate-50 transition-colors"}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-800 font-semibold">
                      {isEditing ? (
                        <input type="text" value={item.name} onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)} className="w-full p-1.5 border border-slate-300 rounded-md shadow-sm" />
                      ) : ( item.name )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">
                      {isEditing ? (
                        <input type="number" value={item.quantity} onChange={(e) => onUpdateItem(item.id, 'quantity', e.target.value)} className="w-24 p-1.5 border border-slate-300 rounded-md shadow-sm" />
                      ) : ( item.quantity )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {isEditing ? (
                         <input type="number" value={item.priceUSD} onChange={(e) => onUpdateItem(item.id, 'priceUSD', e.target.value)} className="w-24 p-1.5 border border-slate-300 rounded-md shadow-sm" />
                      ) : ( formatCurrency(item.priceUSD, 'USD') )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600 font-bold">{formatCurrency(item.unitCostAfterExpenses)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600 font-bold">{formatCurrency(item.itemUnitSalePrice)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600 w-40">
                      <div className="relative">
                        <input type="number" value={item.profitMargin} onChange={(e) => onUpdateItem(item.id, 'profitMargin', e.target.value)} className="w-full p-1.5 border border-slate-300 rounded-md shadow-sm text-right pr-2 pl-8" />
                        <span className="absolute end-2.5 inset-y-0 flex items-center text-slate-400 text-sm">%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-green-700 font-semibold">{formatCurrency(item.itemProfit)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                           <button onClick={() => setEditingItemId(null)} title="حفظ التعديلات" className="text-green-600 hover:text-green-800 transition">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                           </button>
                        ) : (
                           <button onClick={() => setEditingItemId(item.id)} title="تعديل الصنف" className="text-blue-600 hover:text-blue-800 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                           </button>
                        )}
                        <button onClick={() => onRemoveItem(item.id)} title="إزالة الصنف" className="text-red-600 hover:text-red-900 transition">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className="bg-slate-100 border-t-2 border-slate-300">
                <tr>
                    <td className="px-4 py-3 font-bold text-slate-800 text-sm">الإجمالي</td>
                    <td className="px-4 py-3 font-bold text-slate-800 text-sm">{totalQuantity}</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 font-bold text-green-800 text-sm">{formatCurrency(totalItemProfit)}</td>
                    <td className="px-4 py-3"></td>
                </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};
