import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {FormCheck, SortableTable, SortableTableField, TablePagination} from "chums-components";
import {SPSValueMap} from "sps-integration-types";
import {SortProps} from "chums-types";
import {
    selectCurrentCustomer, selectCustomerMappingFilter,
    selectCustomerMappingList,
    selectCustomerMappingSort,
    selectCustomerMapType,
    selectCustomerPage,
    selectCustomerRowsPerPage
} from "./customer-selectors";
import {
    loadCustomerMapping, setCustomerMappingFilter,
    setCustomerMapType,
    setCustomerPage,
    setCustomerRowsPerPage,
    setCustomerSort
} from "./customer-actions";

const MappedOptions = ({map}: { map: SPSValueMap }) => {
    if (!map.MappedOptions) {
        return null;
    }

    switch (map.MapField) {
        case 'ItemCode':
            return (
                <div>
                    {!!map.MappedOptions.conversionFactor &&
                        <span className="me-3">Conversion Factor: {map.MappedOptions.conversionFactor}</span>}
                    {!!map.MappedOptions.UOMOverride &&
                        <span className="me-3">UOM: {map.MappedOptions.UOMOverride}</span>}
                </div>
            )
        case 'CancelDate':
        case 'ShipExpireDate':
            return (
                <div>
                    {!!map.MappedOptions.add && <span className="me-3">Add: {map.MappedOptions.add} days</span>}
                </div>
            )
        default:
            return null;
    }
}
const fields: SortableTableField<SPSValueMap>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'MapField', title: 'Map Field', sortable: true},
    {field: 'CustomerValue', title: 'Customer Value', sortable: true},
    {field: 'MappedValue', title: 'Sage Value', sortable: true},
    {field: 'MappedOptions', title: 'Mapped Options', render: (row) => <MappedOptions map={row}/>, sortable: false},
]
const CustomerValueList = () => {
    const dispatch = useAppDispatch();
    const customer = useAppSelector(selectCurrentCustomer);
    const values = useAppSelector(selectCustomerMappingList);
    const sort = useAppSelector(selectCustomerMappingSort);
    const page = useAppSelector(selectCustomerPage);
    const rowsPerPage = useAppSelector(selectCustomerRowsPerPage);
    const mapType = useAppSelector(selectCustomerMapType);
    const search = useAppSelector(selectCustomerMappingFilter);

    const sortChangeHandler = (sort: SortProps) => dispatch(setCustomerSort(sort));


    useEffect(() => {
        if (customer) {
            dispatch(loadCustomerMapping(customer));
        }
    }, [customer])

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">Map Type:</div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Item Code" checked={mapType === 'ItemCode'}
                               onChange={() => dispatch(setCustomerMapType('ItemCode'))}/>
                </div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Ship To" checked={mapType === 'ShipToCode'}
                               onChange={() => dispatch(setCustomerMapType('ShipToCode'))}/>
                </div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Other" checked={mapType === 'other'}
                               onChange={() => dispatch(setCustomerMapType('other'))}/>
                </div>
            </div>
            <div className="row g-3">
                <div className="col-auto">Search</div>
                <div className="col-auto">
                    <input type="search" value={search} onChange={(ev) => dispatch(setCustomerMappingFilter(ev.target.value))}
                           className="form-control form-control-sm" />
                </div>
            </div>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           size="xs"
                           data={values.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} keyField="id"/>
            <TablePagination page={page} onChangePage={(page) => dispatch(setCustomerPage(page))}
                             rowsPerPage={rowsPerPage}
                             onChangeRowsPerPage={(rpp) => dispatch(setCustomerRowsPerPage(rpp))}
                             showFirst showLast bsSize="sm"
                             count={values.length}/>
        </div>

    )

}

export default CustomerValueList;
