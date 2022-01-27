/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';

import blueCheckScriptEnabler from '../../../static/blueCheckEnablerScript';
import { blueCheckScriptUrl } from './CheckoutPlugin.config';

export const loadScript = () => {
    const blueCheckScript = document.createElement('script');
    blueCheckScript.setAttribute('id', 'bluecheck-script');
    blueCheckScript.src = blueCheckScriptUrl;
    document.body.appendChild(blueCheckScript);
    return new Promise((res, rej) => {
        blueCheckScript.onload = () => {
            res();
        };
        blueCheckScript.onerror = () => {
            rej();
        };
    });
};

export const configBlueCheck = () => {
    const isCustomerSignedIn = isSignedIn();
    const customer = BrowserDatabase.getItem('customer') || {};
    return blueCheckScriptEnabler(isCustomerSignedIn, customer.addresses, customer.email);
};

export const componentDidMount = (args, callback, _instance) => {
    loadScript().then(() => {
        configBlueCheck();
    });

    return callback(...args);
};

// Removing the script to make sure it is correctly reloaded when revisiting the component again!
export const componentWillUnmount = (args, callback, _instance) => {
    window.BlueCheck = null;
    document.getElementById('bluecheck-container').remove();
    document.getElementById('bluecheck-script-container').remove();
    document.getElementById('bluecheck-script').remove();
    return callback(...args);
};

export default {
    'Route/Checkout/Container': {
        'member-function': {
            componentDidMount,
            componentWillUnmount
        }
    }
};
