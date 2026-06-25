import {type AlertProps, Badge} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import {useAppDispatch} from "@/app/configureStore";
import {dismissAlert} from "@chumsinc/alert-list";

export interface ContextAlertProps extends AlertProps {
    context?: string;
    count?: number;
    message?: string;
}

export default function ContextAlert({context, count, message, variant, children, ...props}: ContextAlertProps) {
    const dispatch = useAppDispatch();

    const onDismiss = () => {
        dispatch(dismissAlert({context}));
    }
    return (
        <Alert variant={variant} {...props} onClose={onDismiss}>
            {context && <Alert.Heading>
                {context}
                {(count ?? 0) > 1 && (<Badge bg={variant}>{count}</Badge>)}
            </Alert.Heading>}
            {message ?? children}
        </Alert>
    )
}
