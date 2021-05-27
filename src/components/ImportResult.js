import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Alert from "../common-components/Alert";

class ImportResult extends Component {
    static propTypes = {
        SalesOrderNo: PropTypes.string,
        success: PropTypes.bool,
        response: PropTypes.object,
        error: PropTypes.string,
        exception: PropTypes.any,
    };

    static defaultProps = {
        SalesOrderNo: '',
        success: null,
        response: {},
        error: null,
        exception: null,
    };

    render() {
        const {SalesOrderNo, success, response, error, exception} = this.props;
        return (
            <div>
                {!!SalesOrderNo && (
                    <Alert type="success" title="Yay!">Imported as '{SalesOrderNo}'</Alert>
                )}
                {success === false && (
                    <Alert type="danger" title="Error:">{error}</Alert>
                )}
                {Object.keys(response).length > 0 && (
                    <pre className="csv-lines--debug">
                        <code>
                        {JSON.stringify(response, ' ', 2)}
                        </code>
                    </pre>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {SalesOrderNo, success, response, error, exception} = csvImport.importResult;
    return {
        SalesOrderNo,
        success,
        response,
        error,
        exception,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ImportResult) 
