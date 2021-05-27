import React from 'react';
import Alert from "../common-components/Alert";

const ShipToAddress = ({ShipToCode,
                           ShipToName,
                           ShipToAddress1,
                           ShipToAddress2,
                           ShipToAddress3,
                           ShipToCity,
                           ShipToState,
                           ShipToZipCode,
                           ShipToCountryCode}) => {
    const AddressLines = [ShipToAddress1, ShipToAddress2, ShipToAddress3];
    if (!ShipToName || !ShipToAddress1) {
        return (
            <Alert type="warning">Missing Ship-To Address</Alert>
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
