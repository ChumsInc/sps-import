import {buildPath, fetchGET, fetchPOST} from "./fetch";
import {
    FETCH_CUSTOMER_LOOKUP,
    FETCH_CUSTOMER_LOOKUP_MAP,
    FETCH_CUSTOMER_MAPPING,
    SET_CUSTOMER_LOOKUP,
    UPDATE_CUSTOMER_MAPPING,
    SHOW_CUSTOMER_VALUE_MAPPING,
    SHOW_CUSTOMER_DATE_MAPPING,
    SHOW_CUSTOMER_LOOKUP_MAPPING,
    TOGGLE_CUSTOMER_LOOKUP_FIELD,
    URL_CUSTOMER_LOOKUP,
    URL_CUSTOMER_LOOKUP_MAPPING,
    URL_CUSTOMER_MAPPING, defaultValueMap, defaultItemMap, defaultDateMap, SHOW_SALES_ORDER_VALUES, SHOW_CSV_VALUES,
    dateMappingFields, TOGGLE_ZERO_COMMISSION
} from "../constants/mapping";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {setAlert} from "./app";

function matchCustomer(a, b) {
    return a.Company = b.Company && a.ARDivisionNo === b.ARDivisionNo && a.CustomerNo === b.CustomerNo;
}

function matchMapping(a, b) {
    return a.id === b.id;
}

export const setCustomerLookup = (str = '') => {
    const [, ARDivisionNo = '', CustomerNo = ''] = /([0-9]{0,2})[\-]*(?=([A-Z0-9]{0,20}))/i.exec(str);
    const customer = {Company: 'chums', ARDivisionNo, CustomerNo, CustomerName: ''};
    return {type: SET_CUSTOMER_LOOKUP, customer};
};

export const toggleZeroCommissions = () => ({type: TOGGLE_ZERO_COMMISSION});

export const loadLookupCustomer = () => (dispatch, getState) => {
    const {mapping} = getState();
    const {Company, ARDivisionNo, CustomerNo, loading} = mapping.customerLookup;
    if (loading) {
        return;
    }

    const url = buildPath(URL_CUSTOMER_LOOKUP, {ARDivisionNo, CustomerNo}, true);
    fetchGET(url)
        .then(res => {
            const [customer] = res.result;
            if (!customer) {
                return dispatch({type: FETCH_CUSTOMER_LOOKUP, status: FETCH_SUCCESS, customer: {Company, ARDivisionNo, CustomerNo, CustomerName: 'Not Found'}});
            }
            dispatch({type: FETCH_CUSTOMER_LOOKUP, status: FETCH_SUCCESS, customer});
        })
        .catch(err => {
            console.log(err.message);
            setAlert({message: err.message});
        })
};

export const toggleCustomerLookupField = ({field, value}) => ({type: TOGGLE_CUSTOMER_LOOKUP_FIELD, field, value});

export const showCustomerMapping = (line) => ({type: SHOW_CUSTOMER_LOOKUP_MAPPING, line});

export const showCustomerDateMapping = (mapForField, line) => (dispatch, getState) => {
    const {mapping} = getState();
    if (mapping.mapForField === mapForField) {
        return dispatch({type: SHOW_CUSTOMER_DATE_MAPPING});
    }
    const [selectedMap = {}] = mapping.maps.filter(map => map.MapField === mapForField).map(map => ({...map}));
    selectedMap.CustomerValue = '';
    dispatch({type: SHOW_CUSTOMER_DATE_MAPPING, mapForField, line, selectedMap});
};

export const fetchItem = (itemCode) => (dispatch, getState) => {

};

export const showCustomerValueMapping = (mapForField, mappedValue, line) => (dispatch, getState) => {
    const {mapping} = getState();
    const {maps = []} = mapping;
    let mapForValue = '';
    let selectedMap;
    let defaultCSVField = '';
    if (mapForField === 'ItemCode') {
        const csvFields = [];
        [selectedMap = {...defaultItemMap}] = maps
            .filter(map => map.MapField === mapForField)
            .map(map => {
                if (!csvFields.includes(map.CSVField)) {
                    csvFields.push(map.CSVField);
                }
                return map;
            })
            .filter(map => map.MappedValue === mappedValue)
            .map(map => ({...map}));
        if (csvFields.length === 1) {
            defaultCSVField = csvFields[0];
        }
        if (!selectedMap.CustomerValue) {
            selectedMap.CustomerValue = mappedValue === '-' ? '' : mappedValue;
        }
    } else if (/date/i.test(mapForField)) {
        return dispatch(showCustomerDateMapping(mapForField, line));
    } else {
        const csvFields = [];
        [selectedMap = {...defaultValueMap}] = maps
            .filter(map => map.MapField === mapForField)
            .map(map => {
                if (!csvFields.includes(map.CSVField)) {
                    csvFields.push(map.CSVField);
                }
                return map;
            })
            .filter(map => map.MapField === mapForField && map.MappedValue === mappedValue)
            .map(map => ({...map}));
        if (csvFields.length === 1) {
            defaultCSVField = csvFields[0];
        }
        selectedMap.MapField = mapForField;
        if (!selectedMap.CustomerValue) {
            selectedMap.CustomerValue = mappedValue;
        }
    }

    mapForValue = selectedMap.CustomerValue || '';
    if (mapping.mapForField === mapForField && mapping.mapForValue === mapForValue) {
        return dispatch({type: SHOW_CUSTOMER_VALUE_MAPPING});
    }
    dispatch({type: SHOW_CUSTOMER_VALUE_MAPPING, mapForField, mapForValue, line, selectedMap, defaultCSVField});
};

export const updateCustomerMapping = (props) => ({type: UPDATE_CUSTOMER_MAPPING, props});

export const saveCustomerLookupMapping = () => (dispatch, getState) => {
    const {mapping} = getState();
    const {loading, changed, ...customerLookupMapping} = mapping.customerLookupMapping;
    const {customerOptions: options} = mapping;
    const {id, Company, ARDivisionNo, CustomerNo} = mapping.customerLookup;
    if (loading || !CustomerNo) {
        return;
    }
    const LookupFields = Object.keys(customerLookupMapping).map(key => ({field: key, value: customerLookupMapping[key]}));
    const url = buildPath(URL_CUSTOMER_LOOKUP_MAPPING, {Company, ARDivisionNo, CustomerNo});
    console.log(url, {LookupFields, options});
    return;
    dispatch({type: FETCH_CUSTOMER_LOOKUP_MAP, status: FETCH_INIT});
    fetchPOST(url, {LookupFields, options})
        .then(result => {
            const [mapping] = result.customers.filter(cust => matchCustomer(cust, {Company, ARDivisionNo, CustomerNo}));
            dispatch({type: FETCH_CUSTOMER_LOOKUP_MAP, status: FETCH_SUCCESS, mapping});
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_CUSTOMER_LOOKUP_MAP, status: FETCH_FAILURE});
            setAlert({message: err.message});
        })
};

export const saveCustomerMapping = (map) => (dispatch, getState) => {
    const {mapping} = getState();
    const {mapForField, mapForValue, mappingData} = mapping;
    const {Company, ARDivisionNo, CustomerNo} = mapping.customerLookup;
    if (!map || map.loading || !CustomerNo) {
        return;
    }

    const url = buildPath(URL_CUSTOMER_MAPPING, {Company, ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_CUSTOMER_MAPPING, status: FETCH_INIT});
    fetchPOST(url, map)
        .then(({mapping}) => {
            dispatch({type: FETCH_CUSTOMER_MAPPING, status: FETCH_SUCCESS, mapping: mapping});
            if (dateMappingFields.includes(mapForField)) {
                const [selectedMap] = mapping.filter(map => map.MapField === mapForField).map(map => ({...map}));
                selectedMap.CustomerValue = '';
                dispatch({type: SHOW_CUSTOMER_DATE_MAPPING, mapForField, line: mappingData, selectedMap});
            } else {
                const [selectedMap] = mapping.filter(map => map.MapField === mapForField && map.CustomerValue === mapForValue).map(map => ({...map}));
                dispatch({type: SHOW_CUSTOMER_VALUE_MAPPING, mapForField, mapForValue, line: mappingData, selectedMap});
            }
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_CUSTOMER_MAPPING, status: FETCH_FAILURE, err});
            setAlert({message: err.message});
        })
};

export const showSOValues = () => ({type: SHOW_SALES_ORDER_VALUES});
export const showCSVValues = () => ({type: SHOW_CSV_VALUES});
