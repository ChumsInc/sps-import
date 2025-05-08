import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {FormColumn} from "chums-components";
import {customerNo} from "../../ducks/customers/customer-utils";
import classNames from "classnames";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";
import InputGroup from "react-bootstrap/InputGroup";

const MappedCustomerInfo = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const csvHeader = useAppSelector(selectCSVHeader);

    if (!salesOrder) {
        return null;
    }

    const buttonClassName = classNames('btn btn-sm', {
        'btn-danger': !salesOrder.CustomerNo || !salesOrder.ARDivisionNo,
        'btn-success': !!salesOrder.ARDivisionNo && !!salesOrder.CustomerNo
    });

    const clickHandler = () => {
        dispatch(setCurrentMapping({line: csvHeader, mapField: 'Customer'}))
    }

    return (
        <FormColumn label="Customer">
            <InputGroup size="sm">
                <InputGroup.Text>
                    <span className="bi-building"/>
                </InputGroup.Text>
                <InputGroup.Text>{salesOrder.BillToAddress?.CustomerName}</InputGroup.Text>
                <input type="text" className="form-control form-control-sm" readOnly
                       value={customerNo(salesOrder) ?? ''}/>
                <button className={buttonClassName} onClick={clickHandler}>Mapping</button>
            </InputGroup>
        </FormColumn>
    )
}
export default MappedCustomerInfo;
