import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {SPSValueMap} from "sps-integration-types";
import {selectCurrentMap, selectMapForValue} from "../../ducks/mapping/mapping-selectors";
import {Editable} from "chums-types";
import {CustomerMapField} from "../../appTypes";
import MappingTitle from "./MappingTitle";
import {FormColumn, InputGroup} from "chums-components";
import MapList from "../MapList";
import MapChangedAlert from "./MapChangedAlert";
import {saveCustomerValueMapping} from "../../ducks/mapping/mapping-actions";

const defaultMap: SPSValueMap = {
    id: 0,
    MapField: 'ItemCode',
    CSVField: 'Vendor Style',
    CustomerValue: '',
    MappedValue: null,
    MappedOptions: {},
}
const MapToItemCode = () => {
    const dispatch = useAppDispatch();
    const currentMap = useAppSelector(selectCurrentMap);
    const mapForValue = useAppSelector(selectMapForValue);
    const [map, setMap] = useState<SPSValueMap & Editable>({
        ...defaultMap,
        CustomerValue: mapForValue,
    });

    useEffect(() => {
        if (currentMap) {
            setMap({...currentMap});
        } else {
            setMap({...defaultMap, CustomerValue: mapForValue});
        }
    }, [currentMap, mapForValue]);

    const onClickMapField = (mapField: CustomerMapField) => {
        setMap({...map, CSVField: mapField.field, CustomerValue: mapField.value, changed: true});
    }

    const itemChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setMap({...map, MappedValue: ev.target.value, changed: true})
    }

    const setConversionFactor = (ev: ChangeEvent<HTMLInputElement>) => {
        const options = map.MappedOptions ?? {};
        setMap({...map, MappedOptions: {...options, conversionFactor: ev.target.valueAsNumber ?? 1}, changed: true});
    }

    const setUOMOverride = (ev: ChangeEvent<HTMLInputElement>) => {
        const options = map.MappedOptions ?? {};
        setMap({...map, MappedOptions: {...options, UOMOverride: ev.target.value}, changed: true});
    }

    const submitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        if (map.MappedOptions && !map.MappedOptions.conversionFactor) {
            map.MappedOptions.conversionFactor = 1;
        }
        if (!!map.CustomerValue && !!map.MappedValue) {
            dispatch(saveCustomerValueMapping(map));
        }
    }

    return (
        <div>
            <MappingTitle title="Map to Item Code"/>
            <form onSubmit={submitHandler}>
                <FormColumn label="Map From" width={8}>
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">{map.CSVField}</div>
                        <input type="text" className="form-control form-control-sm" readOnly
                               value={map?.CustomerValue ?? ''}/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Map To" width={8}>
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">
                            Sage Item Code
                        </div>
                        <input type="text" className="form-control form-control-sm"
                               onChange={itemChangeHandler}
                               value={map.MappedValue ?? ''}/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="Conversion">
                    <InputGroup bsSize="sm">
                        <div className="input-group-text">Conversion Factor</div>
                        <input type="number" value={map.MappedOptions?.conversionFactor ?? ''} required
                               min={1} onChange={setConversionFactor} className="form-control form-control-sm"/>
                        <div className="input-group-text">U/M</div>
                        <input type="text" value={map.MappedOptions?.UOMOverride ?? ''}
                               onChange={setUOMOverride} className="form-control form-control-sm"/>
                    </InputGroup>
                </FormColumn>
                <FormColumn label="" width={8}>
                    <div className="row g-3 align-items-baseline">
                        <div className="col-auto">
                            <button type="submit" className="btn btn-sm btn-primary"
                                    disabled={!map.CustomerValue || !map.MappedValue}>
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
            <h3>Select Field for Mapping</h3>
            <MapList type="radio" csvFields={[map.CSVField]} onChange={onClickMapField}/>
        </div>
    )
}

export default MapToItemCode;
