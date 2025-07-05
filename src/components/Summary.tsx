import React from 'react';

interface SummaryProps {
    totalPurchaseUSD: number;
    totalPurchaseEGP: number;
    customsAndExpenses: number;
    customsPercentage: number;
    totalCostEGP: number;
    totalProfit: number;
    totalSalePrice: number;
}

const SummaryRow: React.FC<{ label: string; value: string; className?: string; isBold?: boolean }> = ({ label, value, className, isBold }) => (
    <div className={`flex justify-between items-center py-3 px-4 rounded-lg ${className}`}>
        <dt className={`text-sm md:text-base ${isBold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{label}</dt>
        <dd className={`text-sm md:text-base font-semibold ${isBold ? 'font-bold text-slate-900' : 'text-slate-800'}`}>{value}</dd>
    </div>
);

export const Summary: React.FC<SummaryProps> = (props) => {
    const {
        totalPurchaseUSD,
        totalPurchaseEGP,
        customsAndExpenses,
        customsPercentage,
        totalCostEGP,
        totalProfit,
        totalSalePrice,
    } = props;
    
    const formatCurrency = (amount: number, currency: 'EGP' | 'USD' = 'EGP') => {
        return new Intl.NumberFormat('ar-EG', { style: 'currency', currency, minimumFractionDigits: 2 }).format(amount);
    };

    const formatPercentage = (value: number) => {
        return new Intl.NumberFormat('ar-EG', { style: 'percent', minimumFractionDigits: 2 }).format(value);
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-700 mb-6 border-b-2 border-slate-200 pb-3">ملخص تكاليف الشحنة</h2>
            <dl className="space-y-2">
                <SummaryRow label="إجمالي الشراء (بالدولار)" value={formatCurrency(totalPurchaseUSD, 'USD')} className="bg-slate-50" />
                <SummaryRow label="إجمالي الشراء (بالجنيه)" value={formatCurrency(totalPurchaseEGP)} className="bg-slate-50" />
                <SummaryRow label="إجمالي الجمارك والمصروفات" value={formatCurrency(customsAndExpenses)} className="bg-slate-50" />
                <SummaryRow label="نسبة المصروفات من قيمة الشراء" value={formatPercentage(customsPercentage)} className="bg-slate-50" />
                <div className="my-3 border-t border-slate-200"></div>
                <SummaryRow label="إجمالي التكلفة النهائية" value={formatCurrency(totalCostEGP)} className="bg-blue-100 text-blue-900" isBold />
                <SummaryRow label="إجمالي الأرباح المتوقعة" value={formatCurrency(totalProfit)} className="bg-green-100 text-green-900" isBold />
                <SummaryRow label="إجمالي مبلغ البيع المتوقع" value={formatCurrency(totalSalePrice)} className="bg-indigo-100 text-indigo-900" isBold />
            </dl>
        </div>
    );
};