import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import {loadLookupCustomer, setCustomerLookup, toggleZeroCommissions} from '../actions/mapping';
import {noop} from "../constants/utils";
import FormGroup from "../common-components/FormGroup";
import TextInput from "../common-components/TextInput";
import FormCheck from "../common-components/FormCheck";

class CustomerLookup extends Component {
    static propTypes = {
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        CustomerName: PropTypes.string,
        customerOptions: PropTypes.shape({
           zeroCommissions: PropTypes.bool,
        }),
        loading: PropTypes.bool,
        setCustomerLookup: PropTypes.func.isRequired,
        loadLookupCustomer: PropTypes.func.isRequired,
        toggleZeroCommissions: PropTypes.func.isRequired,
    };

    static defaultProps = {
        ARDivisionNo: '',
        CustomerNo: '',
        CustomerName: '',
        loading: false,
        customerOptions: {
            zeroCommissions: false,
        }
    };

    constructor(props) {
        super(props);
        this.onChangeCustomer = this.onChangeCustomer.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeCustomer({field, value}) {
        console.log(value);
        this.props.setCustomerLookup(value);
    }

    onSubmit(ev) {
        ev.preventDefault();
        this.props.loadLookupCustomer();
    }

    render() {
        const {ARDivisionNo, CustomerNo, CustomerName, loading, customerOptions} = this.props;
        const customer = CustomerNo.length > 0
            ? [ARDivisionNo, CustomerNo].join('-')
            : [ARDivisionNo, CustomerNo].join('');

        return (
            <form onSubmit={this.onSubmit}>
                <FormGroup colWidth={9} label="Customer Number">
                    <div className="input-group input-group-sm">
                        <TextInput type="text" value={customer.toUpperCase()} onChange={this.onChangeCustomer}
                                   placeholder="##-XX####"/>
                        <div className="input-group-append">
                            <button type="submit" className="btn btn-sm btn-primary" disabled={loading}>Load</button>
                        </div>
                    </div>
                </FormGroup>
                <FormGroupTextInput type="text" colWidth={9} label="Name" value={CustomerName} onChange={noop}
                                    readOnly/>
                <FormGroup colWidth={9} label="Import with 0 Commission">
                    <FormCheck label={customerOptions.zeroCommissions ? 'Yes' : 'No'}
                               onClick={this.props.toggleZeroCommissions}
                               type="checkbox" inline={true}
                               checked={customerOptions.zeroCommissions || false}/>
                </FormGroup>
            </form>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {ARDivisionNo, CustomerNo, CustomerName, loading} = mapping.customerLookup;
    const {customerOptions} = mapping;
    return {
        ARDivisionNo, CustomerNo, CustomerName, loading, customerOptions,
    };
};

const mapDispatchToProps = {
    setCustomerLookup,
    loadLookupCustomer,
    toggleZeroCommissions,
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerLookup) 
