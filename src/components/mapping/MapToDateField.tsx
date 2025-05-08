import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import MapList from "../MapList";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentMap, selectMapForField} from "../../ducks/mapping/mapping-selectors";
import {SPSValueMap} from "sps-integration-types";
import {Editable} from "chums-types";
import {CustomerMapField} from "../../appTypes";
import {FormColumn} from "chums-components";
import {mapFieldNames} from "./field-names";
import {mappedDate} from "./utils";
import {saveCustomerValueMapping} from "../../ducks/mapping/mapping-actions";
import MappingTitle from "./MappingTitle";
import MapChangedAlert from "./MapChangedAlert";
import InputGroup from "react-bootstrap/InputGroup";

const defaultMap: SPSValueMap = {
    id: 0,
    MapField: 'ShipExpireDate',
    CSVField: '',
    CustomerValue: '',
    MappedValue: null,
    MappedOptions: null,
}
const MapToDateField = () => {
    const dispatch = useAppDispatch();
    const mapForField = useAppSelector(selectMapForField);
    const currentMap = useAppSelector(selectCurrentMap);
    const [days, setDays] = useState(currentMap?.MappedOptions?.add ?? 0);

    const [map, setMap] = useState<SPSValueMap & Editable>({
        ...defaultMap,
        MapField: mapForField ?? defaultMap.MapField,
    });

    useEffect(() => {
        if (currentMap) {
            setMap({...currentMap});
            setDays(currentMap.MappedOptions?.add ?? 0);
        } else {
            setMap({
                ...defaultMap,
                MapField: mapForField ?? defaultMap.MapField,
            });
        }
    }, [mapForField, currentMap]);

    const onClickMapField = (mapField: CustomerMapField) => {
        setMap({...map, CSVField: mapField.field, CustomerValue: mapField.value, changed: true});
    }

    const onChangeDays = (ev: ChangeEvent<HTMLInputElement>) => {
        setDays(ev.target.valueAsNumber);
        const options = map.MappedOptions ?? {};
        setMap({...map, MappedOptions: {...options, add: ev.target.valueAsNumber}, changed: true});
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
            <MappingTitle title={`Map To ${mapFieldNames[mapForField]}`}/>
            <form onSubmit={onSubmit}>
                <FormColumn label="Map For Field" width={8}>
                    <input type="text" className="form-control form-control-sm" readOnly
                           value={mapFieldNames[mapForField]}/>
                </FormColumn>
                <FormColumn label="Map To Field" width={8}>
                    <InputGroup size="sm">
                        <input type="text" className="form-control form-control-sm" readOnly value={map.CSVField}/>
                        <InputGroup.Text>EDI Value</InputGroup.Text>
                        <InputGroup.Text>{map.CustomerValue}</InputGroup.Text>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Options" width={8}>
                    <InputGroup size="sm">
                        <InputGroup.Text>Add Days</InputGroup.Text>
                        <input type="number" className="form-control form-control-sm" value={days}
                               onChange={onChangeDays}/>
                        <InputGroup.Text>{mappedDate(map.CustomerValue, days)}</InputGroup.Text>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="" width={8}>
                    <div className="row g-3 align-items-baseline">
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary"
                                    disabled={!map.changed || !map.CSVField}>
                                Save
                            </button>
                        </div>
                        <div className="col">
                            <MapChangedAlert changed={map.changed}/>
                        </div>
                    </div>
                </FormColumn>
            </form>
            <hr/>
            <h3>Select Field for {mapFieldNames[mapForField]}</h3>
            <MapList defaultFilter={/date/i} type="radio" csvFields={[map.CSVField]} onChange={onClickMapField}/>
        </div>
    );
}
export default MapToDateField;
