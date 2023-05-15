import React from 'react'
import {useAppDispatch, useAppSelector} from "../app/configureStore";
import {selectImportResult} from "../ducks/csv-import/csv-import-selectors";
import {Alert, BootstrapColor} from "chums-components";
import {setCurrentMapping} from "../ducks/mapping/mapping-actions";

const ImportedAlert = () => {
    const dispatch = useAppDispatch();
    const importResult = useAppSelector(selectImportResult);
    const clickHandler = () => dispatch(setCurrentMapping({mapField: 'Import'}));
    if (!importResult) {
        return null;
    }
    let alertColor:BootstrapColor = 'danger';
    let importMessage = 'Import Failed';

    if (importResult.success) {
        alertColor = 'success';
        importMessage = 'Order Successfully Imported';
    }
    return (
        <Alert color={alertColor} title="Order Import">
            <button  className="btn btn-sm btm-outline-secondary me-3" onClick={clickHandler}>
                View Import
            </button>
            {importMessage}
        </Alert>
    )
}

export default ImportedAlert;
