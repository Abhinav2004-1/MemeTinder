import React, { Fragment } from 'react';
import './logo.scss';

const Logo = (props) => {

    return (
        <Fragment>
            <div className={(props.type)?'LOGO-2':'LOGO'}>{(props.type)?`LET'S SWIPE FOR HUMOUR`:'MEME TINDER'}</div>
        </Fragment>
    )
}

export default Logo
