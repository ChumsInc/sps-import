import type {FallbackProps} from "react-error-boundary";
import {Alert} from "react-bootstrap";

export default function ErrorBoundaryFallbackAlert({error, resetErrorBoundary}: FallbackProps) {
    if (error instanceof Error) {
        return (
            <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
                <strong>Something went wrong!</strong>
                <div className="text-light">
                    {error.message}
                </div>
            </Alert>
        )
    }
    return (
        <Alert variant="danger" dismissible onClose={resetErrorBoundary}>
            <strong>Something went wrong!</strong>
            <div className="text-light">
                Unknown error.
            </div>
        </Alert>
    )
}
