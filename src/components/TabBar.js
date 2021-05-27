import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {TABS, TAB_TITLES} from '../constants/app';
import Tabs from "../common-components/Tabs";
import {setTab} from '../actions/app';

class TabBar extends Component {
    static propTypes = {
        tab: PropTypes.string,
        setTab: PropTypes.func.isRequired,
    };

    static defaultProps = {
        tab: TABS[0],
    };

    render() {
        const {tab} = this.props;
        return (
            <Fragment>
                <Tabs tabList={TABS} activeTab={tab} onSelect={this.props.setTab} />
            </Fragment>
        );
    }
}

const mapStateToProps = ({app}) => {
    const {tab} = app;
    return {
        tab,
    };
};

const mapDispatchToProps = {setTab};

export default connect(mapStateToProps, mapDispatchToProps)(TabBar) 
