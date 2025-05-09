import React from 'react';
import {Alert} from "react-bootstrap";
import {useAppSelector} from "@/app/configureStore";
import {selectImportResult} from "@/ducks/csv-import/csv-import-selectors";

const ImportResult = () => {
    const importResponse = useAppSelector(selectImportResult);

    if (!importResponse) {
        return null;
    }

    const {SalesOrderNo, success, response, error, exception} = importResponse;
    return (
        <div>
            {!!SalesOrderNo && (
                <Alert variant="success" title="Yay!">Imported as &quot;{SalesOrderNo}&quot;</Alert>
            )}
            {success === false && (
                <Alert variant="danger" title="Error:">{error}</Alert>
            )}
            {!!response && Object.keys(response).length > 0 && (
                <pre className="csv-lines--debug">
                    <code>
                        {JSON.stringify(response, undefined, 2)}
                    </code>
                </pre>
            )}
            {!!exception && (
                <pre>{exception}</pre>
            )}
        </div>
    );
}
export default ImportResult;
