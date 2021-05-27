import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import AlertList from "../common-components/AlertList";
import {TAB_IMPORT, TAB_MAPPING, TABS} from "../constants/app";
import TabBar from "./TabBar";
import ImportTabContent from "./ImportTabContent";
import MappingTabContent from "./MappingTabContent";
import CurrentMappingContent from "./CurrentMappingContent";
import RightTabContent from "./RightTabContent";

class App extends Component {

    static propTypes = {
        tab: PropTypes.string,
    };

    static defaultProps = {
        tab: TABS[0].id,
    };

    render() {
        const {tab} = this.props;
        return (
            <div>
                <AlertList />
                <div className="row">
                    <ImportTabContent />
                    <RightTabContent />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({app}) => {
    const {tab} = app;
    return {
        tab
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
