import React from 'react';
import classNames from "classnames";

const MaterialIcon = ({size = 18, children}) => {
    const iconClassName = `md-${size}`;
    return (
        <span className={classNames('material-icons', iconClassName)} >{children}</span>
    )
};

export default MaterialIcon;
