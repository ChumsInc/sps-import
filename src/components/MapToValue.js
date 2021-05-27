import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ImportMapPropType} from "../constants/myPropTypes";
import {defaultValueMap, mapForFieldTitles} from "../constants/mapping";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {noop} from "../constants/utils";
import {saveCustomerMapping, updateCustomerMapping,} from '../actions/mapping';
import MapList from "./MapList";
import Alert from "../common-components/Alert";
import MapSaveButton from "./MapSaveButton";

class MapToValue extends Component {
    static propTypes = {
        mapForField: PropTypes.string,
        mapForValue: PropTypes.string,
        selectedMap: ImportMapPropType,
        mappingData: PropTypes.object,
        defaultCSVField: PropTypes.string,

        updateCustomerMapping: PropTypes.func,
        saveCustomerMapping: PropTypes.func,
    };

    static defaultProps = {
        mapForField: '',
        mapForValue: '',
        selectedMap: {...defaultValueMap},
        mappingData: {},
        defaultCSVField: '',
    };

    state = {
        showAllLines: false,
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeMap = this.onChangeMap.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.handleMapErrors = this.handleMapErrors.bind(this);
    }

    handleMapErrors() {
        const {selectedMap, defaultCSVField, mapForField, mappingData} = this.props;
        if (selectedMap.CSVField === '' && defaultCSVField !== '') {
            this.props.updateCustomerMapping({
                MapField: mapForField,
                CSVField: defaultCSVField,
                CustomerValue: mappingData[defaultCSVField] || '',
            });
        }
    }

    componentDidMount() {
        this.handleMapErrors();
    }

    componentDidUpdate(prevProps, prevState) {
        this.handleMapErrors();
    }


    onSubmit(ev) {
        ev.preventDefault();
        const {selectedMap} = this.props;
        this.props.saveCustomerMapping(selectedMap);
    }

    onChangeMap({field, value}) {
        this.props.updateCustomerMapping({[field]: value});
    }

    onClickItem({field, value}) {
        const {mapForField} = this.props;
        this.props.updateCustomerMapping({MapField: mapForField, CSVField: field, CustomerValue: value});
    }

    render() {
        const {selectedMap, mappingData, mapForField, mapForValue} = this.props;
        const mapFilter = mapForField === 'ShipToCode' ? /ship to/i : null;
        return (
            <div>
                <h3>Map To Field & Value</h3>
                <form onSubmit={this.onSubmit}>
                    <FormGroupTextInput onChange={noop} value={mapForFieldTitles[mapForField] || mapForField || ''}
                                        label="Map For" colWidth={8} readOnly/>
                    <FormGroupTextInput onChange={noop} value={selectedMap.CSVField || ''}
                                        label="Map To" colWidth={8} readOnly/>
                    <FormGroupTextInput onChange={noop} value={selectedMap.CustomerValue || ''}
                                        label="Customer Value" colWidth={8} readOnly/>
                    <FormGroupTextInput field="MappedValue" onChange={this.onChangeMap}
                                        value={selectedMap.MappedValue || ''}
                                        label="Import Value" colWidth={8}/>
                    <MapSaveButton map={selectedMap} />
                </form>
                <hr/>
                <MapList csvField={[selectedMap.CSVField]} onChange={this.onClickItem} defaultFilter={mapFilter}/>
            </div>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {showValueMapping, maps, mappingData, mapForField, mapForValue, selectedMap, defaultCSVField} = mapping;
    return {showValueMapping, mappingData, mapForField, mapForValue, selectedMap, defaultCSVField};
};

const mapDispatchToProps = {updateCustomerMapping, saveCustomerMapping};

export default connect(mapStateToProps, mapDispatchToProps)(MapToValue) 
