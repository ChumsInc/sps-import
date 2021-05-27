import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import numeral from 'numeral';
import {showCustomerValueMapping} from '../actions/mapping'
import Alert from "../common-components/Alert";

const nonInventoryItem = /^\*/;

const ImportItemRow = ({line = {}, hasPackForStore = false, onClickMap}) => {
    const {
        ItemCode,
        ItemCodeDesc,
        QuantityOrdered,
        UnitOfMeasure,
        UnitPrice,
        UDF_SHIP_CODE,
        map = {},
        errors = [],
        csv
    } = {...line};
    const clickHandler = () => onClickMap('ItemCode', ItemCode, csv);

    const btnClassName = {
        'btn-success': !!map.id && errors.length === 0,
        'btn-secondary': !map.id,
        'btn-danger': errors.length > 0,
    };
    const rowClassName = {
        'table-warning': nonInventoryItem.test(ItemCode),
        'table-danger': nonInventoryItem.test(ItemCode) === false && errors.length > 0,
    };
    return (
        <Fragment>
            <tr className={classNames(rowClassName)}>
                <td>{ItemCode}</td>
                <td>{ItemCodeDesc}</td>
                <td className="right">{QuantityOrdered}</td>
                <td className="right">{UnitOfMeasure}</td>
                <td className="right">{numeral(UnitPrice).format('0.00')}</td>
                <td className="right">{numeral(Number(QuantityOrdered) * Number(UnitPrice)).format('0,0.00')}</td>
                {hasPackForStore && (<td>{UDF_SHIP_CODE}</td>)}
                <td className="center">
                    <button className={classNames("btn btn-sm btn", btnClassName)} onClick={clickHandler}>Map</button>
                </td>
            </tr>
            {nonInventoryItem.test(ItemCode) === false && errors.length > 0 && (
                <tr>
                    <td colSpan={hasPackForStore ? 8 : 7}>
                        <Alert message={errors.join('; ')} type="danger"/>
                    </td>
                </tr>
            )}
        </Fragment>
    )
};


class ImportItemList extends Component {
    static propTypes = {
        detail: PropTypes.arrayOf(PropTypes.shape({
            ItemCode: PropTypes.string,
            ItemCodeDesc: PropTypes.string,
            QuantityOrdered: PropTypes.number,
            UnitOfMeasure: PropTypes.string,
            UnitPrice: PropTypes.number,
            UDF_SHIP_CODE: PropTypes.string,
            csv: PropTypes.object,
        })),
        csvHeader: PropTypes.object,
        showCustomerValueMapping: PropTypes.func.isRequired,
    };

    static defaultProps = {
        detail: [],
        csvHeader: {},
    };

    render() {
        const {detail, csvHeader} = this.props;
        const POTotalAmount = Number(csvHeader['PO Total Amount'] || 0);
        const hasPackForStore = detail.filter(line => !!line.UDF_SHIP_CODE).length > 0;
        let total = 0;
        detail.map(line => Number(line.QuantityOrdered) * Number(line.UnitPrice)).forEach(value => total += value);
        return (
            <div>
                <table className="table table-sm table-sticky">
                    <thead>
                    <tr>
                        <th>Item Code</th>
                        <th>Item Desc</th>
                        <th className="right">Qty</th>
                        <th className="right">UM</th>
                        <th className="right">Price</th>
                        <th className="right">Total</th>
                        {hasPackForStore && (<th>Pack For</th>)}
                        <th>&nbsp;</th>
                    </tr>
                    </thead>
                    <tfoot>
                    <tr>
                        <th colSpan="5">Detail Total</th>
                        <th className="right">{numeral(total).format('0,0.00')}</th>
                        <th>&nbsp;</th>
                    </tr>
                    <tr>
                        <th colSpan="5">
                            <span>PO Total Amount</span>
                            {Math.abs(POTotalAmount - total) > 0.01 && (<Alert message="Total does not match"/>)}
                        </th>
                        <th className="right">{numeral(POTotalAmount).format('0,0.00')}</th>
                        <th>&nbsp;</th>
                    </tr>
                    </tfoot>
                    <tbody>
                    {detail.map(line => (
                        <ImportItemRow key={line._index} line={line} hasPackForStore={hasPackForStore}
                                       onClickMap={this.props.showCustomerValueMapping}/>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {salesOrder = {}, csvLines} = csvImport;
    const [csvHeader = {}] = csvLines;
    const {detail = []} = salesOrder;
    return {detail, csvHeader};
};

const mapDispatchToProps = {
    showCustomerValueMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportItemList) 

