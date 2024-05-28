import {ExistingPurchaseOrder} from "./appTypes";

export const isExistingPO = (salesOrder:ExistingPurchaseOrder|null):salesOrder is ExistingPurchaseOrder => {
    return (salesOrder as ExistingPurchaseOrder)?.CustomerPONo !== undefined;
}
