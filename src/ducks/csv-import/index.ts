import {SPSOrderLine, SPSSalesOrder, SPSValueMap} from "sps-integration-types";
import {ExistingPurchaseOrder, SalesOrderImportResponse} from "../../appTypes";
import {createReducer} from "@reduxjs/toolkit";
import {csvLineSorter, mappingSorter} from "./utils";
import {importToSage, loadExistingPurchaseOrder, parseFile} from "./csv-import-actions";
import {saveCustomerLookupMapping, saveCustomerValueMapping} from "../mapping/mapping-actions";

export interface CSVImportState {
    filename: string;
    processing: boolean;
    salesOrder: SPSSalesOrder | null;
    validationRequired: boolean;
    mapping: SPSValueMap[];
    csvLines: SPSOrderLine[];
    existingPO: ExistingPurchaseOrder | null;
    existingPOLoading: boolean;
    importResult: SalesOrderImportResponse | null;
    importing: boolean;
}

const initialState: CSVImportState = {
    filename: '',
    processing: false,
    salesOrder: null,
    validationRequired: false,
    mapping: [],
    csvLines: [],
    existingPO: null,
    existingPOLoading: false,
    importResult: null,
    importing: false,
}

const csvImportReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(parseFile.pending, (state, action) => {
            if (action.meta.arg.name !== state.filename) {
                state.salesOrder = null;
                state.csvLines = [];
                state.mapping = [];
                state.existingPO = null;
                state.importResult = null;
            }
            state.filename = action.meta.arg.name;
            state.processing = true;
        })
        .addCase(parseFile.fulfilled, (state, action) => {
            state.processing = false;
            state.validationRequired = false;
            if (action.payload) {
                if (state.existingPO && state.salesOrder && (
                    state.salesOrder.ARDivisionNo !== action.payload.SalesOrder?.ARDivisionNo
                    || state.salesOrder.CustomerNo !== action.payload.SalesOrder?.CustomerNo
                )) {
                    state.existingPO = null;
                }
                state.salesOrder = action.payload.SalesOrder ?? null;
                state.mapping = (action.payload.mapping ?? []).sort(mappingSorter);
                state.csvLines = (action.payload.csvLines ?? []).sort(csvLineSorter);
            }
        })
        .addCase(parseFile.rejected, (state) => {
            state.processing = false;
        })
        .addCase(loadExistingPurchaseOrder.pending, (state) => {
            state.existingPOLoading = true;
        })
        .addCase(loadExistingPurchaseOrder.fulfilled, (state, action) => {
            state.existingPOLoading = false;
            state.existingPO = action.payload;
        })
        .addCase(loadExistingPurchaseOrder.rejected, (state) => {
            state.existingPOLoading = false;
        })
        .addCase(importToSage.pending, (state) => {
            state.importing = true;
        })
        .addCase(importToSage.fulfilled, (state, action) => {
            state.importResult = action.payload;
            state.importing = false;
        })
        .addCase(importToSage.rejected, (state) => {
            state.importing = false;
        })
        .addCase(saveCustomerLookupMapping.fulfilled, (state) => {
            state.validationRequired = true;
        })
        .addCase(saveCustomerValueMapping.fulfilled, (state) => {
            state.validationRequired = true;
        })

    //TODO: set validationRequired = true when saving any mapping
})


export default csvImportReducer;
