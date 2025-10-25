import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Shipment, ShipmentItem, DetailedExpenses, CalculatedShipmentItem } from './types.ts';
import { GlobalInputs } from './components/GlobalInputs.tsx';
import { AddItemForm } from './components/AddItemForm.tsx';
import { ShipmentTable } from './components/ShipmentTable.tsx';
import { Summary } from './components/Summary.tsx';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { ExpensesModal } from './components/ExpensesModal.tsx';
import { ShipmentList } from './components/ShipmentList.tsx';
import { PrintableSummary } from './components/PrintableSummary.tsx';

const STORAGE_KEY = 'shipmentCalculator_allShipments';

const sampleShipment: Shipment = {
  id: 'sample_shipment_1',
  name: 'مثال شحنة عملية (اضغط هنا لفتحها)',
  createdAt: new Date('2024-05-20T12:00:00Z').toISOString(),
  items: [
    { id: 'item_1', name: 'صنف 1 (شاشة كمبيوتر)', quantity: 100, priceUSD: 20, profitMargin: 15 },
    { id: 'item_2', name: 'صنف 2 (لوحة مفاتيح)', quantity: 100, priceUSD: 25, profitMargin: 15 },
    { id: 'item_3', name: 'صنف 3 (فأرة لاسلكية)', quantity: 100, priceUSD: 30, profitMargin: 20 },
  ],
  exchangeRate: 50,
  detailedExpenses: {
    customs: 30000,
    clearance: 10000,
    transport: 7500,
    bankFees: 2000,
    transferFees: 2500,
    other: 500,
  }, // Total = 52,500 EGP
};


const App: React.FC = () => {
  const [allShipments, setAllShipments] = useState<Shipment[]>([]);
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [view, setView] = useState<'list' | 'calculator'>('list');
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [notification, setNotification] = useState<string>('');

  useEffect(() => {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        let shipmentsToLoad: Shipment[] = [];

        if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (Array.isArray(parsedData) && parsedData.length > 0) {
                shipmentsToLoad = parsedData;
            }
        }

        if (shipmentsToLoad.length === 0) {
            shipmentsToLoad = [sampleShipment];
        }

        shipmentsToLoad.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAllShipments(shipmentsToLoad);

    } catch (error) {
        console.error("Failed to load or parse shipments from localStorage", error);
        showNotification('خطأ في تحميل البيانات، سيتم عرض مثال عملي.');
        setAllShipments([sampleShipment].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateNew = () => {
    const newShipment: Shipment = {
      id: `shipment_${new Date().toISOString()}`,
      name: `شحنة جديدة - ${new Date().toLocaleDateString('ar-EG')}`,
      createdAt: new Date().toISOString(),
      items: [],
      exchangeRate: 50,
      detailedExpenses: { customs: 0, clearance: 0, transport: 0, bankFees: 0, transferFees: 0, other: 0 },
    };
    setActiveShipment(newShipment);
    setView('calculator');
  };

  const handleSelectShipment = (id: string) => {
    const shipmentToOpen = allShipments.find(s => s.id === id);
    if (shipmentToOpen) {
      setActiveShipment(shipmentToOpen);
      setView('calculator');
    }
  };

  const handleDeleteShipment = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الشحنة؟ لا يمكن التراجع عن هذا الإجراء.')) {
      const updatedShipments = allShipments.filter(s => s.id !== id);
      setAllShipments(updatedShipments);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShipments));
      showNotification('تم حذف الشحنة بنجاح.');
       if (updatedShipments.length === 0) {
          localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const handleGoBack = () => {
    setView('list');
    setActiveShipment(null);
  };

  const handleSaveAndClose = () => {
    if (!activeShipment) return;
    if (!activeShipment.name.trim()) {
      showNotification('يرجى إدخال اسم للشحنة قبل الحفظ.');
      return;
    }

    const existingIndex = allShipments.findIndex(s => s.id === activeShipment.id);
    let updatedShipments;

    if (existingIndex > -1) {
      updatedShipments = [...allShipments];
      updatedShipments[existingIndex] = activeShipment;
    } else {
      updatedShipments = [activeShipment, ...allShipments];
    }
    
    updatedShipments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setAllShipments(updatedShipments);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedShipments));
    showNotification('تم حفظ الشحنة بنجاح!');
    handleGoBack();
  };
  
  const updateActiveShipment = useCallback((updater: (prev: Shipment) => Shipment) => {
    setActiveShipment(prev => (prev ? updater(prev) : null));
  }, []);
  
  const handleUpdateName = (name: string) => updateActiveShipment(s => ({ ...s, name }));
  const handleUpdateExchangeRate = (rate: number) => updateActiveShipment(s => ({ ...s, exchangeRate: rate }));
  const handleUpdateDetailedExpenses = (expenses: DetailedExpenses) => updateActiveShipment(s => ({ ...s, detailedExpenses: expenses }));

  const handleAddItem = useCallback((item: Omit<ShipmentItem, 'id'>) => {
    updateActiveShipment(s => ({ ...s, items: [...s.items, { ...item, id: `item_${new Date().toISOString()}` }] }));
  }, [updateActiveShipment]);

  const handleRemoveItem = useCallback((id: string) => {
    updateActiveShipment(s => ({ ...s, items: s.items.filter(item => item.id !== id) }));
  }, [updateActiveShipment]);

  const handleUpdateItem = useCallback((id: string, field: keyof ShipmentItem, value: string | number) => {
    updateActiveShipment(s => ({
      ...s,
      items: s.items.map(item =>
        item.id === id ? { ...item, [field]: typeof value === 'string' ? value : Number(value) } : item
      ),
    }));
  }, [updateActiveShipment]);

  const calculations = useMemo(() => {
    if (!activeShipment) {
      return { totalPurchaseUSD: 0, totalPurchaseEGP: 0, customsAndExpenses: 0, customsPercentage: 0, totalCostEGP: 0, itemsWithCalculations: [] as CalculatedShipmentItem[], totalProfit: 0, totalSalePrice: 0 };
    }

    const { items, exchangeRate, detailedExpenses } = activeShipment;
    const customsAndExpenses = Object.values(detailedExpenses).reduce((sum, val) => sum + (val || 0), 0);
    const totalPurchaseUSD = items.reduce((sum, item) => sum + item.quantity * item.priceUSD, 0);
    const totalPurchaseEGP = totalPurchaseUSD * exchangeRate;
    const customsPercentage = totalPurchaseEGP > 0 ? customsAndExpenses / totalPurchaseEGP : 0;
    const totalCostEGP = totalPurchaseEGP + customsAndExpenses;

    const itemsWithCalculations: CalculatedShipmentItem[] = items.map(item => {
      const itemPurchaseUSD = item.quantity * item.priceUSD;
      const unitPurchasePriceEGP = item.priceUSD * exchangeRate;
      const itemPurchaseEGP = item.quantity * unitPurchasePriceEGP;
      const itemCostAfterExpenses = itemPurchaseEGP * (1 + customsPercentage);
      const unitCostAfterExpenses = item.quantity > 0 ? itemCostAfterExpenses / item.quantity : 0;
      const itemTotalSalePrice = itemCostAfterExpenses * (1 + item.profitMargin / 100);
      const itemUnitSalePrice = item.quantity > 0 ? itemTotalSalePrice / item.quantity : 0;
      const itemProfit = itemTotalSalePrice - itemCostAfterExpenses;

      return {
        ...item, itemPurchaseUSD, itemPurchaseEGP, itemCostAfterExpenses, itemTotalSalePrice,
        itemUnitSalePrice, itemProfit, unitPurchasePriceEGP, unitCostAfterExpenses,
      };
    });
    
    const totalProfit = itemsWithCalculations.reduce((sum, item) => sum + item.itemProfit, 0);
    const totalSalePrice = itemsWithCalculations.reduce((sum, item) => sum + item.itemTotalSalePrice, 0);

    return { totalPurchaseUSD, totalPurchaseEGP, customsAndExpenses, customsPercentage, totalCostEGP, itemsWithCalculations, totalProfit, totalSalePrice };
  }, [activeShipment]);

  if (view === 'list') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100">
        <Header view="list" />
        <main className="flex-grow">
          <ShipmentList
            shipments={allShipments}
            onCreate={handleCreateNew}
            onSelect={handleSelectShipment}
            onDelete={handleDeleteShipment}
          />
        </main>
        <Footer />
        {notification && (
            <div className="fixed top-24 right-5 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg z-[100] animate-fade-in-down">
                {notification}
            </div>
        )}
      </div>
    );
  }

  if (!activeShipment) return null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {notification && (
        <div className="fixed top-24 right-5 bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-lg z-[100] animate-fade-in-down">
          {notification}
        </div>
      )}
      <Header 
        view="calculator" 
        onSave={handleSaveAndClose} 
        onGoBack={handleGoBack}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
      />
      {/* ### بداية التعديل على التصميم ### */}
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="flex flex-col gap-8">
          
          {/* قسم إدخال البيانات (في الأعلى) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlobalInputs
              shipmentName={activeShipment.name}
              onNameChange={handleUpdateName}
              exchangeRate={activeShipment.exchangeRate}
              setExchangeRate={handleUpdateExchangeRate}
              totalExpenses={calculations.customsAndExpenses}
              onOpenExpensesModal={() => setIsExpensesModalOpen(true)}
            />
            <AddItemForm onAddItem={handleAddItem} />
          </div>

          {/* قسم عرض البيانات (في الأسفل) */}
          <div className="space-y-8">
            <ShipmentTable
              items={calculations.itemsWithCalculations}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
            />
            <Summary
                totalPurchaseUSD={calculations.totalPurchaseUSD}
                totalPurchaseEGP={calculations.totalPurchaseEGP}
                customsAndExpenses={calculations.customsAndExpenses}
                customsPercentage={calculations.customsPercentage}
                totalCostEGP={calculations.totalCostEGP}
                totalProfit={calculations.totalProfit}
                totalSalePrice={calculations.totalSalePrice}
            />
          </div>

        </div>
      </main>
      {/* ### نهاية التعديل على التصميم ### */}
      <Footer />
      <ExpensesModal 
        isOpen={isExpensesModalOpen}
        onClose={() => setIsExpensesModalOpen(false)}
        onSave={(newExpenses) => {
          handleUpdateDetailedExpenses(newExpenses);
          setIsExpensesModalOpen(false);
        }}
        initialExpenses={activeShipment.detailedExpenses}
      />
      <PrintableSummary
        isOpen={isPrintViewOpen}
        onClose={() => setIsPrintViewOpen(false)}
        shipment={activeShipment}
        calculations={calculations}
      />
    </div>
  );
};

export default App;
