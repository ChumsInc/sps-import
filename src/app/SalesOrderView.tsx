import {Fragment} from 'react';
import {useAppSelector} from "./configureStore";
import {JSONView} from "@chumsinc/json-view";
import {useDocumentColorScheme} from '@chumsinc/ui-utils'
import {selectSalesOrder} from "../ducks/csv-import/csv-import-selectors";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "@/components/ErrorBoundaryFallbackAlert.tsx";

const SalesOrderView = () => {
    const salesOrder = useAppSelector(selectSalesOrder);
    const theme = useDocumentColorScheme();

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
            <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
                <JSONView data={salesOrder} defaultOpenLevels={1} collapsedStringLength={40} dark={theme === 'dark'}/>
            </ErrorBoundary>
        </Fragment>
    );
}
export default SalesOrderView;
