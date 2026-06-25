import {Fragment, useEffect, useId, useState} from 'react';
import MapList from "../MapList";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {
    selectCustomerLookup,
    selectCustomerLookupChanged,
    selectCustomerLookupMap,
    selectCustomerOptions,
    selectMappingData
} from "../../ducks/mapping/mapping-selectors";
import type {CustomerMap, CustomerMapField} from "../../appTypes";
import {saveCustomerLookupMapping, setCustomerMap, toggleZeroCommissions} from "../../ducks/mapping/mapping-actions";
import MapChangedAlert from "./MapChangedAlert";
import {Col, Form, FormCheck, Row} from "react-bootstrap";

const MapToCustomer = () => {
    const dispatch = useAppDispatch();
    const customer = useAppSelector(selectCustomerLookup);
    const mappingData = useAppSelector(selectMappingData);
    const customerLookupMapping: CustomerMap = useAppSelector(selectCustomerLookupMap);
    const customerLookupChanged = useAppSelector(selectCustomerLookupChanged);
    const [showMappingOptions, setShowMappingOptions] = useState(Object.keys(customerLookupMapping).length === 0 || customerLookupChanged);
    const customerOptions = useAppSelector(selectCustomerOptions);
    const idZeroCommissions = useId();

    useEffect(() => {
        setShowMappingOptions(showMappingOptions || !Object.keys(customerLookupMapping).length || customerLookupChanged);
    }, [customerLookupMapping, customerLookupChanged])

    const onClickItem = (map: CustomerMapField) => {
        dispatch(setCustomerMap(map));
    }

    const savHandler = () => {
        if (!customer) {
            return;
        }
        dispatch(saveCustomerLookupMapping(customer))
    }

    return (
        <div>
            <h3>Mapped Fields</h3>
            <table className="table table-xs">
                <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                {!Object.keys(customerLookupMapping).length && (
                    <tr className="table-danger">
                        <td colSpan={2}>
                            Caution: No mapping data has been defined for this customer.
                        </td>
                    </tr>
                )}
                {Object.keys(customerLookupMapping).sort()
                    .map(key => (
                        <tr key={key}>
                            <td>{key}</td>
                            <td>{customerLookupMapping[key]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Form.Group as={Row}>
                <Form.Label column sm={3}>
                    Import with 0 Commission
                </Form.Label>
                <Col>
                    <FormCheck label={customerOptions.zeroCommissions ? 'Yes' : 'No'}
                               id={idZeroCommissions}
                               onChange={(ev) => dispatch(toggleZeroCommissions(ev.target.checked))}
                               type="checkbox" inline={true}
                               checked={customerOptions.zeroCommissions ?? false}/>
                </Col>
            </Form.Group>
            <Form.Group>
                <Form.Label column sm={3}></Form.Label>
                <div className="row g-3 align-items-baseline">
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-primary mr-3"
                                onClick={savHandler}
                                disabled={!Object.keys(customerLookupMapping).length}>
                            Save Mapping
                        </button>
                    </div>
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-secondary"
                                disabled={!customer || !mappingData || !Object.keys(mappingData).length}
                                onClick={() => setShowMappingOptions(!showMappingOptions)}>
                            Edit Mapping
                        </button>
                    </div>
                    <div className="col">
                        <MapChangedAlert changed={customerLookupChanged}/>
                    </div>
                </div>
            </Form.Group>

            {(Object.keys(customerLookupMapping).length === 0 || showMappingOptions) && (
                <Fragment>
                    <hr/>
                    <h3>Select fields to uniquely identify to this customer</h3>
                    <MapList type="checkbox" onChange={onClickItem} csvFields={Object.keys(customerLookupMapping)}/>
                </Fragment>
            )}
        </div>
    );
}

export default MapToCustomer;
