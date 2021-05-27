import {combineReducers} from 'redux';

import {FETCH_POST_IMPORT, FETCH_UPLOAD_TEST, SET_CSV_FILE} from "../constants/csv-import";
import {FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {
    defaultValueMap,
    FETCH_CUSTOMER_LOOKUP,
    FETCH_CUSTOMER_LOOKUP_MAP,
    FETCH_CUSTOMER_LOOKUP_MAPPING,
    FETCH_CUSTOMER_MAPPING,
    MAP_ACCOUNT,
    MAP_DATES,
    MAP_FIELD_VALUES,
    SET_CUSTOMER_LOOKUP,
    UPDATE_CUSTOMER_MAPPING,
    SHOW_CUSTOMER_VALUE_MAPPING,
    SHOW_CUSTOMER_DATE_MAPPING,
    SHOW_CUSTOMER_LOOKUP_MAPPING,
    SHOW_VALUE_MAPPING,
    TOGGLE_CUSTOMER_LOOKUP_FIELD,
    defaultDateMap,
    SHOW_SALES_ORDER_VALUES,
    MAP_SO_VALUES,
    SHOW_CSV_VALUES,
    MAP_CSV_VALUES, TOGGLE_ZERO_COMMISSION,
} from "../constants/mapping";


const customerLookup = (state = {}, action) => {
    const {type, status, customer} = action;
    switch (type) {
    case SET_CUSTOMER_LOOKUP:
        return {...customer};
    case FETCH_CUSTOMER_LOOKUP:
        if (status === FETCH_SUCCESS) {
            const {Company, ARDivisionNo, CustomerNo, CustomerName} = customer;
            return {Company, ARDivisionNo, CustomerNo, CustomerName};
        }
        if (status === FETCH_INIT) {
            return {...state, loading: true}
        }
        return {...state, loading: false};

    case FETCH_CUSTOMER_LOOKUP_MAP:
        if (status === FETCH_SUCCESS) {
            const {id, Company, ARDivisionNo, CustomerNo, CustomerName} = customer;
            return {id, Company, ARDivisionNo, CustomerNo, CustomerName};
        }
        return state;
    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            const {id, Company, ARDivisionNo, CustomerNo, CustomerName} = customer;
            return {id, Company, ARDivisionNo, CustomerNo, CustomerName};
        }
        return state;
    default:
        return state;
    }
};

const customerLookupMapping = (state = {}, action) => {
    const {type, status, mapping, field, value, customer} = action;
    switch (type) {
    case FETCH_CUSTOMER_LOOKUP_MAP:
        if (status === FETCH_SUCCESS) {
            const {LookupFields} = customer;
            return [...LookupFields];
        }
        return {
            ...state,
            loading: status === FETCH_INIT,
        };
    // case SET_CUSTOMER_LOOKUP:
    //     return [...fields];
    case TOGGLE_CUSTOMER_LOOKUP_FIELD:
        if (typeof state[field] !== "undefined") {
            const newState = {...state, changed: true};
            delete newState[field];
            return newState;
        }
        return {
            ...state,
            [field]: value,
            changed: true,
        };
    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            const {LookupFields = []} = customer;
            const newState = {};
            LookupFields.forEach(({field, value}) => {
                newState[field] = value;
            });
            return newState;
        }
        return state;
    case TOGGLE_ZERO_COMMISSION:
    case SET_CUSTOMER_LOOKUP:
        return {...state, changed: true};
    default:
        return state;
    }
};

const customerOptions = (state = {}, action) => {
    const {type, status, customer} = action;
    switch (type) {
    case FETCH_UPLOAD_TEST:
        return customer.options || {};
    case TOGGLE_ZERO_COMMISSION:
        return {...state, zeroCommissions: !state.zeroCommissions};
    default:
        return state;
    }
}


const mappingData = (state = {}, action) => {
    const {type, line = {}} = action;
    switch (type) {
    case SHOW_CUSTOMER_DATE_MAPPING:
    case SHOW_CUSTOMER_LOOKUP_MAPPING:
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return {...line};
    default:
        return state;
    }
};

const maps = (state = [], action) => {
    const {type, status, mapping, map, mapForField, mapForValue = ''} = action;
    switch (type) {
    case SET_CSV_FILE:
        return [];
    case FETCH_UPLOAD_TEST:
    case FETCH_CUSTOMER_MAPPING:
        if (status === FETCH_SUCCESS) {
            return [...mapping];
        }
        return state;
    default:
        return state;
    }
};

const selectedMappingTool = (state = '', action) => {
    const {type, status, SalesOrder, mapForField} = action;
    switch (type) {
    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            return SalesOrder.ARDivisionNo === '' ? MAP_ACCOUNT : '';
        }
        return '';
    case SHOW_CUSTOMER_LOOKUP_MAPPING:
        return state === MAP_ACCOUNT ? '' : MAP_ACCOUNT;
    case SHOW_CUSTOMER_DATE_MAPPING:
        return !!mapForField ? MAP_DATES: '';
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return !!mapForField ? MAP_FIELD_VALUES : '';
    case SHOW_SALES_ORDER_VALUES:
        return state === MAP_SO_VALUES ? '' : MAP_SO_VALUES;
    case SHOW_CSV_VALUES:
        return state === MAP_CSV_VALUES ? '' : MAP_CSV_VALUES;
    case FETCH_POST_IMPORT:
        return '';
    default:
        return state;
    }
};

const mapForField = (state = '', action) => {
    const {type, mapForField = '', map} = action;
    switch (type) {
    case FETCH_UPLOAD_TEST:
        return '';
    case SHOW_CUSTOMER_DATE_MAPPING:
        return mapForField;
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return mapForField;
    case SHOW_CUSTOMER_LOOKUP_MAPPING:
        return '';
    default:
        return state;
    }
};

const mapForValue = (state = '', action) => {
    const {type, mapForValue = '', map, props} = action;
    switch (type) {
    case FETCH_UPLOAD_TEST:
        return '';
    case SHOW_CUSTOMER_DATE_MAPPING:
        return '';
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return mapForValue;
    case SHOW_CUSTOMER_LOOKUP_MAPPING:
        return '';
    default:
        return state;
    }
};

const selectedMap = (state = {}, action) => {
    const {type, selectedMap = {}, props} = action;
    switch (type) {
    case SHOW_CUSTOMER_DATE_MAPPING:
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return {...selectedMap};
    case UPDATE_CUSTOMER_MAPPING:
        return {...state, ...props, changed: true};
    default:
        return state;
    }
};

const defaultCSVField = (state = '', action) => {
    const {type, defaultCSVField} = action;
    switch (type) {
    case SHOW_CUSTOMER_VALUE_MAPPING:
        return defaultCSVField || '';
    default:
        return state;
    }
};

export default combineReducers({
    customerLookup,
    customerLookupMapping,
    customerOptions,
    maps,
    mappingData,
    selectedMappingTool,
    mapForField,
    mapForValue,
    selectedMap,
    defaultCSVField,
});
