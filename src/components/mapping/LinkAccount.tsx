import React from 'react';
import CustomerLookup from "../CustomerLookup";
import MapToCustomer from "./MapToCustomer";
import MappingTitle from "./MappingTitle";

const LinkAccount = () => {
    return (
        <div>
            <MappingTitle title="Map To Account"/>
            <CustomerLookup/>
            <MapToCustomer/>
        </div>
    );
}
export default LinkAccount;
