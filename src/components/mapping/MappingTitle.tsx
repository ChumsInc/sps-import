import React from "react";
import CloseMappingButton from "./CloseMappingButton";

const MappingTitle = ({title}: { title: string }) => {

    return (
        <div className="row g-3 align-items-baseline">
            <div className="col">
                <h2>{title}</h2>
            </div>
            <div className="col-auto">
                <CloseMappingButton />
            </div>
        </div>
    )
}

export default MappingTitle;
