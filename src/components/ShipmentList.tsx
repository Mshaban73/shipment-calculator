import React from 'react';
import { Shipment } from '../types.ts';

interface ShipmentListProps {
  shipments: Shipment[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const ShipmentList: React.FC<ShipmentListProps> = ({ shipments, onSelect, onDelete, onCreate }) => {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const handleDeletion = (e: React.MouseEvent, id: string) => {
      e.stopPropagation(); // Prevent card click event
      onDelete(id);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-800">قائمة الشحنات</h1>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>شحنة جديدة</span>
        </button>
      </div>

      {shipments.length === 0 ? (
        <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-2xl font-semibold text-slate-700">لا توجد شحنات محفوظة بعد</h2>
          <p className="mt-2">انقر على "شحنة جديدة" لبدء حساب تكلفتك الأولى.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => onSelect(shipment.id)}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer border-t-4 border-transparent hover:border-indigo-500"
            >
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{shipment.name}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  تاريخ الإنشاء: {formatDate(shipment.createdAt)}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  عدد الأصناف: {shipment.items.length}
                </p>
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={(e) => handleDeletion(e, shipment.id)}
                  title="حذف الشحنة"
                  className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                </button>
                 <button
                  onClick={() => onSelect(shipment.id)}
                  className="bg-indigo-50 text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  فتح
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};