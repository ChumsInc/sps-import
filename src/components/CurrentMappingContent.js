import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import LinkAccount from "./LinkAccount";
import CSVLinesDebug from "./CSVLinesDebug";
import MapToDateField from "./MapToDateField";
import MapToValue from "./MapToValue";
import {
    MAP_ACCOUNT,
    MAP_CSV_VALUES,
    MAP_DATES,
    MAP_FIELD_VALUES,
    MAP_SO_VALUES,
    SHOW_SALES_ORDER_VALUES
} from "../constants/mapping";
import ImportResult from "./ImportResult";
import MapToItemCode from "./MapToItemCode";
import ViewSalesOrderValues from "./ViewSalesOrderValues";

class ImportTabContent extends Component {
    static propTypes = {
        selectedMappingTool: PropTypes.string,
        mapForField: PropTypes.string,
    };

    static defaultProps = {
        selectedMappingTool: '',
        mapForField: '',
    };

    constructor(props) {
        super(props);
        this.dragRef = createRef();
        this.onDragEnter = this.onDragEnter.bind(this);
    }

    onDragEnter() {
        this.dragRef.current.scrollTo(0, 0);
    }


    render() {
        const {selectedMappingTool, mapForField} = this.props;
        return (
            <div className="col-mapping-tool">
                <ImportResult />
                {selectedMappingTool === MAP_ACCOUNT && (<LinkAccount />)}
                {selectedMappingTool === MAP_DATES && (<MapToDateField />)}
                {selectedMappingTool === MAP_SO_VALUES && (<ViewSalesOrderValues />)}
                {selectedMappingTool === MAP_CSV_VALUES && (<CSVLinesDebug />)}
                {selectedMappingTool === MAP_FIELD_VALUES && mapForField !== 'ItemCode' && (<MapToValue />)}
                {selectedMappingTool === MAP_FIELD_VALUES && mapForField === 'ItemCode' && (<MapToItemCode />)}
            </div>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {selectedMappingTool, mapForField} = mapping;
    return {
        selectedMappingTool,
        mapForField,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ImportTabContent) 

