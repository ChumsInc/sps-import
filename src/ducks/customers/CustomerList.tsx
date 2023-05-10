import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {Alert, SortableTable, SortableTableField, TablePagination} from "chums-components";
import {SPSCustomerMap} from "sps-integration-types";
import {SortProps} from "chums-types";
import {customerNo} from "./customer-utils";
import CustomerFieldsList from "./CustomerFieldsList";
import {selectCurrentCustomer, selectPage, selectRowsPerPage, selectSort, selectSortedList} from "./customer-selectors";
import {loadCustomers, setCurrentCustomer, setPage, setRowsPerPage, setSort} from "./customer-actions";

const fields: SortableTableField<SPSCustomerMap>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'CustomerNo', title: 'Customer', render: (row) => customerNo(row), sortable: true},
    {field: 'CustomerName', title: 'Customer Name', sortable: true},
    {
        field: 'LookupFields',
        title: 'Lookup Fields',
        render: (row) => <CustomerFieldsList fields={row.LookupFields ?? []}/>,
        sortable: true
    }

]
const CustomerList = () => {
    const dispatch = useAppDispatch();
    const customers = useAppSelector(selectSortedList);
    const sort = useAppSelector(selectSort);
    const page = useAppSelector(selectPage);
    const rowsPerPage = useAppSelector(selectRowsPerPage);
    const sortChangeHandler = (sort: SortProps) => dispatch(setSort(sort));
    const currentCustomer = useAppSelector(selectCurrentCustomer);

    const rowSelectHandler = (row: SPSCustomerMap) => {
        dispatch(setCurrentCustomer(row));
    }


    useEffect(() => {
        dispatch(loadCustomers());
    }, [])

    return (
        <div>
            <Alert color="info">Customers must match all listed fields.</Alert>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           size="xs" selected={currentCustomer?.id}
                           data={customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} keyField="id"
                           onSelectRow={rowSelectHandler}/>
            <TablePagination page={page} onChangePage={(page) => dispatch(setPage(page))}
                             rowsPerPage={rowsPerPage} onChangeRowsPerPage={(rpp) => dispatch(setRowsPerPage(rpp))}
                             showFirst showLast bsSize="sm"
                             count={customers.length}/>
        </div>

    )

}

export default CustomerList;
