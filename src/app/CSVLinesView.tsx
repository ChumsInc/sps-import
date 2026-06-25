import {type ChangeEvent, useId, useState} from 'react';
import {FormCheck} from "react-bootstrap";
import {useAppSelector} from "./configureStore";
import {selectCSVLines} from "@/ducks/csv-import/csv-import-selectors";
import type {SPSOrderLine} from "chums-types/edi";
import {JSONView} from "@chumsinc/json-view";
import {useDocumentColorScheme} from "@chumsinc/ui-utils";

const CSVLinesView = () => {
    const [showEmpty, setShowEmpty] = useState(false);
    const csvLines = useAppSelector(selectCSVLines);
    const colorScheme = useDocumentColorScheme();
    const id = useId();

    let data = [...csvLines];
    if (!showEmpty) {
        data = data.map(line => {
            const obj:SPSOrderLine = {};
            Object.keys(line)
                .filter(key => String(line[key]).trim() !== '')
                .forEach(key => {
                    obj[key] = line[key];
                })
            return obj;
        });
    }

    return (
        <div>
            <FormCheck type="checkbox" checked={showEmpty ?? false} id={id}
                       label="Show Empty Values" inline
                       onChange={(ev: ChangeEvent<HTMLInputElement>) => setShowEmpty(ev.target.checked)}/>
            <JSONView data={data} defaultOpenLevels={1} dark={colorScheme === 'dark'} />
        </div>
    );
}

export default CSVLinesView;
