import React from 'react';
import {SPSCustomerMapField} from "sps-integration-types";

const CustomerFieldsList = ({fields}: {
    fields: SPSCustomerMapField[];
}) => {
    return (
        <>
            {[...fields]
                // .sort((a, b) => a.field > b.field ? 1 : -1)
                .map(f => (
                <div className="d-flex justify-content-between font-monospace" key={f.field}>
                    <div className="text-secondary">{f.field}</div>
                    <div className="text-success">{JSON.stringify(f.value)}</div>
                </div>
            ))}
        </>
    )
}

export default CustomerFieldsList;
