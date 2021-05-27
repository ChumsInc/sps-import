import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {noop} from "../constants/utils";
import {saveCustomerMapping, updateCustomerMapping} from '../actions/mapping';
import {defaultDateMap, defaultValueMap, mapForFieldTitles} from "../constants/mapping";
import MapList from "./MapList";
import MapSaveButton from "./MapSaveButton";
import {ImportMapPropType} from "../constants/myPropTypes";


const defaultMap = {
    ...defaultValueMap,
    MappedValue: {
        add: 0,
    }
};

class MapToDateField extends Component {
    static propTypes = {
        mapForField: PropTypes.string,
        selectedMap: ImportMapPropType,
        onChange: PropTypes.func,
        onSave: PropTypes.func,
        updateCustomerMapping: PropTypes.func.isRequired,
        saveCustomerMapping: PropTypes.func.isRequired,
    };

    static defaultProps = {
        mapForField: '',
        selectedMap: {...defaultDateMap},
    };

    state = {
        showAllLines: false,
    };

    constructor(props) {
        super(props);
        this.onClickItem = this.onClickItem.bind(this);
        this.onChangeDays = this.onChangeDays.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.fixMappingError = this.fixMappingError.bind(this);
    }

    componentDidMount() {
        this.fixMappingError();
    }

    componentDidUpdate(prevProps, prevState) {
        this.fixMappingError();
    }

    fixMappingError() {
        if (this.props.selectedMap.MappedOptions === undefined) {
            this.props.updateCustomerMapping({CustomerValue: '', MappedOptions: {add: 0}});
            return;
        }
        if (this.props.selectedMap.CustomerValue !== '') {
            this.props.updateCustomerMapping({CustomerValue: ''});
        }
    }

    onClickItem({field, value}) {
        console.log(field, value);
        const {mapForField} = this.props;
        this.props.updateCustomerMapping({MapField: mapForField, CSVField: field, CustomerValue: ''});
    }

    onChangeDays({value}) {
        const MappedOptions = this.props.selectedMap.MappedOptions || {};
        MappedOptions.add = Number(value);
        this.props.updateCustomerMapping({MappedOptions});
    }

    onSubmit(ev) {
        ev.preventDefault();
        const {selectedMap} = this.props;
        this.props.saveCustomerMapping(selectedMap);
    }

    render() {
        const {mapForField, selectedMap} = this.props;
        return (
            <div>
                <h3>Map To Date field</h3>
                <form onSubmit={this.onSubmit}>
                    <FormGroupTextInput onChange={noop} value={mapForFieldTitles[mapForField] || mapForField || ''}
                                        label="Map For" colWidth={8} readOnly/>
                    <FormGroupTextInput onChange={noop} value={selectedMap.CSVField || ''}
                                        label="Map To" colWidth={8} readOnly/>
                    <FormGroupTextInput onChange={this.onChangeDays} type="number" value={(selectedMap.MappedOptions || {}).add || 0}
                                        label="Days to Add" colWidth={8}/>
                    <MapSaveButton map={selectedMap} onClick={this.onSave}/>
                </form>
                <hr/>
                <h3>Select Field for {mapForFieldTitles[mapForField]}</h3>
                <MapList csvField={[selectedMap.CSVField]} onChange={this.onClickItem} defaultFilter={/date/i}/>
            </div>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {mapForField, selectedMap} = mapping;
    return {mapForField, selectedMap};
};

const mapDispatchToProps = {updateCustomerMapping, saveCustomerMapping};

export default connect(mapStateToProps, mapDispatchToProps)(MapToDateField)
