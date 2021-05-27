import React from 'react';
import classNames from 'classnames';

const Tab = ({active = false, id, title, onSelect}) => {
    const onClick = (ev) => {
        ev.preventDefault();
        onSelect(id);
    };
    return (
        <li className="nav-item">
            <a className={classNames('nav-link', {active})} href="#" onClick={onClick}>{title}</a>
        </li>
    );
};

const Tabs = ({tabList = [], activeTab, onSelect}) => (
    <ul className="nav nav-tabs mb-2">
        {tabList.map(tab => <Tab key={tab.id} {...tab} active={activeTab === tab.id} onSelect={(id) => onSelect(id)}/>)}
    </ul>
);

export default Tabs;
