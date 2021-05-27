import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Alert from "../common-components/Alert";

class ExistingPOAlert extends Component {
    static propTypes = {
        existingPO: PropTypes.shape({
            SalesOrderNo: PropTypes.string,
            OrderDate: PropTypes.string,
            OrderStatus: PropTypes.string,
        }),
    };

    static defaultProps = {
        existingPO: {},
    };

    render() {
        const {SalesOrderNo} = this.props.existingPO;
        return (
            <Fragment>
                {!!SalesOrderNo && (
                    <Alert type="danger">
                        This PO has already been imported as SO# '{SalesOrderNo}'.
                    </Alert>
                )}
            </Fragment>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {existingPO} = csvImport;
    return {
        existingPO
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingPOAlert) 
