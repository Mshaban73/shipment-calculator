import React from 'react';
import { Shipment, CalculatedShipmentItem } from '../types.ts';

// واجهة جديدة لتمرير props الملخص بشكل أوضح
interface SummaryData {
    totalPurchaseUSD: number;
    totalPurchaseEGP: number;
    customsAndExpenses: number;
    customsPercentage: number;
    totalCostEGP: number;
    totalProfit: number;
    totalSalePrice: number;
}

interface PrintableSummaryProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment | null;
  calculations: {
    itemsWithCalculations: CalculatedShipmentItem[];
  } & SummaryData; // دمج الواجهة الجديدة هنا
}

// مكون صغير لعرض صف في الملخص المطبوع لتنظيم الكود
const PrintSummaryRow: React.FC<{ label: string; value: string; isBold?: boolean; className?: string }> = ({ label, value, isBold, className }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', borderRadius: '4px' }} className={className}>
        <span style={{ fontWeight: isBold ? 'bold' : 'normal' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{value}</span>
    </div>
);


export const PrintableSummary: React.FC<PrintableSummaryProps> = ({ isOpen, onClose, shipment, calculations }) => {
  if (!isOpen || !shipment) return null;

  const handlePrint = () => {
    window.print();
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

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'percent', minimumFractionDigits: 2 }).format(value);
  }
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex justify-center items-center p-4 print:hidden transition-opacity duration-300"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
      >
        <div 
          className="bg-slate-50 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col transform transition-all"
        >
          <div className="p-4 px-6 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-700">معاينة طباعة الملخص</h2>
            <div className="flex items-center gap-3">
              <button onClick={handlePrint} className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700">
                <span>طباعة</span>
              </button>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          <div id="printable-area-container" className="p-6 md:p-8 overflow-y-auto">
             <div id="printable-area" className="bg-white p-6 md:p-8 rounded-lg">
                <div className="text-center mb-8 border-b border-slate-200 pb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">ملخص شحنة: {shipment.name}</h1>
                    <p className="text-slate-500 mt-2">تاريخ الإنشاء: {formatDate(shipment.createdAt)}</p>
                    <p className="text-sm text-slate-400 mt-1">شركة المتحدة جروب AHK</p>
                </div>

                <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '16px' }}>قائمة الأصناف</h2>
                <table className="min-w-full mb-10">
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
                
                <div>
                    <h2 style={{ fontSize: '14pt', fontWeight: 'bold', marginBottom: '16px', borderTop: '2px solid #e2e8f0', paddingTop: '24px' }}>
                        ملخص تكاليف الشحنة
                    </h2>
                    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                        <PrintSummaryRow label="إجمالي الشراء (بالدولار)" value={formatCurrency(calculations.totalPurchaseUSD, 'USD')} />
                        <PrintSummaryRow label="إجمالي الشراء (بالجنيه)" value={formatCurrency(calculations.totalPurchaseEGP)} />
                        <PrintSummaryRow label="إجمالي الجمارك والمصروفات" value={formatCurrency(calculations.customsAndExpenses)} />
                        <PrintSummaryRow label="نسبة المصروفات من قيمة الشراء" value={formatPercentage(calculations.customsPercentage)} />
                        <hr style={{ margin: '12px 0' }} />
                        <PrintSummaryRow label="إجمالي التكلفة النهائية" value={formatCurrency(calculations.totalCostEGP)} isBold={true} className="bg-blue-100" />
                        <PrintSummaryRow label="إجمالي الأرباح المتوقعة" value={formatCurrency(calculations.totalProfit)} isBold={true} className="bg-green-100" />
                        <PrintSummaryRow label="إجمالي مبلغ البيع المتوقع" value={formatCurrency(calculations.totalSalePrice)} isBold={true} className="bg-indigo-100" />
                    </div>
                </div>

            </div>
          </div>
        </div>
      </div>
      
      <style>
        {`
          @media print {
            .print\\:hidden { display: none !important; }
            body > *:not(#printable-area-container) { display: none !important; }
            #printable-area-container, #printable-area {
                display: block !important;
                visibility: visible !important;
            }
            #printable-area-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
            }
            .bg-blue-100 { background-color: #DBEAFE !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .bg-green-100 { background-color: #D1FAE5 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .bg-indigo-100 { background-color: #E0E7FF !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @page {
              size: A4;
              margin: 20mm;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 8px;
              text-align: right;
              font-size: 10pt;
            }
            th {
              background-color: #f1f5f9 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            h1, h2 {
              color: black !important;
            }
          }
        `}
      </style>
    </>
  );
};
