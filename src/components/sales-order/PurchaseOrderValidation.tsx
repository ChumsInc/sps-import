import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectExistingPO, selectExistingPOLoading, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {loadExistingPurchaseOrder} from "../../ducks/csv-import/csv-import-actions";
import {FormColumn, Spinner} from "chums-components";

const PurchaseOrderValidation = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const existingPO = useAppSelector(selectExistingPO);
    const loading = useAppSelector(selectExistingPOLoading);

    useEffect(() => {
        dispatch(loadExistingPurchaseOrder(salesOrder))
    }, [salesOrder?.ARDivisionNo, salesOrder?.CustomerNo, salesOrder?.CustomerPONo]);

    if (!salesOrder) {
        return null;
    }

    return (
        <FormColumn width={8} label="Purchse Order #">
            <div className="input-group input-group-sm">
                <div className="input-group-text">
                    {!salesOrder.CustomerNo && <span className="bi-question-circle-fill"/>}
                    {existingPO?.SalesOrderNo && <span className="bi-exclamation-triangle-fill text-danger"/>}
                    {!!salesOrder.CustomerNo && !existingPO && <span className="bi-check2 text-success"/>}
                </div>
                <input type="text" readOnly value={salesOrder?.CustomerPONo} className="form-control form-control-sm"/>
                {loading && (
                    <div className="input-group-text">
                        <Spinner color="warning" bsSize="sm" type="border"/>
                    </div>
                )}
            </div>
            {loading && <div className="text-muted">Validating Purchase Order</div>}
            {!loading && !existingPO && (
                <div className="text-muted">
                    This Purchase Order does not yet exist in Sage.
                </div>
            )}
            {!loading && !!existingPO && (
                <div className="text-danger">
                    This PO has already been imported as SO# '{existingPO.SalesOrderNo}'.
                </div>
            )}
        </FormColumn>
    );
}

export default PurchaseOrderValidation;
