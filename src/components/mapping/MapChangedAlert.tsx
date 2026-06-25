import {Alert} from "react-bootstrap";
import type {ReactNode} from "react";

const MapChangedAlert = ({changed, children}:{changed?:boolean, children?:ReactNode}) => {
    if (!changed) {
        return null;
    }
    return (
        <Alert variant="warning">
            <span className="bi-exclamation-triangle-fill me-2" />
            {children ?? "Don't forget to save your changes"}
        </Alert>
    )
}

export default MapChangedAlert;
