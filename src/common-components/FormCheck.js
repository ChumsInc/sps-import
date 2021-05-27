import React from 'react';
import classNames from 'classnames';

const FormCheck = ({label, checked, onClick, inline = false, className = {}, type="checkbox"}) => {
    return (
        <div className={classNames("form-check-inline", className, {"form-check-inline": inline})}>
            <input type={type} className="form-check-input" checked={checked}
                   onChange={onClick}/>
            <label className="form-check-label"
                   onClick={onClick}>
                {label}
            </label>
        </div>
    )
};

export default FormCheck;
