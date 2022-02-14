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

import { blueCheckScriptUrl } from './CheckoutPlugin.config';

export const TIMEOUT_LISTEN_TO_CHECKOUT = 250;

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

export const scrapeLoggedInUserData = (addresses, email) => {
    const chosenAddressId = Number(
        document.getElementsByClassName('CheckoutAddressTable-Button_isSelected')[0]
            .parentElement.classList[1]
    );
    const address = addresses.find((address) => chosenAddressId === address.id);
    const { BlueCheck } = window;
    const userDataPrefix = 'shipping';
    BlueCheck.userData.email = email;
    BlueCheck.userData[`${userDataPrefix }_first_name`] = address.firstname;
    BlueCheck.userData[`${userDataPrefix }_last_name`] = address.lastname;
    BlueCheck.userData[`${userDataPrefix }_address`] = address.street[0];
    BlueCheck.userData[`${userDataPrefix }_address2`] = address.street[1];
    BlueCheck.userData[`${userDataPrefix }_address3`] = address.street[2];
    BlueCheck.userData[`${userDataPrefix }_city`] = address.city;
    BlueCheck.userData[`${userDataPrefix }_country`] = address.country_id;
    BlueCheck.userData[`${userDataPrefix }_region`] = address.region.region;
    BlueCheck.userData[`${userDataPrefix }_phone`] = address.telephone;
    BlueCheck.userData[`${userDataPrefix }_postal_code`] = address.postcode;
    BlueCheck.requiredFields = [
        `${userDataPrefix }_first_name`, `${userDataPrefix }_last_name`,
        `${userDataPrefix }_country`, 'email'
    ];
};

export const scrapeGuestUserData = (email = null, address) => {
    const userDataPrefix = 'shipping';
    const { BlueCheck } = window;
    const usIndex = 231;
    const regionIndex = address.region_id - 1;
    // Gets the country of index 231, which is United States
    const usRegion = BrowserDatabase.getItem('config').countries[usIndex].available_regions[regionIndex];
    BlueCheck.userData.email = email || address.guest_email;
    BlueCheck.userData[`${userDataPrefix }_first_name`] = address.firstname;
    BlueCheck.userData[`${userDataPrefix }_last_name`] = address.lastname;
    BlueCheck.userData[`${userDataPrefix }_address`] = address.street0;
    BlueCheck.userData[`${userDataPrefix }_address2`] = address.street1;
    BlueCheck.userData[`${userDataPrefix }_address3`] = address.street2;
    BlueCheck.userData[`${userDataPrefix }_city`] = address.city;
    BlueCheck.userData[`${userDataPrefix }_country`] = address.country_id;
    BlueCheck.userData[`${userDataPrefix }_region`] = usRegion.name;
    BlueCheck.userData[`${userDataPrefix }_phone`] = address.telephone;
    BlueCheck.userData[`${userDataPrefix }_postal_code`] = address.postcode;
    BlueCheck.requiredFields = [
        `${userDataPrefix }_first_name`,
        `${userDataPrefix }_last_name`,
        `${userDataPrefix }_country`,
        'email'];
};

export const componentDidMount = (args, callback, _instance) => {
    BrowserDatabase.setItem(false, 'blueCheck');
    loadScript();

    return callback(...args);
};
export const componentDidUpdate = (args, callback, _instance) => {
    // checking the new state with the old one and verifying that script exists
    if (args[1].checkoutStep === 'BILLING_STEP'
        && _instance.state.checkoutStep === 'SHIPPING_STEP'
        && document.getElementById('bluecheck-script-container')
    ) {
        window.BlueCheck = null;
        document.getElementById('bluecheck-container').remove();
        document.getElementById('bluecheck-script-container').remove();
        document.getElementById('bluecheck-script').remove();
        loadScript();
    }

    return callback(...args);
};

// Removing the script to make sure it is correctly reloaded when revisiting the component again!
export const componentWillUnmount = (args, callback, _instance) => {
    if (document.getElementById('bluecheck-script-container')) {
        window.BlueCheck = null;
        document.getElementById('bluecheck-container').remove();
        document.getElementById('bluecheck-script-container').remove();
        document.getElementById('bluecheck-script').remove();
    }

    return callback(...args);
};

export const onShippingSuccess = (args, callback, _instance) => {
    const isCustomerSignedIn = isSignedIn();
    const customer = BrowserDatabase.getItem('customer') || {};
    BrowserDatabase.setItem(true, 'blueCheck');

    if (args[0].country_id === 'US') {
        BrowserDatabase.setItem(false, 'blueCheck');
        const { BlueCheck } = window;
        if (BlueCheck) {
            BlueCheck.platformCallbacks.onReady = () => {
                function prepareButton() {
                    const verifyBtn = document.getElementsByClassName('CheckoutShipping-Button')[0];
                    BlueCheck.platformCallbacks.onSuccess = () => {
                        BrowserDatabase.setItem(true, 'blueCheck');
                        verifyBtn.click();
                        return callback(...args);
                    };
                    // Takes the user back if he closes BlueCheck window, since its "Back" button is not operational
                    BlueCheck.platformCallbacks.onQuit = () => {
                        window.history.back();
                    };
                    BlueCheck.validateAndDisplayModal();
                }
                function listenForCheckout() {
                    try {
                        prepareButton();
                    } catch (e) {
                        setTimeout(listenForCheckout, TIMEOUT_LISTEN_TO_CHECKOUT);
                    }
                }
                setTimeout(listenForCheckout);
            };
            BlueCheck.platformCallbacks.scrapeUserData = () => {
                const isCustomAddress = document
                    .getElementsByClassName('CheckoutAddressBook-Button_isCustomAddressExpanded')[0] !== undefined;

                return (isCustomerSignedIn && !isCustomAddress)
                    ? scrapeLoggedInUserData(customer.addresses, customer.email)
                    : scrapeGuestUserData(customer.email, args[0]);
            };

            BlueCheck.initialize();
        }
    } else {
        return callback(...args);
    }

    // shouldn't reach this
    return null;
};

export default {
    'Route/Checkout/Container': {
        'member-function': {
            componentDidMount,
            componentWillUnmount,
            componentDidUpdate
        }
    },
    'Component/CheckoutShipping/Container': {
        'member-function': {
            onShippingSuccess
        }
    }
};
