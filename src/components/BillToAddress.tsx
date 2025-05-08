import React from 'react';
import {Alert} from "react-bootstrap";
import {SPSCustomerBillingAddress} from 'sps-integration-types'

const BillToAddress = ({address}: { address?: SPSCustomerBillingAddress|null }) => {
    if (!address) {
        return (
            <Alert color="warning">Missing Billing Address</Alert>
        )
    }
    const {
        CustomerName,
        AddressLine1,
        AddressLine2,
        AddressLine3,
        City,
        State,
        ZipCode,
        CountryCode
    } = address;
    const AddressLines = [AddressLine1, AddressLine2, AddressLine3];
    if (!CustomerName || !AddressLine1) {
        return (
            <Alert variant="warning">Missing Billing Address</Alert>
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
