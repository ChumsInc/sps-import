import React, {useEffect, useState} from 'react';
import ImportTabContent from "../components/ImportTabContent";
import CurrentMappingContent from "../components/mapping/CurrentMappingContent";
import CSVLinesView from "./CSVLinesView";
import SalesOrderView from "./SalesOrderView";
import CustomerList from "../ducks/customers/CustomerList";
import {useAppDispatch} from "./configureStore";
import {loadCustomers} from "@/ducks/customers/customer-actions";
import CustomerValueList from "../ducks/customers/CustomerValueList";
import VersionInfo from "../ducks/version/VersionInfo";
import {ErrorBoundary} from "react-error-boundary";
import ErrorBoundaryFallbackAlert from "../components/ErrorBoundaryFallbackAlert";
import AppNav from "../components/AppNav";
import AlertList from "@/components/alerts/AlertList";


const App = () => {
    const dispatch = useAppDispatch();
    const [tab, setTab] = useState<string>('customer');

    useEffect(() => {
        dispatch(loadCustomers());
    }, [])

    return (
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallbackAlert}>
            <AlertList/>
            <div className="row g-3">
                <div className="col-6">
                    <ImportTabContent/>
                </div>
                <div className="col-6">
                    <AppNav activeKey={tab} onSelect={(tab) => setTab(tab ?? 'customer')}/>
                    {tab === 'customer' && <CurrentMappingContent/>}
                    {tab === 'csv' && (<CSVLinesView/>)}
                    {tab === 'so' && (<SalesOrderView/>)}
                    {tab === 'customer_maps' && (<CustomerValueList/>)}
                    {tab === 'customer_list' && <CustomerList/>}
                    <VersionInfo/>
                </div>
            </div>
        </ErrorBoundary>
    )
}

export default App;
