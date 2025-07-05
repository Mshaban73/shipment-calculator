export interface ShipmentItem {
  id: string;
  name: string;
  quantity: number;
  priceUSD: number;
  profitMargin: number;
}

export interface CalculatedShipmentItem extends ShipmentItem {
    itemPurchaseUSD: number;
    itemPurchaseEGP: number;
    itemCostAfterExpenses: number;
    itemTotalSalePrice: number;
    itemUnitSalePrice: number;
    unitPurchasePriceEGP: number;
    unitCostAfterExpenses: number;
    itemProfit: number;
}

export interface DetailedExpenses {
  customs: number;
  clearance: number;
  transport: number;
  bankFees: number;
  transferFees: number;
  other: number;
}

export interface Shipment {
  id: string;
  name: string;
  createdAt: string; // ISO date string
  items: ShipmentItem[];
  exchangeRate: number;
  detailedExpenses: DetailedExpenses;
}