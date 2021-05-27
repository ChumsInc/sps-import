import React from 'react';
import Alert from "../common-components/Alert";

const BillToAddress = ({CustomerName, AddressLine1, AddressLine2, AddressLine3, City, State, ZipCode, CountryCode}) => {
    const AddressLines = [AddressLine1, AddressLine2, AddressLine3];
    if (!CustomerName || !AddressLine1) {
        return (
            <Alert type="warning">Missing Billing Address</Alert>
        )
    }
    return (
        <address>
            <div>{CustomerName || 'missing'}</div>
            {AddressLines.filter(val => !!val).map((line, index) => (<div key={index}>{line}</div>))}
            <div>{[City, State, ZipCode].filter(val => !!val).join(', ')}</div>
            {!['US', 'USA'].includes(CountryCode) && <div>{CountryCode}</div>}
        </address>
    )
};

export default BillToAddress;
