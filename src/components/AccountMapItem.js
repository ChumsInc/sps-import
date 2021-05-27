import React from 'react';
import classNames from 'classnames';
import FormCheck from "../common-components/FormCheck";

const AccountMapItem = ({field, value, selected = false, onChange, match = true, type="checkbox"}) => {
    const className = {'text-danger': selected && !match, 'text-success': selected && match};
    return (
        <div className="form-row">
            <div className="col-6">
                <FormCheck label={field} onClick={() => onChange({field, value})} checked={selected} inline className={className} type={type}/>
            </div>
            <div className={classNames("col-6", className)}>{JSON.stringify(value)}</div>
        </div>
    )
};

export default AccountMapItem;
