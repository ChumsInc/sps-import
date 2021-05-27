import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {noop} from "../constants/utils";
import InputGroupText from "./InputGroupText";
import {defaultValueMap} from "../constants/mapping";

class MappableInput extends Component {
    static propTypes = {
        mapForField: PropTypes.string.isRequired,
        mappedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        calculatedValue: PropTypes.bool,
        csvLineNo: PropTypes.number.isRequired,
        mappingData: PropTypes.object,
        maps: PropTypes.array,
        onClickMapButton: PropTypes.func,
    };

    static defaultProps = {
        mappedValue: '',
        calculatedValue: false,
        maps: [],
        mappingData: {}
    };

    static getMappedValue(map) {
        switch (map.MapField) {
        case 'ShipExpireDate':
        case 'CancelDate':
            return '';
        default:
            return map.MappedValue;
        }
    }

    render() {
        const {mapForField, mappedValue, maps, mappingData, calculatedValue} = this.props;
        const [map = defaultValueMap] = maps.filter(map => calculatedValue || MappableInput.getMappedValue(map) === mappedValue);
        const correctValue = calculatedValue ? mappedValue !== '' : MappableInput.getMappedValue(map) === mappedValue;
        const btnClassName = {
            'btn-secondary': map.MapField === '' || map.id === 0 || (mappedValue === '' && map.CSVField !== ''),
            'btn-success': map.CSVField !== '' && correctValue,
            'btn-danger': calculatedValue === false && mappedValue !== '' && map.MapField === '',
        };
        return (
            <InputGroupText field={mapForField} onChange={noop} readOnly value={mappedValue || ''}
                            buttonClassName={btnClassName}
                            onClickButton={this.props.onClickMapButton}/>
        );
    }
}

const mapStateToProps = ({mapping, csvImport}, {csvLineNo, mapForField}) => {
    const {csvLines} = csvImport;
    const {maps} = mapping;
    return {
        mappingData: csvLines[csvLineNo] || {},
        maps: maps.filter(map => map.MapField === mapForField),
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MappableInput) 
