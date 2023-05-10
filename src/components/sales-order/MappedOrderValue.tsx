import React from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCSVHeader, selectSalesOrder} from "../../ducks/csv-import/csv-import-selectors";
import {selectMaps} from "../../ducks/mapping/mapping-selectors";
import {OrderMapField} from "sps-integration-types";
import classNames from "classnames";
import {FormColumn, InputGroup} from "chums-components";
import {mapFieldNames} from "../mapping/field-names";
import {setCurrentMapping} from "../../ducks/mapping/mapping-actions";

const MappedOrderValue = ({mapField, required, icon}:{
    mapField:OrderMapField,
    required?: boolean,
    icon?: string;
}) => {
    const dispatch = useAppDispatch();
    const salesOrder = useAppSelector(selectSalesOrder);
    const csvHeader = useAppSelector(selectCSVHeader);
    const maps = useAppSelector(selectMaps);

    const [valueMap] = maps.filter(map => map.MapField === mapField)
        .filter(map => map.CustomerValue === csvHeader[map.CSVField]);

    if (!salesOrder) {
        return null;
    }

    const buttonClassName = classNames('btn btn-sm', {
        'btn-danger': required && !valueMap,
        'btn-outline-secondary': !required && !valueMap,
        'btn-success': !!valueMap,
    });

    const clickHandler = () => {
        dispatch(setCurrentMapping({
            line: csvHeader,
            mapField: mapField,
            mapToValue: valueMap?.MappedValue ?? ''
        }));
    }


    return (
        <FormColumn label={mapFieldNames[mapField]}>
            <InputGroup bsSize="sm">
                {!!icon && (
                    <div className="input-group-text">
                        <span className={icon} />
                    </div>
                )}
                <div className="input-group-text">{valueMap?.CustomerValue ?? ''}</div>
                <input type="text" className="form-control form-control-sm" readOnly
                       value={valueMap?.MappedValue ?? ''} />
                <button className={buttonClassName} onClick={clickHandler}>Mapping</button>
            </InputGroup>
        </FormColumn>

    )
}

export default MappedOrderValue;
