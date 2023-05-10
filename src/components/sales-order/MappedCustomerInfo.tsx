import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {FormColumn, InputGroup} from "chums-components";
import {customerNo} from "../../ducks/customers/customer-utils";
import classNames from "classnames";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";

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
            <InputGroup bsSize="sm">
                <div className="input-group-text">
                    <span className="bi-building"/>
                </div>
                <div className="input-group-text">{salesOrder.BillToAddress?.CustomerName}</div>
                <input type="text" className="form-control form-control-sm" readOnly
                       value={customerNo(salesOrder) ?? ''}/>
                <button className={buttonClassName} onClick={clickHandler}>Mapping</button>
            </InputGroup>
        </FormColumn>
    )
}
export default MappedCustomerInfo;
