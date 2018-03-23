import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const Logo = require('./../assets/logo.png');

export const Header = withRouter(props => {
    const getInitialSelectedMenuItems = () => {
        switch (props.location.pathname) {
            case '/details':
                return ['/details'];
            default:
                return ['/new'];
        }
    };

    return (
        <Layout.Header>
            <Link to="/new" title="Home page">
                <img
                    className="logo"
                    src={Logo}
                    alt="Stopwatch logo"
                    style={{
                        height: '46px',
                        marginLeft: '2vw',
                        marginRight: '2vw',
                        float: 'left'
                    }}
                />
            </Link>
            <Menu
                mode="horizontal"
                theme="dark"
                defaultSelectedKeys={getInitialSelectedMenuItems()}
            >
                <Menu.Item key="/new">
                    <Link to="/new" title="New">
                        <Icon type="play-circle-o" />
                        <span className="menu-title">New activity</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="/details">
                    <Link to="/details" title="Details">
                        <Icon type="bars" />
                        <span className="menu-title">Details</span>
                    </Link>
                </Menu.Item>
            </Menu>
        </Layout.Header>
    );
});
