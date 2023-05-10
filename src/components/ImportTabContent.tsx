import React, {useRef} from 'react';
import CSVDropTarget from "./CSVDropTarget";
import ImportTestResult from "./sales-order/ImportTestResult";

const ImportTabContent = () => {
    const dragRef = useRef<HTMLDivElement | null>(null);

    const dragEnterHandler = () => {
        dragRef.current?.scrollTo(0, 0);
    }


    return (
        <div className="csv-parsed" onDragEnter={dragEnterHandler} ref={dragRef}>
            <CSVDropTarget/>
            <ImportTestResult/>
        </div>
    );
}

export default ImportTabContent;
