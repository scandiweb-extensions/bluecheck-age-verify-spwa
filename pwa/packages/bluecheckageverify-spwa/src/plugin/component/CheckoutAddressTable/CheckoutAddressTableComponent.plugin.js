import Loader from 'SourceComponent/Loader';

export const render = (args, callback, instance) => {
    const { countries, elem } = instance.props;
    const classNames = `CheckoutAddressTable ${elem}`;
    return (
        <div block={ classNames }>
            <Loader isLoading={ !countries.length } />
            { instance.renderTable() }
        </div>
    );
};

export default {
    'Component/CheckoutAddressTable/Component': {
        'member-function': {
            render
        }
    }
};
