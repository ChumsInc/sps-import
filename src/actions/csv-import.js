import {
    FETCH_EXISTING_SO, FETCH_POST_IMPORT,
    FETCH_UPLOAD_TEST,
    SET_CSV_FILE,
    SET_PROGRESS,
    SET_UPLOAD,
    URL_EXISTING_SO, URL_IMPORT_SO,
    URL_UPLOAD_SO
} from "../constants/csv-import";
import {FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS} from "../constants/app";
import {buildPath, fetchGET, fetchPOST, SageCompany} from "./fetch";
import {setAlert} from "./app";

export const setImportFile = (file) => ({type: SET_CSV_FILE, file});

export const sendFile = () => (dispatch, getState) => {
    const {csvImport} = getState();
    const {file} = csvImport;
    if (!file) {
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.upload.addEventListener('progress', ev => {
        dispatch({type: SET_PROGRESS, filename: file.name, progress: (ev.loaded / ev.total) * 100});
    });

    xhr.upload.addEventListener('loadstart', (ev) => {
        dispatch({type: SET_UPLOAD, filename: file.name, status: FETCH_INIT});
    });

    xhr.upload.addEventListener('abort', (ev) => {
        dispatch({type: SET_UPLOAD, filename: file.name, status: FETCH_FAILURE});
    });

    xhr.upload.addEventListener('error', (ev) => {
        dispatch({type: SET_UPLOAD, filename: file.name, status: FETCH_FAILURE});
    });

    xhr.upload.addEventListener('timeout', (ev) => {
        dispatch({type: SET_UPLOAD, filename: file.name, status: FETCH_FAILURE});
    });

    xhr.upload.addEventListener('load', (ev) => {
        // console.log(xhr.responseText);
        // const {thumb} = JSON.parse(xhr.responseText);
        dispatch({type: SET_UPLOAD, filename: file.name, status: FETCH_SUCCESS});
    });

    xhr.onreadystatechange = (ev) => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const {SalesOrder, mapping, csvLines, customer} = xhr.response;
            dispatch({type: FETCH_UPLOAD_TEST, status: FETCH_SUCCESS, SalesOrder, mapping, csvLines, customer});
            dispatch(fetchExistingSO());
        }

    };

    const formData = new FormData();
    formData.append(file.name, file, file.name);
    xhr.open('POST', URL_UPLOAD_SO, true);
    // xhr.open('POST', UPLOAD_SERVER_PATHS[uploadServer], true);
    xhr.send(formData);
};

export const fetchExistingSO = () => (dispatch, getState) => {
    const {csvImport} = getState();
    const {salesOrder, processing} = csvImport;
    const {Company, ARDivisionNo, CustomerNo, CustomerPONo} = salesOrder;
    if (processing === true || !Company) {
        return;
    }
    const url = buildPath(URL_EXISTING_SO, {Company: SageCompany(Company), ARDivisionNo, CustomerNo, CustomerPONo}, true);
    dispatch({type: FETCH_EXISTING_SO, status: FETCH_INIT});
    fetchGET(url)
        .then(({SalesOrder}) => {
            dispatch({type: FETCH_EXISTING_SO, status: FETCH_SUCCESS, SalesOrder});
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_EXISTING_SO, status: FETCH_FAILURE});
            setAlert({message: err.message});
        })
};

export const importToSage =() => (dispatch, getState) => {
    const {csvImport} = getState();
    const {salesOrder, processing} = csvImport;

    if (processing === true || !salesOrder.CustomerNo) {
        return;
    }

    dispatch({type: FETCH_POST_IMPORT, status: FETCH_INIT});
    
    fetchPOST(URL_IMPORT_SO, salesOrder, true)
        .then(result => {
            console.log(result);
            dispatch({type: FETCH_POST_IMPORT, status: FETCH_SUCCESS, result});
        })
        .catch(err => {
            console.log(err.message);
            dispatch({type: FETCH_POST_IMPORT, status: FETCH_FAILURE, message: err.message});
        });
};
