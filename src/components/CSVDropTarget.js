import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {setImportFile, sendFile} from '../actions/csv-import';
import classNames from 'classnames';
import ProgressBar from "../common-components/ProgressBar";

class CSVDropTarget extends Component {
    static propTypes = {
        file: PropTypes.shape({
            name: PropTypes.string,
            lastModified: PropTypes.number,
            size: PropTypes.number,
            type: PropTypes.string,
        }),
        processing: PropTypes.bool,
        setImportFile: PropTypes.func.isRequired,
        sendFile: PropTypes.func.isRequired,
    };

    static defaultProps = {
        file: null,
        processing: false,
    };

    state = {
        highlight: false,
    };

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.getFile = this.getFile.bind(this);
        this.onFilesSelected = this.onFilesSelected.bind(this);
        this.fileInputRef = createRef();
    }

    onDrop(ev) {
        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
        ev.stopPropagation();
        this.props.setImportFile(this.getFile(ev));
        this.props.sendFile();
    }

    getFile(ev) {
        let file = '';
        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.items.length; i++) {
                // If dropped items aren't files, reject them
                if (ev.dataTransfer.items[i].kind === 'file') {
                    const f = ev.dataTransfer.items[i].getAsFile();
                    file = f;
                }
            }
        } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < ev.dataTransfer.files.length; i++) {
                const f = ev.dataTransfer.files[i];
                file = f
            }
        }
        return file;
    }

    onFilesSelected() {
        const [file] = this.fileInputRef.current.files;
        this.props.setImportFile(file);
        this.props.sendFile();
    }

    onDragOver(ev) {
        ev.stopPropagation();
        ev.preventDefault();
    }

    onDragEnter(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.setState({highlight: true});
    }

    onDragLeave(ev) {
        ev.stopPropagation();
        ev.preventDefault();
        this.setState({highlight: false});
    }

    render() {
        const {file, processing} = this.props;
        const {highlight} = this.state;
        const className = classNames('rounded border', {'border-secondary': !highlight, 'border-primary': highlight, 'table-primary': highlight});

        return (
            <div>
                <div id="drop-zone" className={className}
                     onClick={() => this.fileInputRef.current.click()}
                     onDrop={this.onDrop}
                     onDragOver={this.onDragOver}
                     onDragEnter={this.onDragEnter}
                     onDragLeave={this.onDragLeave}>
                    <input type="file" ref={this.fileInputRef} onChange={this.onFilesSelected} style={{display: 'none'}} accept=".csv,application/csv,application/vnd.ms-excel"/>
                    <div className="text-muted drop-target">{file ? file.name : 'Drop File Here'}</div>
                </div>
                <button type="button" className="btn btn-sm btn-primary btn-block mt-3 mb-1" onClick={this.props.sendFile}  disabled={!file} >
                    Test File
                </button>
                {!!processing && <ProgressBar striped={true} label="Processing" />}
            </div>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {file, processing} = csvImport;
    return {
        file,
        processing,
    };
};

const mapDispatchToProps = {
    setImportFile,
    sendFile,
};

export default connect(mapStateToProps, mapDispatchToProps)(CSVDropTarget) 
