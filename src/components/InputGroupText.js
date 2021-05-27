import React from 'react';
import TextInput from "../common-components/TextInput";
import classNames from 'classnames';

const InputGroupText = ({type="text", field, value, onChange, readOnly = false, disabled = false, buttonText = "Mapping", buttonClassName = 'btn-secondary', onClickButton, children}) => {
    return (
        <div className="input-group input-group-sm">
            <TextInput type={type} field={field} value={value} onChange={onChange} readOnly={readOnly}/>
            {!!children && (
                <div className="input-group-append">
                    {children}
                </div>
            )}
            <div className="input-group-append">
                <button className={classNames("btn btn-sm", buttonClassName)}
                        disabled={disabled}
                        onClick={() => onClickButton({field, value})}>
                    {buttonText}
                </button>
            </div>
        </div>
    )
}

export default InputGroupText;
