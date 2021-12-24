export const containerProps = (args, callback, instance) => {
    const { elem } = instance.props;

    return {
        ...callback(...args),
        elem
    };
};

export default {
    'Component/CheckoutAddressTable/Container': {
        'member-function': {
            containerProps
        }
    }
};
