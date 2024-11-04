import React from 'react';

const Header = () => {
    const headerStyle = {
        backgroundColor: '#4CAF50',
        padding: '10px 0',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
    };

    const linkStyle = {
        color: 'white',
        textDecoration: 'none',
        margin: '0 15px',
        padding: '10px 15px',
        borderRadius: '5px',
    };

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: '#45a049', // Slightly darker green for active link
    };

    return (
        <div style={headerStyle}>
            <a
                href="/"
                style={window.location.pathname === '/' ? activeLinkStyle : linkStyle}
            >
                Loan List
            </a>
            <a
                href="/new-loan"
                style={window.location.pathname === '/new-loan' ? activeLinkStyle : linkStyle}
            >
                New Loan
            </a>
            <a
                href="/new-payment"
                style={window.location.pathname === '/new-payment' ? activeLinkStyle : linkStyle}
            >
                New Payment
            </a>
        </div>
    );
};

export default Header;
