import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FormCheck from "../common-components/FormCheck";

class CSVLinesDebug extends Component {
    static propTypes = {
        csvLines: PropTypes.array,
    };

    static defaultProps = {
        csvLines: [],
    };

    state = {
        hideEmptyValues: true,
    };

    render() {
        const {csvLines} = this.props;
        const {hideEmptyValues} = this.state;
        let data = [...csvLines];
        if (hideEmptyValues) {
            data = data.map(line => {
                const obj = {...line};
                Object.keys(obj)
                    .filter(key => String(obj[key]).trim() === '')
                    .forEach(key => {
                        delete obj[key];
                    });
                return obj;
            });
        }
        return (
            <Fragment>
                <FormCheck label="Hide Empty Values" inline checked={hideEmptyValues} onClick={() => this.setState({hideEmptyValues: !hideEmptyValues})}/>

                <pre className="csv-lines--debug">
                            <code>
                            {JSON.stringify(data, ' ', 2)}
                            </code>
                        </pre>

            </Fragment>
        );
    }
}

const mapStateToProps = ({csvImport}) => {
    const {csvLines} = csvImport;
    return {csvLines};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(CSVLinesDebug)
