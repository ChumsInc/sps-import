import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "chums-types";
import {SPSCustomerMap, SPSValueMap} from "sps-integration-types";
import {fetchCustomerMapping, fetchCustomers} from "../../api/customers-api";
import {RootState} from "../../app/configureStore";
import {selectCurrentCustomer, selectCustomerLoading, selectCustomersLoading} from "./customer-selectors";
import {CustomerMapType} from "../../appTypes";
import {deleteCustomerItemMapping} from "@/api/mapping-api";

export const setSort = createAction<SortProps<SPSCustomerMap>>('customers/setSort');
export const setPage = createAction<number>('customers/setPage');
export const setRowsPerPage = createAction<number>('customers/setRowsPerPage');

export const loadCustomers = createAsyncThunk<SPSCustomerMap[]>(
    'customers/load',
    async () => {
        return await fetchCustomers();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCustomersLoading(state);
        }
    }
)


export const setCurrentCustomer = createAction<SPSCustomerMap | null>('customers/current/setCustomer');
export const setCustomerSort = createAction<SortProps<SPSValueMap>>('customers/current/setSort');
export const setCustomerPage = createAction<number>('customers/current/setPage');
export const setCustomerRowsPerPage = createAction<number>('customers/current/setRowsPerPage');
export const setCustomerMapType = createAction<CustomerMapType>('customers/current/setMapType');
export const setCustomerMappingFilter = createAction<string>('customers/current/setMappingFilter');

export const loadCustomerMapping = createAsyncThunk<SPSValueMap[], SPSCustomerMap>(
    'customers/loadItems',
    async (arg) => {
        return await fetchCustomerMapping(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCustomerLoading(state);
        }
    }
)

export const removeCustomerItemMapping = createAsyncThunk<SPSValueMap[], SPSValueMap, {state:RootState}>(
    'customers/removeItem',
    async (arg, {getState}) => {
        const state = getState();
        const customer = selectCurrentCustomer(state);
        return await deleteCustomerItemMapping(customer!, arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            const customer = selectCurrentCustomer(state);
            if (!arg.id || !customer) {
                return false;
            }
            return !selectCustomerLoading(state);
        }
    }
)
