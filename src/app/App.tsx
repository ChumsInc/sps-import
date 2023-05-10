import React, {useEffect} from 'react';
import AlertList from "../ducks/alerts/AlertList";
import ImportTabContent from "../components/ImportTabContent";
import CurrentMappingContent from "../components/mapping/CurrentMappingContent";
import {Tab, TabList} from "chums-components";
import CSVLinesView from "./CSVLinesView";
import SalesOrderView from "./SalesOrderView";
import CustomerList from "../ducks/customers/CustomerList";
import {useAppDispatch, useAppSelector} from "./configureStore";
import {loadCustomers} from "../ducks/customers/customer-actions";
import CustomerValueList from "../ducks/customers/CustomerValueList";
import {selectCurrentTab, selectTabs, setCurrentTab, setTabs} from "../ducks/app";

const appTabs: Tab[] = [
    {id: 'customer', title: 'Current Map'},
    {id: 'csv', title: 'Show CSV'},
    {id: 'so', title: 'Sales Order Values'},
    {id: 'customer_list', title: 'Customer List'},
    {id: 'customer_maps', title: 'Customer Mapping'},
]

const App = () => {
    const dispatch = useAppDispatch();
    const tab = useAppSelector(selectCurrentTab);
    const tabs = useAppSelector(selectTabs);
    const setTab = (tab: Tab) => dispatch(setCurrentTab(tab.id));

    useEffect(() => {
        dispatch(setTabs(appTabs));
        dispatch(setCurrentTab('customer'))
        dispatch(loadCustomers());

    }, [])

    return (
        <div>
            <AlertList/>
            <div className="row g-3">
                <div className="col-6">
                    <ImportTabContent/>
                </div>
                <div className="col-6">
                    <TabList tabs={tabs} onSelectTab={setTab} currentTabId={tab}/>
                    {tab === 'customer' && <CurrentMappingContent/>}
                    {tab === 'csv' && (<CSVLinesView/>)}
                    {tab === 'so' && (<SalesOrderView/>)}
                    {tab === 'customer_maps' && (<CustomerValueList/>)}
                    {tab === 'customer_list' && <CustomerList/>}
                </div>
            </div>
        </div>
    )
}

export default App;
