import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FormGroup from "../common-components/FormGroup";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {noop} from '../constants/utils';
import BillToAddress from "./BillToAddress";
import ShipToAddress from "./ShipToAddress";
import {importToSage} from '../actions/csv-import';
import {showCustomerDateMapping, showCustomerMapping, showCustomerValueMapping, showSOValues, showCSVValues} from '../actions/mapping';
import InputGroupText from "./InputGroupText";
import formatDate from 'date-fns/format'
import MappableInput from "./MappableInput";
import ImportItemList from "./ImportItemList";
import ExistingPOAlert from "./ExistingPOAlert";
import TextInput from "../common-components/TextInput";
import {MAP_CSV_VALUES, MAP_SO_VALUES} from "../constants/mapping";
import classNames from 'classnames';
import Alert from "../common-components/Alert";

const formattedDate = (date) => !!date ? formatDate(new Date(date), 'MM/dd/yyyy') : '';

class ImportTestResult extends Component {
    static propTypes = {
        salesOrder: PropTypes.shape({
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
            CustomerPONo: PropTypes.string,
            ShipToCode: PropTypes.string,
            ShipExpireDate: PropTypes.string,
            CancelDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
            BillToAddress: PropTypes.object,
            ShipToAddress: PropTypes.object,
            detail: PropTypes.arrayOf(PropTypes.shape({
                ItemCode: PropTypes.string,
                ItemCodeDesc: PropTypes.string,
                QuantityOrdered: PropTypes.number,
                UnitOfMeasure: PropTypes.string,
                UDF_SHIP_CODE: PropTypes.string,
            })),
        }),
        csvLines: PropTypes.arrayOf(PropTypes.object),
        selectedMappingTool: PropTypes.string,

        showCustomerMapping: PropTypes.func.isRequired,
        showCustomerDateMapping: PropTypes.func.isRequired,
        showCustomerValueMapping: PropTypes.func.isRequired,
        showSOValues: PropTypes.func.isRequired,
        showCSVValues: PropTypes.func.isRequired,
        importToSage: PropTypes.func.isRequired,
    };

    static defaultProps = {
        salesOrder: {
            BillToAddress: {},
            detail: [],
        },
        selectedMappingTool: '',
    };

    state = {
        page: 1,
        rowsPerPage: 10,
    };

    constructor(props) {
        super(props);
        this.showCustomerMapping = this.showCustomerMapping.bind(this);
        this.showCustomerDateMapping = this.showCustomerDateMapping.bind(this);
        this.showCustomerValueMapping = this.showCustomerValueMapping.bind(this);
    }

    showCustomerMapping() {
        this.props.showCustomerMapping(this.props.csvLines[0] || {});
    }

    showCustomerDateMapping({field}) {
        this.props.showCustomerDateMapping(field, this.props.csvLines[0] || {});
    }

    showCustomerValueMapping({field, value}) {
        this.props.showCustomerValueMapping(field, value, this.props.csvLines[0] || {});
    }

    render() {
        const {selectedMappingTool} = this.props;
        const {
            Company, ARDivisionNo, CustomerNo, CustomerPONo, ShipToCode, ShipExpireDate, CancelDate,
            DropShip, CarrierCode, CarrierName, ShipVia, validationRequired,
            BillToAddress: billToAddress = {}, ShipToAddress: shipToAddress = {}, detail = [], comments
        } = this.props.salesOrder;

        const Customer = [ARDivisionNo, CustomerNo].filter(val => !!val).join('-');
        // const Customer = !!ARDivisionNo ? `${ARDivisionNo}-${CustomerNo}` : '';

        const showSOButtonClassNames = {
            'btn-info': selectedMappingTool === MAP_SO_VALUES,
            'btn-outline-info': selectedMappingTool !== MAP_SO_VALUES,
        };

        const showCSVButtonClassNames = {
            'btn-info': selectedMappingTool === MAP_CSV_VALUES,
            'btn-outline-info': selectedMappingTool !== MAP_CSV_VALUES,
        };

        const hasFatalErrors = detail
            .filter(line => !!line.errors.length)
            .filter(line => /^\*/.test(line.ItemCode) === false)
            .length > 0;


        return (
            <div>
                <div className="form-row">
                    <div className="col">
                        <h2>Import File Parsing</h2>
                    </div>
                    <div className="col">
                        <div className="right">
                            <button className={classNames("btn btn-sm ml-1", showCSVButtonClassNames)}
                                    onClick={this.props.showCSVValues}>
                                Show CSV Values
                            </button>
                            <button className={classNames("btn btn-sm ml-1", showSOButtonClassNames)}
                                    onClick={this.props.showSOValues}>
                                Show Sales Order Values
                            </button>
                        </div>
                    </div>
                </div>


                <FormGroup label="PO #" colWidth={8}>
                    <TextInput onChange={noop} readOnly value={CustomerPONo || ''}/>
                    <ExistingPOAlert />
                    {!!validationRequired && (<Alert type="warning">Validation Required</Alert>)}
                </FormGroup>

                <FormGroup label="Customer" colWidth={8}  helpText={billToAddress.CustomerName}>
                    <InputGroupText value={Customer || ''} onChange={noop} readOnly buttonText="Mapping"
                                    buttonClassName={Customer === '' ? 'btn-danger' : 'btn-success'}
                                    onClickButton={this.showCustomerMapping}>
                    </InputGroupText>
                </FormGroup>
                <FormGroup label="Ship Date" colWidth={8}>
                    <MappableInput mapForField="ShipExpireDate" mappedValue={formattedDate(ShipExpireDate)}
                                   csvLineNo={0} calculatedValue={true}
                                   onClickMapButton={this.showCustomerDateMapping} />
                </FormGroup>
                <FormGroup label="Cancel Date" colWidth={8}>
                    <MappableInput mapForField="CancelDate" mappedValue={formattedDate(CancelDate)}
                                   csvLineNo={0} calculatedValue={true}
                                   onClickMapButton={this.showCustomerDateMapping} />
                </FormGroup>
                {!DropShip && (
                    <FormGroup label="Ship To Code" colWidth={8}>
                        <MappableInput mapForField="ShipToCode" mappedValue={ShipToCode} calculatedValue
                                       csvLineNo={0}
                                       onClickMapButton={this.showCustomerValueMapping}/>
                    </FormGroup>
                )}
                {!!DropShip && (
                    <FormGroup label="Ship Via" colWidth={8}>
                        <MappableInput mapForField="ShipVia" mappedValue={ShipVia || ''}
                                       csvLineNo={0}
                                       onClickMapButton={this.showCustomerValueMapping}/>
                    </FormGroup>
                )}
                <div className="form-row">
                    <div className="col-6">
                        <h3>Bill To</h3>
                        <BillToAddress {...billToAddress}/>
                    </div>
                    <div className="col-6">
                        <h3>{!!DropShip && <span>Drop </span>}Ship To</h3>
                        <ShipToAddress {...shipToAddress}/>
                    </div>
                </div>
                <ImportItemList />
                <ul>
                    {(comments || []).map((comment, index) => (<li key={index}>{comment}</li>))}
                </ul>
                {hasFatalErrors && (
                    <Alert type="danger" title="Danger:">
                        This import has non-recoverable mapping errors.
                    </Alert>
                )}
                <div>
                    <button type="button" className="btn btn-primary btn-sm btn-block"
                            disabled={hasFatalErrors || detail.length === 0}
                            onClick={this.props.importToSage}>
                        Import Order
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({csvImport, mapping}) => {
    const {salesOrder, csvLines} = csvImport;
    const {selectedMappingTool} = mapping;
    return {
        salesOrder,
        csvLines,
        selectedMappingTool,
    };
};

const mapDispatchToProps = {
    showCustomerMapping,
    showCustomerDateMapping,
    showCustomerValueMapping,
    showSOValues,
    showCSVValues,
    importToSage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportTestResult) 
