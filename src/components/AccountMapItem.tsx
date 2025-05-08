import React, {ChangeEvent, useId} from 'react';
import classNames from 'classnames';
import {FormCheck} from "react-bootstrap";
import {SPSCustomerMapField} from "sps-integration-types";

export interface AccountMapItemProps {
    map: SPSCustomerMapField;
    checked: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
    match?: boolean;
    type: 'checkbox' | 'radio';
}

const AccountMapItem = ({map, checked = false, onChange, match = true, type = "checkbox"}: AccountMapItemProps) => {
    const className = classNames({'text-danger': checked && !match, 'text-success': checked && match});
    const id = useId();
    return (
        <div className="row g-3">
            <div className="col-3">
                <FormCheck type={type} label={map.field} id={id}
                           inline className={className}
                           checked={checked} onChange={onChange}
                />
            </div>
            <div className={classNames("col-9", className)}>{JSON.stringify(map.value)}</div>
        </div>
    )
};

export default AccountMapItem;
