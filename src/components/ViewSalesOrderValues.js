import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class ViewSalesOrderValues extends Component {
    static propTypes = {
        salesOrder: PropTypes.object,
    };

    static defaultProps = {
        salesOrder: {}
    };

    render() {
        const {salesOrder} = this.props;
        (salesOrder.detail || []).forEach(line => {
            delete line.csv;
            delete line.map;
        });
        return (
            <Fragment>
                <h2>Sales Order Preview</h2>
                <pre className="csv-lines--debug">
                    <code>
                    {JSON.stringify(salesOrder, ' ', 2)}
                    </code>
                </pre>
            </Fragment>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {salesOrder} = csvImport;
    return {salesOrder};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ViewSalesOrderValues) 
