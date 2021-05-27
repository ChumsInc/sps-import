import {combineReducers} from 'redux';
import {
    FETCH_EXISTING_SO,
    FETCH_POST_IMPORT,
    FETCH_UPLOAD_TEST,
    SET_CSV_FILE,
    SET_UPLOAD
} from "../constants/csv-import";
import {FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {FETCH_CUSTOMER_MAPPING} from "../constants/mapping";

const file = (state = null, action) => {
    const {type, file} = action;
    switch (type) {
    case SET_CSV_FILE:
        return file;
    default:
        return state;
    }
};

const processing = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case SET_UPLOAD:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const salesOrder = (state = {}, action) => {
    const {type, status, SalesOrder} = action;
    switch (type) {
    case SET_CSV_FILE:
        return {};

    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            return {...SalesOrder};
        }
        return state;

    case FETCH_CUSTOMER_MAPPING:
        if (status === FETCH_SUCCESS) {
            return {...state, validationRequired: true};
        }
        return state;
    default:
        return state;
    }
};

const mapping = (state = [], action) => {
    const {type, status, mapping} = action;
    switch (type) {
    case SET_CSV_FILE:
        return [];
    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            return [...mapping];
        }
        return state;
    default:
        return state;
    }
};

const csvLines = (state = [], action) => {
    const {type, status, csvLines} = action;
    switch (type) {
    case SET_CSV_FILE:
        return [];
    case FETCH_UPLOAD_TEST:
        if (status === FETCH_SUCCESS) {
            return [...csvLines];
        }
        return state;
    default:
        return state;
    }
};

const existingPO = (state = {}, action) => {
    const {type, status, SalesOrder} = action;
    switch (type) {
    case FETCH_EXISTING_SO:
        if (status === FETCH_SUCCESS) {
            return {...SalesOrder};
        }
        return state;
    case SET_CSV_FILE:
    case FETCH_UPLOAD_TEST:
        return {};
    default:
        return state;
    }
};

const importResult = (state = {}, action) => {
    const {type, status, result} = action;
    switch (type) {
    case FETCH_EXISTING_SO:
    case SET_CSV_FILE:
    case FETCH_UPLOAD_TEST:
        return {};
    case FETCH_POST_IMPORT:
        if (status === FETCH_SUCCESS) {
            return result;
        }
        return state;
    default:
        return state;
    }
}


export default combineReducers({
    file,
    processing,
    salesOrder,
    mapping,
    csvLines,
    existingPO,
    importResult,
});
