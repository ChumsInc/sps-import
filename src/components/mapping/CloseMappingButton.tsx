import React from "react";
import {useAppDispatch, useAppSelector} from "../../app/configureStore";
import {selectCurrentMappingTool} from "../../ducks/mapping/mapping-selectors";
import {closeSelectedMapping} from "../../ducks/mapping/mapping-actions";

const CloseMappingButton = () => {
    const dispatch = useAppDispatch();
    const selectedMappingTool = useAppSelector(selectCurrentMappingTool);
    const closeHandler = () => dispatch(closeSelectedMapping())

    if (!selectedMappingTool) {
        return null;
    }
    return (
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <button className="btn-close" onClick={closeHandler}/>
        </div>
    )
}

export default CloseMappingButton;
