import React from 'react';
import { Shipment, CalculatedShipmentItem } from '../types.ts';

interface PrintableSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  calculations: {
    itemsWithCalculations: CalculatedShipmentItem[];
  };
}

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({ isOpen, onClose, shipment, calculations }) => {
  if (!isOpen || !shipment) return null;

  const handlePrint = () => {
    // We need to temporarily add the printable content to the body for it to be the only thing visible
    const printableArea = document.getElementById('printable-area');
    if (!printableArea) return;

    const printableContent = printableArea.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printableContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // We have to re-initialize the React app after printing
    window.location.reload();
  };
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: 'EGP' | 'USD' = 'EGP') => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };
  
  return (
    <>
      {/* This is the Modal container that shows on screen */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 transition-opacity duration-300"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all"
        >
          {/* Header with actions */}
          <div className="p-4 px-6 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-700">معاينة طباعة الملخص</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint} 
                className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span>طباعة</span>
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="p-6 md:p-8 overflow-y-auto">
             {/* This is the actual content that WILL BE PRINTED */}
             <div id="printable-area" className="bg-white p-6 md:p-8 rounded-lg">
                <div className="text-center mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">ملخص شحنة: {shipment.name}</h1>
                    <p className="text-slate-500 mt-2">تاريخ الإنشاء: {formatDate(shipment.createdAt)}</p>
                    <p className="text-sm text-slate-400 mt-1">شركة المتحدة جروب AHK</p>
                </div>
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-3 text-start text-sm font-bold text-slate-600 uppercase">اسم الصنف</th>
                            <th className="px-4 py-3 text-start text-sm font-bold text-slate-600 uppercase">الكمية</th>
                            <th className="px-4 py-3 text-start text-sm font-bold text-slate-600 uppercase">شراء الوحدة (USD)</th>
                            <th className="px-4 py-3 text-start text-sm font-bold text-slate-600 uppercase">تكلفة الوحدة (EGP)</th>
                            <th className="px-4 py-3 text-start text-sm font-bold text-slate-600 uppercase">بيع الوحدة (EGP)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                    {calculations.itemsWithCalculations.map(item => (
                        <tr key={item.id}>
                            <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                            <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                            <td className="px-4 py-3 text-slate-600">{formatCurrency(item.priceUSD, 'USD')}</td>
                            <td className="px-4 py-3 font-bold text-blue-600">{formatCurrency(item.unitCostAfterExpenses)}</td>
                            <td className="px-4 py-3 font-bold text-green-600">{formatCurrency(item.itemUnitSalePrice)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* This is the new simplified style for printing */}
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            
            @page {
              size: A4;
              margin: 20mm; /* Standard margins */
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #e2e8f0; /* slate-200 */
              padding: 8px;
              text-align: right;
              font-size: 10pt;
            }
            th {
              background-color: #f1f5f9 !important; /* slate-100 */
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h1 {
              font-size: 18pt !important;
            }
            p {
              font-size: 10pt !important;
            }
          }
        `}
      </style>
    </>
  );
};
