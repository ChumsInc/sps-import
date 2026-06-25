import type {SPSOrderMapField, SPSCustomerKey, SPSCustomerMapField, SPSOrderLine} from "chums-types/edi";
import type {ReactNode} from "react";


export interface CustomerSearchResult {
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string;
}

export interface ExistingPurchaseOrder {
    SalesOrderNo: string;
    CustomerPONo: string;
    OrderDate: string;
    OrderStatus: string;
}

export interface ExistingPurchaseOrderResponse {
    SalesOrder: ExistingPurchaseOrder | null;
}

export interface SPSCustomerLookup extends SPSCustomerKey {
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string;
}

export interface CustomerLookupResponse {
    result: SPSCustomerLookup[];
}

export interface CustomerMap {
    [key: string]: string;
}

export type CustomerMapType = 'ShipToCode' | 'ItemCode' | 'other';

export interface CustomerMapField extends SPSCustomerMapField {
    checked: boolean;
}

export interface CurrentMappingArgs {
    line?: SPSOrderLine;
    customerValue?: string;
    mapField: SPSOrderMapField | 'Customer' | 'Import';
    mapToValue?: string;
}

export type MapFieldNames = {
    [key in SPSOrderMapField]: string;
}

export interface SalesOrderImportResponse {
    SalesOrderNo: string;
    success?: boolean;
    response?: object;
    error?: string;
    exception?: string;
}

export interface Tab {
    id: string,
    title: string|ReactNode,

    /** Bootstrap icon className */
    icon?: string,

    canClose?: boolean,
    disabled?: boolean,
}
