import React, {DragEvent, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {parseFile} from '../ducks/csv-import/csv-import-actions';
import classNames from 'classnames';
import {selectProcessing} from "../ducks/csv-import/csv-import-selectors";
import {useAppDispatch} from "../app/configureStore";
import {LoadingProgressBar} from "chums-components";

const CSVDropTarget = () => {
    const dispatch = useAppDispatch();
    const processing = useSelector(selectProcessing);
    const [file, setFile] = useState<File | null>(null);
    const [highlight, setHighlight] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const onDrop = (ev: DragEvent<HTMLDivElement>) => {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        ev.stopPropagation();
        const file = getFile(ev);
        if (file) {
            setFile(file);
            dispatch(parseFile(file))
        }
    }

    const getFile = (ev: DragEvent<HTMLDivElement>) => {
        let file: File | null = null;
        if (ev.dataTransfer?.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    file = ev.dataTransfer.items[i].getAsFile();
                }
            }
        } else if (ev.dataTransfer?.files) {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer?.files?.length; i++) {
                file = ev.dataTransfer.files[i];
            }
        }
        return file;
    }

    const onFilesSelected = () => {

        if (fileInputRef?.current?.files && fileInputRef.current.files.length) {
            const [file] = fileInputRef.current?.files;
            setFile(file);
            dispatch(parseFile(file));
        }
    }

    const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
    }

    const onDragEnter = (ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        setHighlight(true);
    }

    const onDragLeave = (ev: DragEvent<HTMLDivElement>) => {
        ev.stopPropagation();
        ev.preventDefault();
        setHighlight(false);
    }

    const className = classNames('rounded border form-control form-control-lg', {
        'border-secondary': !highlight,
        'border-primary': highlight,
        'background-info': highlight,
    });

    const sendFileHandler = () => {
        if (!file) {
            return;
        }
        dispatch(parseFile(file));
    }

    return (
        <div>
            <div className="row g-3 mb-1">
                <div className="col">
                    <div id="drop-zone" className={className}
                         onClick={() => fileInputRef.current?.click()}
                         onDrop={onDrop}
                         onDragOver={onDragOver}
                         onDragEnter={onDragEnter}
                         onDragLeave={onDragLeave}>
                        <input type="file" ref={fileInputRef} onChange={onFilesSelected} style={{display: 'none'}}
                               accept=".csv,application/csv,application/vnd.ms-excel"/>
                        <div className="text-muted drop-target">{file ? file.name : 'Drop File Here'}</div>
                    </div>
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-lg btn-primary" onClick={sendFileHandler}
                            disabled={!file}>
                        Test File
                    </button>

                </div>
            </div>
            {processing && <LoadingProgressBar striped animated/>}
        </div>
    );
}

export default CSVDropTarget;
