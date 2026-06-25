import {Col, Form, type FormLabelProps, Row} from "react-bootstrap";
import type {ReactNode} from "react";

export interface FormColumnProps {
    label: string;
    labelProps?: FormLabelProps;
    width?: number;
    children: ReactNode;
}
export default function FormColumn({label, labelProps, width, children}:FormColumnProps) {
    const labelWidth = 12 - (width ?? 9);
    return (
        <Form.Group as={Row}>
            <Form.Label column sm={labelWidth} {...labelProps}>
                {label}
            </Form.Label>
            <Col>
                {children}
            </Col>
        </Form.Group>
    )
}
