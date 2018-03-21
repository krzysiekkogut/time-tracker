import * as React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';

const Logo = require('./../assets/logo.png');

export const Header = withRouter(props => {
    return (
        <Layout.Header>
            <img
                className="logo"
                src={Logo}
                alt="Stopwatch logo"
                style={{
                    height: '95%',
                    marginLeft: '2vw',
                    marginRight: '2vw',
                    float: 'left'
                }}
            />
            <Menu
                mode="horizontal"
                theme="dark"
                defaultSelectedKeys={[props.location.pathname]}
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