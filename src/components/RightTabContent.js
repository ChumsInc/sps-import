import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from "prop-types";
import {TAB_IMPORT, TAB_MAPPING, TABS} from "../constants/app";
import CurrentMappingContent from "./CurrentMappingContent";
import MappingTabContent from "./MappingTabContent";
import TabBar from "./TabBar";

const mapStateToProps = ({app}) => {
    const {tab} = app;
    return {
        tab
    };
};

const mapDispatchToProps = {};

class RightTabContent extends Component {

    static propTypes = {
        tab: PropTypes.string,
    };

    static defaultProps = {
        tab: TABS[0].id,
    };

    render() {
        const {tab} = this.props;
        return (
            <div className="col-sm-6">
                <TabBar />
                {tab === TAB_IMPORT && <CurrentMappingContent />}
                {tab === TAB_MAPPING && (<MappingTabContent />)}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RightTabContent);
