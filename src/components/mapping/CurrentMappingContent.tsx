import React from 'react';
import LinkAccount from "./LinkAccount";
import MapToDateField from "./MapToDateField";
import MapToValue from "./MapToValue";
import ImportResult from "../ImportResult";
import MapToItemCode from "./MapToItemCode";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentMappingTool, selectMapForField} from "../../ducks/mapping/mapping-selectors";
import {Alert} from "chums-components";
import {closeSelectedMapping} from "../../ducks/mapping/mapping-actions";

const ImportTabContent = () => {
    const dispatch = useAppDispatch();
    const selectedMappingTool = useAppSelector(selectCurrentMappingTool);
    const mapForField = useAppSelector(selectMapForField);
    const closeHandler = () => dispatch(closeSelectedMapping())
    return (
        <div className="col-mapping-tool">
            <ImportResult/>
            <div>
                {selectedMappingTool === 'Customer' && (<LinkAccount/>)}
                {selectedMappingTool === 'ShipExpireDate' && (<MapToDateField/>)}
                {selectedMappingTool === 'CancelDate' && (<MapToDateField/>)}

                {selectedMappingTool === 'ShipToCode' && (<MapToValue/>)}
                {selectedMappingTool === 'ShipVia' && (<MapToValue/>)}
                {selectedMappingTool === 'ItemCode' && (<MapToItemCode/>)}
                {!selectedMappingTool && (<Alert color="info">Select a mapping button</Alert>)}
            </div>
        </div>
    );
}
export default ImportTabContent;
