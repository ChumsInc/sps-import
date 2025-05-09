import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {FormColumn} from "chums-components";
import classNames from "classnames";
import {selectMaps} from "../../ducks/mapping/mapping-selectors";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";
import dayjs from "dayjs";
import InputGroup from "react-bootstrap/InputGroup";

const MappedShipDate = () => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const csvHeader = useAppSelector(selectCSVHeader);
    const maps = useAppSelector(selectMaps);

    const [shipDateMap] = maps.filter(map => map.MapField === 'ShipExpireDate');

    if (!salesOrder) {
        return null;
    }

    const buttonClassName = classNames('btn btn-sm', {
        'btn-danger': !shipDateMap,
        'btn-success': !!shipDateMap,
    });

    const clickHandler = () => {
        dispatch(setCurrentMapping({
            line: csvHeader,
            mapField: 'ShipExpireDate'
        }));
    }
    const shipDate = dayjs(salesOrder.ShipExpireDate).format('ddd MM/DD/YYYY')

    return (
        <FormColumn label="Ship Date">
            <InputGroup size="sm">
                <InputGroup.Text>
                    <span className="bi-calendar-date"/>
                </InputGroup.Text>
                <input type="text" className="form-control form-control-sm" readOnly
                       value={shipDate}/>
                <button className={buttonClassName} onClick={clickHandler}>Mapping</button>
            </InputGroup>
        </FormColumn>
    )
}

export default MappedShipDate;
