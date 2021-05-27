import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {ImportMapPropType} from "../constants/myPropTypes";
import {defaultItemMap, defaultValueMap, mapForFieldTitles} from "../constants/mapping";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {noop} from "../constants/utils";
import {saveCustomerMapping, updateCustomerMapping,} from '../actions/mapping';
import MapList from "./MapList";
import Alert from "../common-components/Alert";
import MapSaveButton from "./MapSaveButton";

class MapToItemCode extends Component {
    static propTypes = {
        mapForField: PropTypes.string,
        selectedMap: ImportMapPropType,
        mappingData: PropTypes.object,
        defaultCSVField: PropTypes.string,

        updateCustomerMapping: PropTypes.func,
        saveCustomerMapping: PropTypes.func,
    };

    static defaultProps = {
        mapForField: '',
        selectedMap: {...defaultItemMap},
        mappingData: {},
        defaultCSVField: '',
    };

    state = {
        showAllLines: false,
    };

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeMappedOptions = this.onChangeMappedOptions.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.handleMapErrors = this.handleMapErrors.bind(this);
        this.onChangeItemCode = this.onChangeItemCode.bind(this);
    }

    handleMapErrors() {
        const {selectedMap, defaultCSVField, mapForField, mappingData} = this.props;
        if (selectedMap.CSVField === '' && defaultCSVField !== '') {
            this.props.updateCustomerMapping({
                MapField: mapForField,
                CSVField: defaultCSVField,
                CustomerValue: mappingData[defaultCSVField]
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

    onChangeMappedOptions({field, value}) {
        const {selectedMap} = this.props;
        const {MappedOptions = {}} = {...selectedMap};
        MappedOptions[field] = value;
        this.props.updateCustomerMapping({MappedOptions});
    }

    onChangeItemCode({field, value}) {
        const MappedValue = value;
        this.props.updateCustomerMapping({MappedValue});
    }

    onClickItem({field, value}) {
        const {mapForField} = this.props;
        this.props.updateCustomerMapping({MapField: mapForField, CSVField: field, CustomerValue: value});
    }

    render() {
        const {selectedMap,  mapForField} = this.props;
        const {CSVField, CustomerValue, MappedValue, MappedOptions} = {...selectedMap};
        const {conversionFactor, UOMOverride} = MappedOptions || {};
        return (
            <div>
                <h3>Map To Field & Value</h3>
                <form onSubmit={this.onSubmit}>
                    <FormGroupTextInput onChange={noop} value={mapForFieldTitles[mapForField] || mapForField || ''}
                                        label="Map For" colWidth={8} readOnly/>
                    <FormGroupTextInput onChange={noop} value={CSVField || ''}
                                        label="Map To" colWidth={8} readOnly>
                        {!CSVField && (<Alert type="info">You must select a field to map to.</Alert>)}
                    </FormGroupTextInput>
                    <FormGroupTextInput onChange={noop} value={CustomerValue || ''}
                                        label="Customer Value" colWidth={8} readOnly/>

                    <FormGroupTextInput field="ItemCode" onChange={this.onChangeItemCode}
                                        value={MappedValue || ''}
                                        label="Item Code" colWidth={8}/>
                    <FormGroupTextInput field="conversionFactor" onChange={this.onChangeMappedOptions}
                                        type="number"
                                        value={conversionFactor || ''}
                                        label="Conversion Factor" colWidth={8}/>
                    <FormGroupTextInput field="UOMOverride" onChange={this.onChangeMappedOptions}
                                        value={UOMOverride || ''}
                                        label="U/M Override" colWidth={8}/>
                    <MapSaveButton map={selectedMap} />
                </form>
                <hr/>
                <MapList csvField={[CSVField]} onChange={this.onClickItem}/>
            </div>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {showValueMapping, mappingData, mapForField, mapForValue, selectedMap, defaultCSVField} = mapping;
    return {selectedMap, showValueMapping, mappingData, mapForField, mapForValue, defaultCSVField};
};

const mapDispatchToProps = {updateCustomerMapping, saveCustomerMapping};

export default connect(mapStateToProps, mapDispatchToProps)(MapToItemCode)
