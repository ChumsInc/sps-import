import React from 'react';
import Alert from "../common-components/Alert";

const MapSaveButton = ({map = {}}) => {
    return (
        <div className="form-row">
            <div className="col-4">
                <button type="submit" className="btn btn-sm btn-primary"
                        disabled={!map.MapField || !map.CSVField || !map.changed}>
                    Save Mapping
                </button>
            </div>
            <div className="col-8">
                {map.changed && (<Alert message="Don't forget to save." type="warning"/>)}
            </div>
        </div>
    )
};

export default MapSaveButton;
