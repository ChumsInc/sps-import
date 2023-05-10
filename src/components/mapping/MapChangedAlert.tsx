import React from "react";
import {Alert} from "chums-components";

const MapChangedAlert = ({changed, children}:{changed?:boolean, children?:React.ReactNode}) => {
    if (!changed) {
        return null;
    }
    return (
        <Alert color="warning">
            <span className="bi-exclamation-triangle-fill me-2" />
            {children ?? "Don't forget to save your changes"}
        </Alert>
    )
}

export default MapChangedAlert;
