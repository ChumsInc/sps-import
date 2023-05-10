import React from 'react';
import BillToAddress from "../BillToAddress";
import ShipToAddress from "../ShipToAddress";
import ImportItemList from "./ImportItemList";
import {Alert} from "chums-components";
import PurchaseOrderValidation from "./PurchaseOrderValidation";
import MappedCustomerInfo from "./MappedCustomerInfo";
import MappedShipDate from "./MappedShipDate";
import MappedCancelDate from "./MappedCancelDate";
import MappedOrderValue from "./MappedOrderValue";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    selectExistingPO,
    selectSalesOrder,
    selectValidationRequired
} from "../../ducks/csv-import/csv-import-selectors";
import classNames from "classnames";
import MapChangedAlert from "../mapping/MapChangedAlert";
import {importToSage} from "../../ducks/csv-import/csv-import-actions";


const ImportTestResult = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const existingPO = useAppSelector(selectExistingPO);
    const validationRequired = useAppSelector(selectValidationRequired);

    if (!salesOrder) {
        return null;
    }

    const {
        DropShip,
        BillToAddress: billToAddress,
        ShipToAddress: shipToAddress,
        detail = [],
        comments
    } = salesOrder;

    const hasFatalErrors = detail
        .filter(line => !!line.errors.length)
        .filter(line => /^\*/.test(line.ItemCode ?? '') === false)
        .length > 0;

    const onImportToSage = () => {
        if (!salesOrder) {
            return;
        }
        dispatch(importToSage(salesOrder))
    }

    const importButtonClassname = classNames('btn btn-sm', {
        'btn-primary': !existingPO?.SalesOrderNo,
        'btn-danger': !!existingPO?.SalesOrderNo,
    })

    return (
        <div>
            <h2>Import File Parsing</h2>

            <MapChangedAlert changed={validationRequired}>
                Validation is required before importing to Sage.
            </MapChangedAlert>
            <PurchaseOrderValidation/>
            <MappedCustomerInfo/>
            <MappedShipDate/>
            <MappedCancelDate/>
            {!DropShip && <MappedOrderValue mapField="ShipToCode" required icon="bi-buildings-fill"/>}
            <MappedOrderValue mapField="ShipVia" icon="bi-truck"/>
            <hr/>
            <div className="row g-3">
                <div className="col-6">
                    <h3>Bill To</h3>
                    <BillToAddress address={billToAddress}/>
                </div>
                <div className="col-6">
                    <h3>{!!DropShip && <span>Drop </span>}Ship To</h3>
                    <ShipToAddress address={shipToAddress}/>
                </div>
            </div>
            <ImportItemList/>
            <ul>
                {(comments || []).map((comment, index) => (<li key={index}>{comment}</li>))}
            </ul>
            {hasFatalErrors && (
                <Alert color="danger" title="Danger:">
                    This import has non-recoverable mapping errors.
                </Alert>
            )}
            <div className="d-grid mt-1 gap-2">
                <button type="button" className={importButtonClassname}
                        disabled={hasFatalErrors || detail.length === 0 || validationRequired}
                        onClick={onImportToSage}>
                    Import Order
                </button>
            </div>
        </div>
    );
}
export default ImportTestResult;
