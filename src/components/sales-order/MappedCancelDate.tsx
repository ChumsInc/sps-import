import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {FormColumn} from "chums-components";
import classNames from "classnames";
import {selectMaps} from "../../ducks/mapping/mapping-selectors";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";
import dayjs from "dayjs";
import InputGroup from "react-bootstrap/InputGroup";

const MappedCancelDate = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const csvHeader = useAppSelector(selectCSVHeader);
    const maps = useAppSelector(selectMaps);

    const [cancelDateMap] = maps.filter(map => map.MapField === 'CancelDate');

    if (!salesOrder) {
        return null;
    }

    const buttonClassName = classNames('btn btn-sm', {
        'btn-outline-secondary': !cancelDateMap,
        'btn-success': !!cancelDateMap,
    });

    const clickHandler = () => {
        dispatch(setCurrentMapping({
            line: csvHeader,
            mapField: 'CancelDate'
        }));
    }

    const cancelDate = salesOrder.CancelDate
        ? dayjs(salesOrder.CancelDate).format('ddd MM/DD/YYYY')
        : '';

    return (
        <FormColumn label="Cancel Date">
            <InputGroup size="sm">
                <InputGroup.Text>
                    <span className="bi-calendar-date"/>
                </InputGroup.Text>
                <input type="text" className="form-control form-control-sm" readOnly
                       value={cancelDate}/>
                <button className={buttonClassName} onClick={clickHandler}>Mapping</button>
            </InputGroup>
        </FormColumn>
    )
}

export default MappedCancelDate;
