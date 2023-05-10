import React, {useState} from 'react';
import {FormCheck} from "chums-components";
import {useAppSelector} from "./configureStore";
import {JSONView} from "@chumsinc/json-view";
import {selectCSVLines} from "../ducks/csv-import/csv-import-selectors";

const CSVLinesView = () => {
    const [showEmpty, setShowEmpty] = useState(false);
    const csvLines = useAppSelector(selectCSVLines);

    let data = [...csvLines];
    if (!showEmpty) {
        data = data.map(line => {
            const obj = {...line};
            Object.keys(obj)
                .filter(key => String(obj[key]).trim() === '')
                .forEach(key => {
                    delete obj[key];
                });
            return obj;
        });
    }
    return (
        <div>
            <FormCheck type="checkbox" label="Show Empty Values" inline checked={showEmpty}
                       onClick={() => setShowEmpty(!showEmpty)}/>
            <JSONView data={data} defaultOpenLevels={1}/>

        </div>
    );
}

export default CSVLinesView;
