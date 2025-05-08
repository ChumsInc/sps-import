import React from 'react';
import {SPSCustomerKey} from "sps-integration-types";
import {useAppSelector} from "@/app/configureStore";
import {selectCustomerList} from "./customer-selectors";
import {isSameCustomer} from "./customer-utils";
import {Alert} from "react-bootstrap";

const ExistingCustomerAlert = ({newCustomer}: { newCustomer: SPSCustomerKey }) => {
    const list = useAppSelector(selectCustomerList);
    const [customer] = list.filter(c => isSameCustomer(c, newCustomer));
    if (!customer) {
        return null
    }
    return (
        <Alert variant="danger">
            <span className="bi-exclamation-triangle-fill me-3"/>
            Warning: this customer is already configured. Saving this map will override the existing mapping.
        </Alert>
    )
}
export default ExistingCustomerAlert;
