import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {customerMappingSorter, customerSorter} from "./customer-utils";


export const selectCustomersLoading = (state:RootState) => state.customers.loading;
export const selectCustomerList  = (state:RootState) => state.customers.list;
export const selectSort = (state:RootState) => state.customers.sort;
export const selectPage = (state:RootState) => state.customers.page;
export const selectRowsPerPage = (state:RootState) => state.customers.rowsPerPage;
export const selectSortedList = createSelector(
    [selectCustomerList, selectSort],
    (list, sort) => {
        return [...list].sort(customerSorter(sort))
    }
);

export const selectCustomerLoading = (state:RootState) => state.customers.current.loading;
export const selectCurrentCustomer = (state:RootState) => state.customers.current.customer;
export const selectCustomerMapping = (state:RootState) => state.customers.current.mapping;
export const selectCustomerPage = (state:RootState) => state.customers.current.page;
export const selectCustomerRowsPerPage = (state:RootState) => state.customers.current.rowsPerPage;
export const selectCustomerMappingSort = (state:RootState) => state.customers.current.sort;
export const selectCustomerMapType = (state:RootState) => state.customers.current.mapType;
export const selectCustomerMappingList = createSelector(
    [selectCustomerMapping, selectCustomerMappingSort, selectCustomerMapType],
    (list, sort, mapType) => {
        return [...list]
            .filter(row => {
                switch (mapType) {
                    case 'ItemCode':
                    case 'ShipToCode':
                        return row.MapField === mapType;
                    default:
                        return row.MapField !== 'ItemCode' && row.MapField !== 'ShipToCode';
                }
            })
            .sort(customerMappingSorter(sort));
    }
)
