import {SPSCustomerMap, SPSValueMap} from "sps-integration-types";
import {createReducer} from "@reduxjs/toolkit";
import {customerSorter} from "./customer-utils";
import {SortProps} from "chums-types";
import {
    loadCustomerMapping,
    loadCustomers, removeCustomerItemMapping,
    setCurrentCustomer, setCustomerMappingFilter,
    setCustomerMapType,
    setCustomerPage,
    setCustomerRowsPerPage,
    setCustomerSort,
    setPage,
    setRowsPerPage,
    setSort
} from "./customer-actions";
import {CustomerMapType} from "../../appTypes";
import {parseFile} from "../csv-import/csv-import-actions";
import {valueMapSorter} from "../mapping/utils";

export interface CustomersState {
    list: SPSCustomerMap[];
    current: {
        customer: SPSCustomerMap | null;
        mapping: SPSValueMap[];
        loading: boolean;
        page: number;
        rowsPerPage: number;
        sort: SortProps<SPSValueMap>;
        mapType: CustomerMapType;
        mappingFilter: string;
    }
    loading: boolean;
    sort: SortProps<SPSCustomerMap>;
    page: number;
    rowsPerPage: number;
}

const defaultSort: SortProps<SPSCustomerMap> = {field: 'id', ascending: true};
const defaultMappingSort: SortProps<SPSValueMap> = {field: 'id', ascending: true};

const initialState: CustomersState = {
    list: [],
    current: {
        customer: null,
        mapping: [],
        loading: false,
        page: 0,
        rowsPerPage: 10,
        sort: defaultMappingSort,
        mapType: 'other',
        mappingFilter: '',
    },
    loading: false,
    sort: {field: 'CustomerName', ascending: true},
    page: 0,
    rowsPerPage: 10,
};


const customersReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(setSort, (state, action) => {
            state.sort = action.payload;
            state.page = 0;
        })
        .addCase(setPage, (state, action) => {
            state.page = action.payload;
        })
        .addCase(setRowsPerPage, (state, action) => {
            state.page = Math.floor((state.page * state.rowsPerPage) / action.payload);
            state.rowsPerPage = action.payload;
        })
        .addCase(loadCustomers.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCustomers.fulfilled, (state, action) => {
            state.loading = false;
            state.list = (action.payload ?? []).sort(customerSorter(defaultSort));
            if (state.page * state.rowsPerPage > state.list.length) {
                state.page = 0;
            }
        })
        .addCase(loadCustomers.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCurrentCustomer, (state, action) => {
            state.current.customer = action.payload;
            state.current.mapping = [];
            state.current.page = 0;
        })
        .addCase(setCustomerSort, (state, action) => {
            state.current.sort = action.payload;
            state.current.page = 0;
        })
        .addCase(setCustomerPage, (state, action) => {
            state.current.page = action.payload;
        })
        .addCase(setCustomerRowsPerPage, (state, action) => {
            state.current.page = 0;
            state.current.rowsPerPage = action.payload;
        })
        .addCase(loadCustomerMapping.pending, (state) => {
            state.current.loading = true;
        })
        .addCase(loadCustomerMapping.fulfilled, (state, action) => {
            state.current.mapping = action.payload;
            state.current.loading = false;
            state.current.page = 0;
        })
        .addCase(loadCustomerMapping.rejected, (state) => {
            state.current.loading = false;
        })
        .addCase(setCustomerMapType, (state, action) => {
            state.current.mapType = action.payload;
            state.current.page = 0;
        })
        .addCase(parseFile.fulfilled, (state, action) => {
            state.current.mapping = [...action.payload.mapping].sort(valueMapSorter)
        })
        .addCase(setCustomerMappingFilter, (state, action) => {
            state.current.mappingFilter = action.payload;
        })
        .addCase(removeCustomerItemMapping.pending, (state) => {
            state.current.loading = true;
        })
        .addCase(removeCustomerItemMapping.fulfilled, (state, action) => {
            state.current.loading = false;
            state.current.mapping = [...action.payload].sort(valueMapSorter)
            state.current.page = 0;
        })
        .addCase(removeCustomerItemMapping.rejected, (state) => {
            state.current.loading = false;
        })
    ;
});

export default customersReducer;
