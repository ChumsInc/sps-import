import React from 'react';
import {Nav, NavProps} from "react-bootstrap";

export default function AppNav({activeKey, onSelect, ...props}:NavProps) {
    return (
        <Nav variant="tabs" activeKey={activeKey} onSelect={onSelect} {...props}>
            <Nav.Item>
                <Nav.Link eventKey="customer">Current Map</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="csv">Show CSV</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="so">Sales Order Values</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="customer_list">Customer List</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="customer_maps">Customer Mapping</Nav.Link>

            </Nav.Item>
        </Nav>
    )
}
