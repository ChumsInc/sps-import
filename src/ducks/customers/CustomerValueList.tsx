import React, {useEffect, useId} from 'react';
import {useAppDispatch, useAppSelector} from "@/app/configureStore";
import {SortableTable, SortableTableField, TablePagination} from "@chumsinc/sortable-tables";
import {SPSValueMap} from "sps-integration-types";
import {SortProps} from "chums-types";
import {
    selectCurrentCustomer,
    selectCustomerMappingFilter,
    selectCustomerMappingList,
    selectCustomerMappingSort,
    selectCustomerMapType,
    selectCustomerPage,
    selectCustomerRowsPerPage
} from "./customer-selectors";
import {
    loadCustomerMapping,
    removeCustomerItemMapping,
    setCustomerMappingFilter,
    setCustomerMapType,
    setCustomerPage,
    setCustomerRowsPerPage,
    setCustomerSort
} from "./customer-actions";
import {FormCheck} from "react-bootstrap";

const MappedOptions = ({map}: { map: SPSValueMap }) => {
    if (!map.MappedOptions) {
        return null;
    }

    switch (map.MapField) {
        case 'ItemCode':
            return (
                <div className="d-flex flex-wrap justify-content-between">
                    {!!map.MappedOptions.conversionFactor &&
                        <div className="me-1">Cnv: {map.MappedOptions.conversionFactor}</div>}
                    {!!map.MappedOptions.UOMOverride &&
                        <div>UOM: {map.MappedOptions.UOMOverride}</div>}
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
    {
        field: 'CSVField',
        title: 'CSV Field',
        cellProps: {style: {maxWidth: '7rem'}},
        sortable: true,
    },
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
    const idItemCode = useId();
    const idShipTo = useId();
    const idOther = useId();
    const [value, setValue] = React.useState<SPSValueMap | null>(null);

    const sortChangeHandler = (sort: SortProps) => dispatch(setCustomerSort(sort));

    const rppChangeHandler = (rpp: number) => {
        dispatch(setCustomerRowsPerPage(rpp));
    }

    useEffect(() => {
        if (customer) {
            dispatch(loadCustomerMapping(customer));
        }
    }, [customer])

    const rowSelectHandler = (row: SPSValueMap | null) => {
        setValue(row);
    }

    const deleteCustomerItemHandler = async () => {
        if (!value || !window.confirm('Are you sure you want to delete this mapping?')) {
            return;
        }
        await dispatch(removeCustomerItemMapping(value));
        setValue(null);
    }

    return (
        <div>
            <div className="row g-3">
                <div className="col-auto">Map Type:</div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Item Code" id={idItemCode}
                               checked={mapType === 'ItemCode'}
                               onChange={() => dispatch(setCustomerMapType('ItemCode'))}/>
                </div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Ship To" id={idShipTo}
                               checked={mapType === 'ShipToCode'}
                               onChange={() => dispatch(setCustomerMapType('ShipToCode'))}/>
                </div>
                <div className="col-auto">
                    <FormCheck type="radio" label="Other" id={idOther}
                               checked={mapType === 'other'}
                               onChange={() => dispatch(setCustomerMapType('other'))}/>
                </div>
            </div>
            <div className="row g-3">
                <div className="col-auto">Search</div>
                <div className="col-auto">
                    <input type="search" value={search}
                           onChange={(ev) => dispatch(setCustomerMappingFilter(ev.target.value))}
                           className="form-control form-control-sm"/>
                </div>
            </div>
            <SortableTable currentSort={sort} onChangeSort={sortChangeHandler} fields={fields}
                           onSelectRow={rowSelectHandler}
                           size="xs"
                           data={values.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} keyField="id"/>
            <TablePagination page={page} onChangePage={(page) => dispatch(setCustomerPage(page))}
                             rowsPerPage={rowsPerPage}
                             rowsPerPageProps={{onChange: rppChangeHandler}}
                             showFirst showLast size="sm"
                             count={values.length}/>
            <code>
                <pre>
                    {JSON.stringify(value, undefined, 2)}
                </pre>
            </code>
            <button type="button" className="btn btn-sm btn-danger"
                    disabled={!value || !value.id || value.MapField !== 'ItemCode'}
                    onClick={deleteCustomerItemHandler}>
                Delete Mapping
            </button>
        </div>

    )

}

export default CustomerValueList;
