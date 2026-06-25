import {Fragment, useState} from 'react';
import AccountMapItem from "./AccountMapItem";
import {useAppSelector} from "@/app/configureStore";
import {selectMappingData} from "@/ducks/mapping/mapping-selectors";
import {Col, Form, FormCheck, Row} from "react-bootstrap";
import type {CustomerMapField} from "../appTypes";

export interface MapListProps {
    csvFields: string[];
    type: 'radio' | 'checkbox';
    defaultFilter?: RegExp;
    onChange: (map: CustomerMapField) => void;
}

const MapList = ({csvFields, type = 'radio', defaultFilter, onChange}: MapListProps) => {
    const mappingData = useAppSelector(selectMappingData);
    const [showAllLines, setShowAllLines] = useState(false);

    if (!mappingData) {
        return null;
    }

    const hasFilter = defaultFilter instanceof RegExp;
    const values = Object.keys(mappingData)
        .filter(key => !/(_index|changed|loading)/i.test(key))
        .filter(key => showAllLines || (hasFilter ? defaultFilter.test(key) : String(mappingData[key]).trim() !== ''))
        .map(key => ({
            field: key,
            value: mappingData[key]
        }));
    const label = hasFilter ? 'Show Only Filtered Values' : 'Show Only Filled Values';
    return (
        <Fragment>
            <Form.Group as={Row} width={9}>
                <Form.Label column sm={3}>Show</Form.Label>
                <Col>
                    <FormCheck label={label} inline type="radio" checked={!showAllLines}
                               onChange={() => setShowAllLines(false)}/>
                    <FormCheck label="All Lines" inline type="radio" checked={showAllLines}
                               onChange={() => setShowAllLines(true)}/>
                </Col>
            </Form.Group>
            <div className="map-list">
                {values.map(map => (
                    <AccountMapItem key={map.field} type={type} map={map}
                                    checked={csvFields.includes(map.field)}
                                    onChange={(ev) => onChange({...map, checked: ev.target.checked})}/>
                ))}
            </div>
        </Fragment>
    );
}

export default MapList;
