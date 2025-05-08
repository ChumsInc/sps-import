import React from 'react';
import numeral from 'numeral';
import {Alert} from "react-bootstrap";
import {useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import Decimal from "decimal.js";
import ImportItemRow from "./ImportItemRow";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../ErrorBoundaryFallbackAlert";

const ImportItemList = () => {
    const salesOrder = useAppSelector(selectSalesOrder);
    const csvHeader = useAppSelector(selectCSVHeader);

    if (!salesOrder) {
        return null;
    }

    const POTotalAmount = Number(csvHeader['PO Total Amount'] || 0);
    const hasPackForStore = salesOrder.detail.filter(line => !!line.UDF_SHIP_CODE).length > 0;
    const total = salesOrder.detail
        .map((row) => new Decimal(row.QuantityOrdered ?? 0).times(row.UnitPrice ?? 0).toString())
        .reduce((pv, currentValue) => new Decimal(currentValue ?? 0).add(pv).toString(), new Decimal(0).toString());

    return (
        <div>
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <table className="table table-sm table-sticky">
                    <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Item Desc</th>
                        <th className="right">Qty</th>
                        <th className="right">UM</th>
                        <th className="right">Price</th>
                        <th className="right">Total</th>
                        {hasPackForStore && (<th>Pack For</th>)}
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th colSpan={5}>Detail Total</th>
                        <th className="right">{numeral(total).format('0,0.00')}</th>
                        <th>&nbsp;</th>
                    </tr>
                    <tr>
                        <th>PO Total Amount</th>
                        <th colSpan={4}>
                            {new Decimal(POTotalAmount).sub(total).abs().gt(0.01) && (
                                <Alert variant="warning">
                                    Total does not match: ${numeral(total).format('0,0.00')}
                                </Alert>)}
                        </th>
                        <th className="right">{numeral(POTotalAmount).format('0,0.00')}</th>
                        <th>&nbsp;</th>
                    </tr>
                    </tfoot>
                    <tbody>
                    {salesOrder.detail.map((line, index) => (
                        <ImportItemRow key={line.csv?.['PO Line #'] ?? index} line={line}
                                       hasPackForStore={hasPackForStore}/>
                    ))}
                    </tbody>
                </table>
            </ErrorBoundary>

        </div>
    );
}
export default ImportItemList
