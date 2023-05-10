import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentMap, selectMapForField} from "../../ducks/mapping/mapping-selectors";
import {SPSValueMap} from "sps-integration-types";
import {Editable} from "chums-types";
import {CustomerMapField} from "../../appTypes";
import {saveCustomerValueMapping} from "../../ducks/mapping/mapping-actions";
import {FormColumn, InputGroup} from "chums-components";
import {mapFieldNames} from "./field-names";
import {mappedDate} from "./utils";
import MapList from "../MapList";
import CloseMappingButton from "./CloseMappingButton";
import MappingTitle from "./MappingTitle";

const defaultMap:SPSValueMap = {
    id: 0,
    MapField: 'ShipToCode',
    CSVField: '',
    CustomerValue: '',
    MappedValue: null,
    MappedOptions: null,
}
const MapToValue = () => {
    const dispatch = useAppDispatch();
    const mapForField = useAppSelector(selectMapForField);
    const currentMap = useAppSelector(selectCurrentMap);

    const [map, setMap] = useState<SPSValueMap & Editable>({
        ...defaultMap,
        MapField: mapForField ?? defaultMap.MapField,
    })

    useEffect(() => {
        if (currentMap) {
            setMap({...currentMap});
        } else {
            setMap({...defaultMap, MapField: mapForField ?? defaultMap.MapField})
        }
    }, [mapForField, currentMap]);

    const onClickMapField = (mapField: CustomerMapField) => {
        setMap({...map, CSVField: mapField.field, CustomerValue: mapField.value, changed: true});
    }

    const changeHandler = (ev:ChangeEvent<HTMLInputElement>) => {
        setMap({...map, MappedValue: ev.target.value, changed: true});
    }

    const onSubmit = (ev: FormEvent) => {
        ev.preventDefault();
        if (!!map.MapField && !!map.CSVField) {
            dispatch(saveCustomerValueMapping(map));
        }
        // dispatch(saveCustomerMapping(selectedMap));
    }

    if (!mapForField) {
        return null;
    }

    return (
        <div>
            <MappingTitle title={`Map To ${mapFieldNames[mapForField]}`} />

            <form onSubmit={onSubmit}>
                <FormColumn label="Map For Field" width={8}>
                    <input type="text" className="form-control form-control-sm" readOnly
                           value={mapFieldNames[mapForField]}/>
                </FormColumn>
                <FormColumn label="Map To Field" width={8}>
                    <InputGroup bsSize="sm">
                        <input type="text" className="form-control form-control-sm" readOnly value={map.CSVField}/>
                        <div className="input-group-text">EDI Value</div>
                        <div className="input-group-text">{map.CustomerValue}</div>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Map to Value">
                    <input type="text" className="form-control form-control-sm" value={map.MappedValue ?? ''}
                           onChange={changeHandler} />
                    <small className="text-muted">Enter a valid <strong>Sage</strong> value</small>
                </FormColumn>
                <FormColumn label="" width={8}>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={!map.changed || !map.CSVField}>
                        Save
                    </button>
                </FormColumn>
            </form>
            <hr/>
            <h3>Select Field for {mapFieldNames[mapForField]}</h3>
            <MapList type="radio" csvFields={[map.CSVField]} onChange={onClickMapField}/>
        </div>
    );
}

export default MapToValue;
