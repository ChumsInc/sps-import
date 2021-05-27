import React, {Component} from 'react';
import {connect} from 'react-redux';
import CustomerLookup from "./CustomerLookup";
import MapToCustomer from "./MapToCustomer";

class LinkAccount extends Component {
    static propTypes = {};

    static defaultProps = {};


    render() {
        return (
            <div>
                <h2>Map To Account</h2>
                <CustomerLookup/>
                <MapToCustomer/>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LinkAccount) 
