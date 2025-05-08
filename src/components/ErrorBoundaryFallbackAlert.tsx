import React from 'react';
import {FallbackProps} from "react-error-boundary";
import {Alert} from "react-bootstrap";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            <div className="text-light">
                {error.message}
            </div>
        </Alert>
    )
}
