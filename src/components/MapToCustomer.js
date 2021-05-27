import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountMapItem from "./AccountMapItem";
import {toggleCustomerLookupField, saveCustomerLookupMapping} from '../actions/mapping';
import FormCheck from "../common-components/FormCheck";
import MapList from "./MapList";
import {noop} from "../constants/utils";

class MapToCustomer extends Component {
    static propTypes = {
        mappingData: PropTypes.object,
        customerLookupMapping: PropTypes.object,
        toggleCustomerLookupField: PropTypes.func.isRequired,
        saveCustomerLookupMapping: PropTypes.func.isRequired,
    };

    static defaultProps = {
        mappingData: {},
        customerLookupMapping: {},
    };

    state = {
        showAllLines: false,
        showMappingOptions: false,
    };

    constructor(props) {
        super(props);
        this.onClickItem = this.onClickItem.bind(this);
    }


    onClickItem({field, value}) {
        this.props.toggleCustomerLookupField({field, value});
    }

    render() {
        const {mappingData, customerLookupMapping} = this.props;
        const {showAllLines, showMappingOptions} = this.state;
        return (
            <div>
                {!!Object.keys(customerLookupMapping).length && (
                    <Fragment>
                        <h3>Mapped Fields</h3>
                        <div className="map-list">
                            {Object.keys(customerLookupMapping)
                                .filter(key => /(loading|changed)/i.test(key) === false)
                                .map(key => ({field: key, value: customerLookupMapping[key]}))
                                .map(obj => (
                                    <AccountMapItem key={obj.field} {...obj}
                                                    selected={customerLookupMapping[obj.field] !== undefined}
                                                    match={customerLookupMapping[obj.field] === obj.value}
                                                    onChange={this.onClickItem}/>
                                ))}
                        </div>
                        <button type="button" className="btn btn-sm btn-primary mr-3"
                                onClick={this.props.saveCustomerLookupMapping}
                                disabled={!customerLookupMapping.changed}>
                            Save Mapping
                        </button>
                        <FormCheck label="Show Mapping Options" checked={showMappingOptions} onClick={() => this.setState({showMappingOptions: !showMappingOptions})} inline/>
                    </Fragment>
                )}
                {(Object.keys(customerLookupMapping).length === 0 || showMappingOptions) && (
                    <Fragment>
                        <hr />
                        <h3>Select fields to uniquely identify to this customer</h3>
                        <MapList type="checkbox" onChange={this.onClickItem} csvField={Object.keys(customerLookupMapping)} />
                    </Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {customerLookupMapping, mappingData} = mapping;
    return {mappingData, customerLookupMapping};
};

const mapDispatchToProps = {
    toggleCustomerLookupField,
    saveCustomerLookupMapping
};

export default connect(mapStateToProps, mapDispatchToProps)(MapToCustomer)
