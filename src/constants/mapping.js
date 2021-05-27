export const SET_CUSTOMER_LOOKUP = 'SET_CUSTOMER_LOOKUP';
export const TOGGLE_CUSTOMER_LOOKUP_FIELD = 'TOGGLE_CUSTOMER_LOOKUP_FIELD';
export const SHOW_CUSTOMER_LOOKUP_MAPPING = 'SHOW_CUSTOMER_LOOKUP_MAPPING';
export const SHOW_CUSTOMER_DATE_MAPPING = 'SHOW_CUSTOMER_DATE_MAPPING';
export const SHOW_VALUE_MAPPING = 'SHOW_VALUE_MAPPING';
export const UPDATE_CUSTOMER_MAPPING = 'UPDATE_CUSTOMER_MAPPING';
export const SHOW_CUSTOMER_VALUE_MAPPING = 'SHOW_CUSTOMER_VALUE_MAPPING';
export const SHOW_SALES_ORDER_VALUES = 'SHOW_SALES_ORDER_VALUES';
export const SHOW_CSV_VALUES = 'SHOW_CSV_VALUES';
export const TOGGLE_ZERO_COMMISSION = 'TOGGLE_ZERO_COMMISSION';

export const FETCH_CUSTOMER_LOOKUP = 'FETCH_CUSTOMER_LOOKUP';
export const FETCH_CUSTOMER_LOOKUP_MAP = 'FETCH_CUSTOMER_LOOKUP_MAP';
export const FETCH_CUSTOMER_LOOKUP_MAPPING = 'FETCH_CUSTOMER_LOOKUP_MAPPING';
export const FETCH_CUSTOMER_MAPPING = 'FETCH_CUSTOMER_MAPPING';

export const URL_CUSTOMER_LOOKUP = '/api/search/customer/chums/:ARDivisionNo-:CustomerNo';
export const URL_CUSTOMER_LOOKUP_MAPPING = '/api/sales/sps/customers/:Company/:ARDivisionNo-:CustomerNo';
export const URL_CUSTOMER_MAPPING = '/api/sales/sps/mapping/:Company/:ARDivisionNo-:CustomerNo';

export const MAP_ACCOUNT = 'MAP_ACCOUNT';
export const MAP_DATES = 'MAP_DATES';
export const MAP_FIELD_VALUES = 'MAP_FIELD_VALUES';
export const MAP_SO_VALUES = 'MAP_SO_VALUES';
export const MAP_CSV_VALUES = 'MAP_CSV_VALUES';

export const dateMappingFields = ['ShipExpireDate', 'CancelDate'];

export const defaultValueMap = {
    id: 0,
    MapField: '',
    CSVField: '',
    CustomerValue: '',
    MappedValue: '',
};

export const defaultDateMap = {
    ...defaultValueMap,
    MappedOptions: {add: 0},

};

export const defaultItemMap = {
    ...defaultValueMap,
    MappedOptions: {conversionFactor: 1, UOMOverride: ''}
};

export const mapForFieldTitles = {
    ShipExpireDate: "Ship Date",
    CancelDate: "Cancel Date",
    ShipToCode: "Ship To Code",
};

