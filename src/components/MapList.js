import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AccountMapItem from "./AccountMapItem";
import FormGroup from "../common-components/FormGroup";
import FormCheck from "../common-components/FormCheck";

class MapList extends Component {
    static propTypes = {
        csvField: PropTypes.arrayOf(PropTypes.string).isRequired,
        type: PropTypes.oneOf(['radio', 'checkbox']),
        defaultFilter: PropTypes.instanceOf(RegExp),
        mappingData: PropTypes.object,
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        csvField: [],
        type: 'radio',
        defaultFilter: null,
        mappingData: {},
    };

    state = {
        showAllLines: false,
    };

    render() {
        const {mappingData, defaultFilter, csvField, type} = this.props;
        const {showAllLines} = this.state;
        const hasFilter = defaultFilter instanceof RegExp;
        const values = Object.keys(mappingData)
            .filter(key => /(_index|changed|loading)/i.test(key) === false)
            .filter(key => showAllLines || (hasFilter ? defaultFilter.test(key) : mappingData[key].trim() !== ''))
            .map(key => ({
                field: key,
                value: mappingData[key]
            }));
        return (
            <Fragment>
                <FormGroup colWidth={8} label="Show All Values">
                    <FormCheck label="Yes" inline type="radio" checked={showAllLines} onClick={() => this.setState({showAllLines: true})} />
                    {hasFilter && <FormCheck label="Only Filtered Values" inline type="radio" checked={!showAllLines} onClick={() => this.setState({showAllLines: false})} />}
                    {!hasFilter && (<FormCheck label="Only Filled Values" inline type="radio" checked={!showAllLines} onClick={() => this.setState({showAllLines: false})} />)}
                </FormGroup>
                <div className="map-list">
                    {values.map(obj => (
                        <AccountMapItem key={obj.field} type={type} {...obj}
                                        selected={csvField.includes(obj.field)}
                                        onChange={this.props.onChange}/>
                    ))}
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = ({mapping}) => {
    const {mappingData} = mapping;
    return {mappingData};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MapList) 
