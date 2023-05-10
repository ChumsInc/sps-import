import {CustomerMap, SPSCustomerLookup} from "../../appTypes";
import {Editable} from "chums-types";
import {OrderMapField, SPSCustomerMapField, SPSCustomerOptions, SPSOrderLine, SPSValueMap} from "sps-integration-types";
import {createReducer} from "@reduxjs/toolkit";
import {parseFile} from "../csv-import/csv-import-actions";
import {
    closeSelectedMapping,
    saveCustomerLookupMapping,
    saveCustomerValueMapping,
    setCurrentMapping,
    setCustomerMap,
    setMappedCustomer,
    setShowCustomerMap,
    toggleZeroCommissions
} from "./mapping-actions";
import {parseLookupMap, valueMapSorter} from "./utils";

export interface MappingState {
    customerId: number;
    customerLookup: {
        customer: SPSCustomerLookup | null,
        map: CustomerMap;
        options: SPSCustomerOptions;
        changed?: boolean;
        loading?: boolean;
    };
    savingCustomerMap: boolean;
    mappingData: SPSOrderLine | null;
    maps: SPSValueMap[];
    selectedMappingTool: OrderMapField | 'Customer' | null;
    mapForField: OrderMapField | null;
    mapForValue: string;
    selectedMap: SPSValueMap & Editable | null;
    defaultCSVField: string;
    savingValueMap: boolean;
}

export const initialState: MappingState = {
    customerId: 0,
    customerLookup: {
        customer: null,
        map: {},
        options: {},
        changed: false,
        loading: false,
    },
    savingCustomerMap: false,
    mappingData: null,
    maps: [],
    selectedMappingTool: null,
    mapForField: null,
    mapForValue: '',
    selectedMap: null,
    defaultCSVField: '',
    savingValueMap: false,
}

const mappingReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(parseFile.pending, (state) => {
            state.customerLookup.loading = true;
        })
        .addCase(parseFile.fulfilled, (state, action) => {
            if (!action.payload || !action.payload.customer) {
                state.customerId = 0;
                state.customerLookup.customer = null;
                state.customerLookup.map = {};
                state.customerLookup.changed = false;
                state.customerLookup.loading = false;
                state.customerLookup.options = {};
                state.maps = [];
                state.selectedMappingTool = 'Customer';
                state.mapForField = null;
                state.mapForValue = '';
                state.defaultCSVField = '';
                state.selectedMap = null;
                const [mappingData] = (action.payload.csvLines ?? []).filter(line => line['Record Type'] === 'H');
                state.mappingData = mappingData ?? null;
            }
            if (action.payload && action.payload.customer) {
                const {
                    id,
                    Company,
                    ARDivisionNo,
                    CustomerNo,
                    CustomerName,
                    LookupFields,
                    options
                } = action.payload.customer;
                state.customerId = id;
                state.customerLookup.customer = {Company, ARDivisionNo, CustomerNo, CustomerName};
                state.customerLookup.map = {};
                state.customerLookup.changed = false;
                state.customerLookup.loading = false;
                LookupFields.forEach((lf: SPSCustomerMapField) => {
                    state.customerLookup.map[lf.field] = lf.value;
                })
                state.customerLookup.options = options ?? {};
                state.maps = action.payload.mapping;
                state.selectedMappingTool = null;
                state.mapForField = null;
                if (!action.payload.SalesOrder || !action.payload.SalesOrder.ARDivisionNo) {
                    state.selectedMappingTool = 'Customer';
                    const [mappingData] = (action.payload.csvLines ?? []).filter(line => line['Record Type'] === 'H');
                    state.mappingData = mappingData;
                }
            }
        })
        .addCase(parseFile.rejected, (state) => {
            state.customerLookup.loading = false;
        })
        .addCase(toggleZeroCommissions, (state, action) => {
            state.customerLookup.options.zeroCommissions = action.payload ?? !state.customerLookup.options.zeroCommissions;
        })
        .addCase(setMappedCustomer, (state, action) => {
            state.customerLookup.customer = action.payload;
            state.customerLookup.changed = true;
        })
        .addCase(setCustomerMap, (state, action) => {
            state.customerLookup.changed = true;
            if (action.payload.checked) {
                state.customerLookup.map[action.payload.field] = action.payload.value;
            } else {
                delete state.customerLookup.map[action.payload.field];
            }
        })
        .addCase(saveCustomerLookupMapping.pending, (state) => {
            state.customerLookup.loading = true;
        })
        .addCase(saveCustomerLookupMapping.fulfilled, (state, action) => {
            state.customerLookup.loading = false;
            if (action.payload) {
                const [lookup] = action.payload.filter(c => c.ARDivisionNo === action.meta.arg.ARDivisionNo
                    && c.CustomerNo === action.meta.arg.CustomerNo);
                if (lookup) {
                    const {LookupFields, options} = lookup;
                    state.customerLookup.customer = lookup;
                    state.customerLookup.map = parseLookupMap(LookupFields);
                    state.customerLookup.options = options;
                    state.customerId = lookup.id;
                }
            }

        })
        .addCase(saveCustomerLookupMapping.rejected, (state) => {
            state.customerLookup.loading = false;
        })
        .addCase(setCurrentMapping, (state, action) => {
            state.mappingData = action.payload.line;
            state.selectedMappingTool = action.payload.mapField;
            state.mapForField = action.payload.mapField === 'Customer' ? null : action.payload.mapField;
            state.mapForValue = action.payload.mapToValue ?? '';
        })
        .addCase(setShowCustomerMap, (state, action) => {
            state.mappingData = action.payload;
            state.selectedMappingTool = 'Customer';
            state.mapForField = null;
            state.mapForValue = '';
        })
        .addCase(saveCustomerValueMapping.pending, (state) => {
            state.savingValueMap = true;
        })
        .addCase(saveCustomerValueMapping.fulfilled, (state, action) => {
            state.savingValueMap = false;
            if (action.payload) {
                state.maps = action.payload.sort(valueMapSorter);
            }
        })
        .addCase(saveCustomerValueMapping.rejected, (state) => {
            state.savingValueMap = false;
        })
        .addCase(closeSelectedMapping, (state) => {
            state.selectedMappingTool = null;
            state.mapForField = null;
            state.mapForValue = '';
        });
})

export default mappingReducer;
