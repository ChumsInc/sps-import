import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

class MappingTabContent extends Component {
    static propTypes = {};

    static defaultProps = {};

    render() {
        return (
            <div>
                Mapping
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MappingTabContent) 
