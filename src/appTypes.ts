import {EmptyObject} from "redux";
import {OrderMapField, SPSCustomerKey, SPSCustomerMapField, SPSOrderLine} from "sps-integration-types";

export interface OrderMap {
    field: OrderMapField | null;
    value: string | null;
}

export interface CustomerSearchResult {
    Company: string;
    ARDivisionNo: string;
    CustomerNo: string;
    CustomerName: string;
}

export interface CustomerSearchResponse {
    result: CustomerSearchResult[];
}

export interface ExistingPurchaseOrder {
    SalesOrderNo: string;
    CustomerPONo: string;
    OrderDate: string;
    OrderStatus: string;
}

export interface ExistingPurchaseOrderResponse {
    SalesOrder: ExistingPurchaseOrder | EmptyObject;
}

export interface SPSCustomerLookup extends SPSCustomerKey {
    Company: string;
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

export interface Loadable {
    loading?: boolean;
}

export type CustomerMapType = 'ShipToCode' | 'ItemCode' | 'other';

export interface CustomerMapField extends SPSCustomerMapField {
    checked: boolean;
}

export interface CurrentMappingArgs {
    line?: SPSOrderLine;
    mapField: OrderMapField | 'Customer' | 'Import';
    mapToValue?: string;
}

export type MapFieldNames = {
    [key in OrderMapField]: string;
}

export interface SalesOrderImportResponse {
    SalesOrderNo: string;
    success?: boolean;
    response?: object;
    error?: string;
    exception?: string;
}
