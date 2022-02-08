import BrowserDatabase from 'Util/BrowserDatabase';
export const TIMEOUT_LISTEN_TO_CHECKOUT = 250;

//keeping this for posterity


/** @namespace BluecheckageverifySpwa/Static/BlueCheckEnablerScript/scrapeGuestUserData */
export const scrapeGuestUserData = (email = null) => {
    const userDataPrefix = 'shipping';
    const { BlueCheck } = window;
    console.log('scraping...', email);
    BlueCheck.userData.email = email || "II@IIII.II"//ithisstate.state.shippingAddress.email;
    BlueCheck.userData[`${userDataPrefix }_first_name`] = 1//thisstate.state.shippingAddress.firstname;
    BlueCheck.userData[`${userDataPrefix }_last_name`] = 1//thisstate.state.shippingAddress.lastname;
    BlueCheck.userData[`${userDataPrefix }_address`] = 1//thisstate.state.shippingAddress.street[0];
    BlueCheck.userData[`${userDataPrefix }_address2`] = 1//thisstate.state.shippingAddress.street[1];
    BlueCheck.userData[`${userDataPrefix }_address3`] =1// thisstate.state.shippingAddress.street[2];
    BlueCheck.userData[`${userDataPrefix }_city`] = 1//thisstate.state.shippingAddress.city;
    BlueCheck.userData[`${userDataPrefix }_country`] = 1//thisstate.state.shippingAddress.country_id;
    //const country = document.getElementById('country_id');
    //if (country) {
    //    BlueCheck.userData[`${userDataPrefix }_country`] = country.options[country.options.selectedIndex].innerText;
    //}

    BlueCheck.userData[`${userDataPrefix }_region`] = 1//state.region_id;
    //const region = document.getElementById('region_id');
    //if (region) {
    //    BlueCheck.userData[`${userDataPrefix }_region`] = region.options[region.options.selectedIndex].innerText;
    //}
    BlueCheck.userData[`${userDataPrefix }_phone`] = 1//state.telephone;
    BlueCheck.userData[`${userDataPrefix }_postal_code`] =1// state.postcode;
    BlueCheck.requiredFields = [`
    ${userDataPrefix }_first_name`, `${userDataPrefix }_last_name`,
    `${userDataPrefix }_country`, 'email'];
    console.log(BlueCheck.userData);
};

/** @namespace BluecheckageverifySpwa/Static/BlueCheckEnablerScript/scrapeLoggedInUserData */
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

export default (isCustomerSignedIn, addresses, email, state) => {
    const { BlueCheck } = window;
    console.log('starting...');
    BlueCheck.platformCallbacks.onReady = () => {
        function prepareButton() {
            const verifyBtn = document.getElementsByClassName('CheckoutShipping-Button')[0];
            console.log(verifyBtn);
            verifyBtn.onclick = (e) => {
                BlueCheck.platformCallbacks.onSuccess = () => {
                    BrowserDatabase.setItem(true,'blueCheck')
                    verifyBtn.click();
                };
                if (BlueCheck.validateAndDisplayModal()) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            };
        }
        function listenForCheckout() {
            console.log('listening forcheckout')
            try {
                prepareButton();
            } catch (e) {
                setTimeout(listenForCheckout, TIMEOUT_LISTEN_TO_CHECKOUT);
            }
        }
        setTimeout(listenForCheckout);
    };
    BlueCheck.platformCallbacks.scrapeUserData = () => {
        console.log('StartedScarping')
        const isCustomAddress = document
            .getElementsByClassName('CheckoutAddressBook-Button_isCustomAddressExpanded')[0] !== undefined;

        return (isCustomerSignedIn && !isCustomAddress)
            ? /*scrapeLoggedInUserData(addresses, email)*/console.log("weeee") : console.log("WAAAA")//scrapeGuestUserData(email);
    };
    
    BlueCheck.initialize();
    console.log("O O BUBU",BlueCheck)
};
