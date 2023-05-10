import {ExistingPurchaseOrder} from "./appTypes";
import {EmptyObject} from "redux";

export const isExistingPO = (salesOrder:ExistingPurchaseOrder|EmptyObject):salesOrder is ExistingPurchaseOrder => {
    return (salesOrder as ExistingPurchaseOrder).CustomerPONo !== undefined;
}
