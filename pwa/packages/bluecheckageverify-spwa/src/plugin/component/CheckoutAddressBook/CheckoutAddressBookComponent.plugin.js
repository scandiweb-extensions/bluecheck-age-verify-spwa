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
 import CheckoutAddressTable from 'SourceComponent/CheckoutAddressTable';
 import { getDefaultAddressLabel } from 'Util/Address';

export const renderAddress = (args, callback, instance) => {
    console.log('!!!args: ', args)
    const { onAddressSelect, selectedAddressId } = instance.props;
    const addressNumber = args[1] + 1;
    const { id } = args[0];
    const postfix = getDefaultAddressLabel(args[0]);
    const elem = `${id}`;

    return (
        <CheckoutAddressTable
          onClick={ onAddressSelect }
          isSelected={ selectedAddressId === id }
          title={ __('Address #%s%s', addressNumber, postfix) }
          address={ args[0] }
          key={ id }
          elem={ elem }
        />
    );
};

export default {
    'Component/CheckoutAddressBook/Component': {
        'member-function': {
            renderAddress
        }
    }
};
