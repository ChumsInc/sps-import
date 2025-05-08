import React from 'react';
import {Alert} from "react-bootstrap";
import {SPSCustomerShipToAddress} from "sps-integration-types";

const ShipToAddress = ({address}:{address?: SPSCustomerShipToAddress|null}) => {
    if (!address) {
        return (
            <Alert color="warning">Missing Ship-To Address</Alert>
        )
    }
    const {ShipToName,
        ShipToAddress1,
        ShipToAddress2,
        ShipToAddress3,
        ShipToCity,
        ShipToState,
        ShipToZipCode,
        ShipToCountryCode} = address;
    const AddressLines = [ShipToAddress1, ShipToAddress2, ShipToAddress3];
    if (!ShipToName || !ShipToAddress1) {
        return (
            <Alert variant="warning">Missing Ship-To Address</Alert>
        )
    }
    return (
        <address>
            <div>{ShipToName || 'missing'}</div>
            {AddressLines.filter(val => !!val).map((line, index) => (<div key={index}>{line}</div>))}
            <div>{[ShipToCity, ShipToState, ShipToZipCode].filter(val => !!val).join(', ')}</div>
            {!['US', 'USA'].includes(ShipToCountryCode) && <div>{ShipToCountryCode}</div>}
        </address>
    )
};

export default ShipToAddress;
