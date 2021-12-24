export const scrapeGuestUserData = (email = null) => {
    var userDataPrefix = 'shipping';
    BlueCheck.userData['email'] = email ? email
    : (document.getElementById('email')) ? document.getElementById('email').value
    : document.getElementById('guest_email');
    BlueCheck.userData[userDataPrefix + '_first_name'] = document.getElementById('firstname').value;
    BlueCheck.userData[userDataPrefix + '_last_name'] = document.getElementById('lastname').value;
    BlueCheck.userData[userDataPrefix + '_address'] = document.getElementById('street0').value;
    BlueCheck.userData[userDataPrefix + '_address2'] = document.getElementById('street1').value;
    BlueCheck.userData[userDataPrefix + '_address3'] = document.getElementById('street2').value;
    BlueCheck.userData[userDataPrefix + '_city'] = document.getElementById('city').value;
    const country = document.getElementById('country_id');
    if(country){
        BlueCheck.userData[userDataPrefix + '_country'] = country.options[country.options.selectedIndex].innerText;
    }

    const region = document.getElementById('region_id');
    if(region){
        BlueCheck.userData[userDataPrefix + '_region'] = region.options[region.options.selectedIndex].innerText;
    }
    BlueCheck.userData[userDataPrefix + '_phone'] = document.getElementById('telephone').value;
    BlueCheck.userData[userDataPrefix + '_postal_code'] = document.getElementById('postcode').value;
    BlueCheck.requiredFields = [userDataPrefix + '_first_name', userDataPrefix + '_last_name', userDataPrefix + '_country', 'email'];
};

export const scrapeLoggedInUserData = (addresses, email) => {

    const chosenAddressId =  Number(document.getElementsByClassName("CheckoutAddressTable-Button_isSelected")[0].parentElement.classList[1]);
    const address = addresses.find(address => chosenAddressId == address.id );

    var userDataPrefix = 'shipping';
    BlueCheck.userData['email'] = email;
    BlueCheck.userData[userDataPrefix + '_first_name'] = address['firstname'];
    BlueCheck.userData[userDataPrefix + '_last_name'] = address['lastname'];
    BlueCheck.userData[userDataPrefix + '_address'] = address['street'][0];
    BlueCheck.userData[userDataPrefix + '_address2'] = address['street'][1];
    BlueCheck.userData[userDataPrefix + '_address3'] = address['street'][2];
    BlueCheck.userData[userDataPrefix + '_city'] = address['city'];
    BlueCheck.userData[userDataPrefix + '_country'] = address['country_id'];
    BlueCheck.userData[userDataPrefix + '_region'] = address['region'].region;

    BlueCheck.userData[userDataPrefix + '_phone'] = address['telephone'];
    BlueCheck.userData[userDataPrefix + '_postal_code'] = address['postcode'];
    BlueCheck.requiredFields = [userDataPrefix + '_first_name', userDataPrefix + '_last_name', userDataPrefix + '_country', 'email'];

};

export default (isCustomerSignedIn, addresses, email) => {
        BlueCheck.platformCallbacks.onReady = () => {

            function prepareButton() {

                const verifyBtn = document.getElementsByClassName('CheckoutShipping-Button')[0];
                verifyBtn.addEventListener('click', function(e) {
                    BlueCheck.platformCallbacks.onSuccess = function() {
                        verifyBtn.click();
                    }
                    if (BlueCheck.validateAndDisplayModal()) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                })
            }
            function listenForCheckout(){
                try {
                    prepareButton()
                }
                catch(e){
                    console.log(e)
                    setTimeout(listenForCheckout,250)
                }
            }
            setTimeout(listenForCheckout)
        }
        BlueCheck.platformCallbacks.scrapeUserData = () => {
            const isCustomAddress = document.getElementsByClassName('CheckoutAddressBook-Button_isCustomAddressExpanded')[0] !=  undefined;
            (isCustomerSignedIn && !isCustomAddress) ? scrapeLoggedInUserData(addresses, email) : scrapeGuestUserData(email)
        };
        BlueCheck.initialize()
};
