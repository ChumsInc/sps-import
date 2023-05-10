import React, {ChangeEvent} from 'react';
import classNames from 'classnames';
import {FormCheck} from "chums-components";
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
    return (
        <div className="row g-3">
            <div className="col-3">
                <FormCheck label={map.field} onChange={onChange} checked={checked} inline className={className}
                           type={type}/>
            </div>
            <div className={classNames("col-9", className)}>{JSON.stringify(map.value)}</div>
        </div>
    )
};

export default AccountMapItem;
