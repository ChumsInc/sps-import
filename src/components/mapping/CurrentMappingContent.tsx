import React from 'react';
import LinkAccount from "./LinkAccount";
import MapToDateField from "./MapToDateField";
import MapToValue from "./MapToValue";
import ImportResult from "../ImportResult";
import MapToItemCode from "./MapToItemCode";
import {useAppSelector} from "../../app/configureStore";
import {selectCurrentMappingTool} from "../../ducks/mapping/mapping-selectors";
import {Alert} from "react-bootstrap";

const ImportTabContent = () => {
    const selectedMappingTool = useAppSelector(selectCurrentMappingTool);
    return (
        <div className="col-mapping-tool">
            <ImportResult/>
            <div>
                {selectedMappingTool === 'Customer' && (<LinkAccount/>)}
                {selectedMappingTool === 'ShipExpireDate' && (<MapToDateField/>)}
                {selectedMappingTool === 'CancelDate' && (<MapToDateField/>)}
                {selectedMappingTool === 'Import' && <ImportResult/>}

                {selectedMappingTool === 'ShipToCode' && (<MapToValue/>)}
                {selectedMappingTool === 'ShipVia' && (<MapToValue/>)}
                {selectedMappingTool === 'ItemCode' && (<MapToItemCode/>)}
                {!selectedMappingTool && (<Alert variant="info">Select a mapping button</Alert>)}
            </div>
        </div>
    );
}
export default ImportTabContent;
