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

import { blueCheckScriptUrl } from './CheckoutPlugin.config'
import blueCheckScriptEnabler from '../../../static/blueCheckEnablerScript'
import { isSignedIn } from 'Util/Auth';
import BrowserDatabase from 'Util/BrowserDatabase';


export const componentDidMount = (args, callback, instance) => {
    const isCustomerSignedIn = isSignedIn();
    const customer = BrowserDatabase.getItem('customer') || {};
    const blueCheckScript = document.createElement("script");
    blueCheckScript.onload = () => (blueCheckScriptEnabler(isCustomerSignedIn, customer.addresses, customer.email));
    blueCheckScript.src = blueCheckScriptUrl;
    document.body.appendChild(blueCheckScript);
    return callback(...args);
};

export default {
    'Route/Checkout/Container': {
        'member-function': {
            componentDidMount
        }
    }
};
