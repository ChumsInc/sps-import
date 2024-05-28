import React, {Fragment} from 'react';
import {useAppSelector} from "./configureStore";
import {JSONView} from "@chumsinc/json-view";
import {selectSalesOrder} from "../ducks/csv-import/csv-import-selectors";

const SalesOrderView = () => {
    const salesOrder = useAppSelector(selectSalesOrder);

    if (!salesOrder) {
        return null;
    }

    (salesOrder.detail || []).forEach(line => {
        const {csv, map, ...rest} = line;
        // discard csv, map
        return {...rest};
    });
    return (
        <Fragment>
            <h2>Sales Order Preview</h2>
            <JSONView data={salesOrder} defaultOpenLevels={1} collapsedStringLength={40}/>
        </Fragment>
    );
}
export default SalesOrderView;
