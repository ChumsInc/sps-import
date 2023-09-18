import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {SPSValueMap} from "sps-integration-types";


export const selectCustomerId = (state:RootState) => state.mapping.customerId;
export const selectCustomerLookup = (state:RootState) => state.mapping.customerLookup.customer;
export const selectCustomerLookupMap = (state:RootState) => state.mapping.customerLookup.map;
export const selectCustomerLookupChanged = (state:RootState) => state.mapping.customerLookup.changed;
export const selectCustomerLookupLoading = (state:RootState) => state.mapping.customerLookup.loading;
export const selectCustomerOptions = (state:RootState) => state.mapping.customerLookup.options;
export const selectMaps = (state:RootState) => state.mapping.maps;
export const selectMappingData = (state:RootState) => state.mapping.mappingData;
export const selectCurrentMappingTool = (state:RootState) => state.mapping.selectedMappingTool;
export const selectMapForField = (state:RootState) => state.mapping.mapForField;
export const selectMapForValue = (state:RootState) => state.mapping.mapForValue;
// export const selectCurrentMap = (state:RootState) => state.mapping.selectedMap;
export const selectDefaultCSVField = (state:RootState) => state.mapping.defaultCSVField;

export const selectCurrentMap = createSelector(
    [selectMaps, selectMapForField, selectMapForValue],
    (maps, mapForField, mapForValue):SPSValueMap|null => {
        let map: SPSValueMap|null = null;
        switch (mapForField) {
            case 'CancelDate':
                [map] = maps.filter(m => m.MapField === 'CancelDate');
                return map ?? null;
            case 'ShipExpireDate':
                [map] = maps.filter(m => m.MapField === 'ShipExpireDate');
                return map ?? null;
            case 'ShipVia':
                [map] = maps.filter(m => m.MapField === 'ShipVia')
                    .filter(m => m.MappedValue === mapForValue);
                return map ?? null;
            case 'ShipToCode':
                [map] = maps.filter(m => m.MapField === 'ShipToCode')
                    .filter(m => m.MappedValue === mapForValue);
                return map ?? null;
            case 'ItemCode':
                [map] = maps.filter(m => m.MapField === 'ItemCode')
                    .filter(m => m.MappedValue === mapForValue);
                return map ?? null;
            default:
                return null;
        }
})
