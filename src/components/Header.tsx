import * as React from 'react';

const Logo = require('./../assets/logo.png');

export const Header = () => {
    return (
        <header style={{ textAlign: 'left' }}>
            <img
                src={Logo}
                alt="Stopwatch logo"
                style={{ height: '10vh', width: '10vh', marginLeft: '2vw', marginRight: '2vw', float: 'left' }}
            />
            <h1>Time tracker</h1>
            <div style={{ clear: 'both' }} />
        </header>
    );
};
