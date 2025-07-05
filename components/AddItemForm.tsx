import React, { useState } from 'react';
import { ShipmentItem } from '../types.ts';

interface AddItemFormProps {
  onAddItem: (item: Omit<ShipmentItem, 'id'>) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [priceUSD, setPriceUSD] = useState<number | ''>('');
  const [profitMargin, setProfitMargin] = useState<number | ''>(15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && Number(quantity) > 0 && Number(priceUSD) > 0 && profitMargin !== '') {
      onAddItem({ 
        name, 
        quantity: Number(quantity), 
        priceUSD: Number(priceUSD), 
        profitMargin: Number(profitMargin) 
      });
      setName('');
      setQuantity('');
      setPriceUSD('');
      setProfitMargin(15);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-slate-200 pb-3">إضافة صنف جديد</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-slate-600 mb-1">اسم الصنف</label>
          <input
            type="text"
            id="itemName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="مثال: شاشة كمبيوتر"
            required
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-600 mb-1">الكمية المشتراة</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="مثال: 100"
            required
          />
        </div>
        <div>
          <label htmlFor="priceUSD" className="block text-sm font-medium text-slate-600 mb-1">سعر شراء الوحدة (بالدولار)</label>
          <input
            type="number"
            id="priceUSD"
            value={priceUSD}
            onChange={(e) => setPriceUSD(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="مثال: 250"
            required
          />
        </div>
         <div>
          <label htmlFor="profitMargin" className="block text-sm font-medium text-slate-600 mb-1">هامش الربح (%)</label>
          <input
            type="number"
            id="profitMargin"
            value={profitMargin}
            onChange={(e) => setProfitMargin(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            placeholder="15"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold p-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>إضافة الصنف</span>
        </button>
      </form>
    </div>
  );
};