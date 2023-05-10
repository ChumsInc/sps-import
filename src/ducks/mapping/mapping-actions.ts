import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SPSCustomerMap, SPSOrderLine, SPSValueMap} from "sps-integration-types";
import {CurrentMappingArgs, CustomerMapField, SPSCustomerLookup} from "../../appTypes";
import {postCustomerLookupMapping, postCustomerMapping} from "../../api/mapping-api";
import {RootState} from "../../app/configureStore";
import {selectCustomerLookup, selectCustomerLookupMap, selectCustomerOptions} from "./mapping-selectors";

export const toggleZeroCommissions = createAction<boolean | undefined>('mapping/toggleZeroCommissions');

export const setMappedCustomer = createAction<SPSCustomerLookup>('mapping/setMappedCustomer');
export const setCustomerMap = createAction<CustomerMapField>('mapping/setCustomerMap');

export const setShowCustomerMap = createAction<SPSOrderLine>('mapping/showCustomerMap');
export const setCurrentMapping = createAction<CurrentMappingArgs>('mapping/setCurrentMapping');

export const closeSelectedMapping = createAction('mapping/closeSelectedMap');

export const saveCustomerLookupMapping = createAsyncThunk<SPSCustomerMap[], SPSCustomerLookup>(
    'mapping/saveCustomerMapping',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerLookup(state);
        const map = selectCustomerLookupMap(state);
        const options = selectCustomerOptions(state);
        return await postCustomerLookupMapping(customer!, map, options);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCustomerLookup(state);
            const map = selectCustomerLookupMap(state);
            return !!customer && !!Object.keys(map).length;
        }
    }
)

export const saveCustomerValueMapping = createAsyncThunk<SPSValueMap[], SPSValueMap>(
    'mapping/saveCustomerValueMapping',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerLookup(state);
        return await postCustomerMapping(customer!, arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !!selectCustomerLookup(state) && !!arg.MapField && !!arg.CSVField;
        }
    }
)
