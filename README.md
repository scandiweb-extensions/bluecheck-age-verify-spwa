#  bluecheckageverify-spwa version: 1
ScandiPWA extension for Compatibility with BlueCheck's age verification technology.
### Created as support for BlueCheck_AgeValidator Version: 2

#### Tested on:
* Magento2:`2.4.3`
* ScandiPWA:`5.0.6`

## Installation steps for future developers:
Since the official way of installing the module on Luma won't work with scandipwa, we have a modified way of installing the extension, please follow the instructions below:

1. Put the scandipwa package named: `bluecheckageverify-spwa` into the scandipwa/packages folder, make sure you include/enable it on package.json.

2. Go to the file: `bluecheckageverify-spwa/src/plugin/route/Checkout/CheckoutPlugin.config.js`, you'll notice this part:
`domain_token=ADD_YOUR_DOMAIN_TOKEN_HERE`
Replace that inside with your your domain's provided domain token. ( You can get that from the BlueCheck's portal ).

1. Download the BlueCheck's Secondary Check Magento module from here: https://merchant.bluecheck.me/docs/platforms/magento2#secondary , follow the installation instructions for secondary check module section only and make sure it's working as intended according to the webpage above.
