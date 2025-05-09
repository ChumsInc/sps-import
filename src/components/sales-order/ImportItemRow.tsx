import React from 'react';
import {SPSSalesOrderDetailLine} from "sps-integration-types";
import {useAppDispatch} from "../../app/configureStore";
import classNames from "classnames";
import numeral from "numeral";
import {Alert} from "react-bootstrap";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";

const nonInventoryItem = /^\*/;
const ImportItemRow = ({line, hasPackForStore}: {
    line: SPSSalesOrderDetailLine;
    hasPackForStore?: boolean;
}) => {
    const dispatch = useAppDispatch();
    const {
        ItemCode,
        ItemCodeDesc,
        QuantityOrdered,
        UnitOfMeasure,
        UnitPrice,
        UDF_SHIP_CODE,
        map,
        errors,
        csv
    } = line;

    const btnClassName = {
        'btn-success': !!map?.id && !errors?.length,
        'btn-outline-secondary': !map?.id,
        'btn-danger': errors.length > 0,
    };
    const rowClassName = {
        'table-warning': nonInventoryItem.test(ItemCode ?? ''),
        'table-danger': !nonInventoryItem.test(ItemCode ?? '') && errors.length > 0,
    };

    const clickHandler = () => {
        if (!line || !line.csv) {
            return;
        }
        const {csv, map} = line;
        dispatch(setCurrentMapping({
            line: csv,
            customerValue: map?.CustomerValue ?? '',
            mapField: 'ItemCode',
            mapToValue: map?.MappedValue ?? '',
        }));
    }

    return (
        <>
            <tr className={classNames(rowClassName)}>
                <td>{ItemCode}</td>
                <td>{ItemCodeDesc}</td>
                <td className="right">{QuantityOrdered}</td>
                <td className="right">{UnitOfMeasure}</td>
                <td className="right">{numeral(UnitPrice).format('0.00')}</td>
                <td className="right">{numeral(Number(QuantityOrdered ?? 0) * Number(UnitPrice ?? 0)).format('0,0.00')}</td>
                {hasPackForStore && (<td>{UDF_SHIP_CODE}</td>)}
                <td className="center">
                    <button className={classNames("btn btn-sm btn", btnClassName)} onClick={clickHandler}>Map</button>
                </td>
            </tr>
            {!nonInventoryItem.test(ItemCode ?? '') && errors.length > 0 && (
                <tr>
                    <td colSpan={hasPackForStore ? 8 : 7}>
                        <Alert variant="danger">
                            {errors.join('; ')}
                        </Alert>
                    </td>
                </tr>
            )}
        </>

    )

}
export default ImportItemRow;
