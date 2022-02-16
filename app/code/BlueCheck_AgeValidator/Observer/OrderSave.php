<?php
/**
 * Created by: Marco Segura.
 * Date: 12/26/16
 */

namespace BlueCheck\AgeValidator\Observer;
use Magento\Checkout\Exception;
use Magento\Framework\Event\ObserverInterface;
use Magento\Sales\Model\Order;
class OrderSave implements ObserverInterface
{
    const BLUECHECK_URL = 'https://verify.bluecheck.me/platforms/magento2/webhooks/order-created';
    const BLUECHECK_DEV_URL = 'https://verify-dev.bluecheck.me/platforms/magento2/webhooks/order-created';

    /**
     * order_id => increment_id
     * domain => Base_url
     * first_name => billing->firstname
     * last_name => billing->lastname
     * email => customer->email
     * shipping_country => shipping-countryId
     * shipping_state => shipping->stateCode
     * shipping_zipcode => shipping->zipcode
     * shipping_city => shipping->city
     * shipping_street => shipping->street
     * created_at => created_at
     * items => array
     * items_sku => product->getSku
     * items_price => product->getFinalPrice
     * items_qty => product->getQuantity
     */

    protected $_logger;
    protected $_storeManager;
    public function __construct(
        \Psr\Log\LoggerInterface $logger,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \Magento\Directory\Model\CountryFactory $countryFactory,
        \Magento\Framework\Stdlib\DateTime\DateTime $date,
        \BlueCheck\AgeValidator\Helper\Data $helper,
        array $data = []
    ) {
        $this->_logger = $logger;
        $this->_storeManager = $storeManager;
        $this->_countryFactory = $countryFactory;
        $this->date = $date;
        $this->helper = $helper;
    }

    public function execute(\Magento\Framework\Event\Observer $observer)
    {

        if($this->helper->getEnable()){
            $order = $observer->getEvent()->getOrder();
            $obj = array(
                'domain' => $this->_storeManager->getStore()->getBaseUrl(),
                'domain_token' => $this->helper->getDomainToken(),
                'order_id' => $order->getIncrementId(),
                'created_at' => $this->date->gmtDate(),
                'addressData' => [
                    'email' => $order->getShippingAddress()->getEmail(),
                    'shipping_first_name' => $order->getShippingAddress()->getFirstname(),
                    'shipping_last_name' => $order->getShippingAddress()->getLastname(),
                    'shipping_address' => $order->getShippingAddress()->getStreet(1),
                    'shipping_city' => $order->getShippingAddress()->getCity(),
                    'shipping_state' => $order->getShippingAddress()->getRegion(),
                    'shipping_country' => $order->getShippingAddress()->getCountryId(),
                    'shipping_postal_code' => $order->getShippingAddress()->getPostcode(),
                    'billing_first_name' => $order->getBillingAddress()->getFirstname(),
                    'billing_last_name' => $order->getBillingAddress()->getLastname(),
                    'billing_address' => $order->getBillingAddress()->getStreet(1),
                    'billing_city' => $order->getBillingAddress()->getCity(),
                    'billing_state' => $order->getBillingAddress()->getRegion(),
                    'billing_country' => $order->getBillingAddress()->getCountryId(),
                    'billing_postal_code' => $order->getBillingAddress()->getPostcode(),
                ],
            );

            $data_string = json_encode($obj);

            /**
             * Sending json object to BlueCheck webhook
             */
            try {
                // $curl = curl_init(self::BLUECHECK_URL);
                $secondayCheckCurl = curl_init(self::BLUECHECK_URL);
                curl_setopt($secondayCheckCurl, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($secondayCheckCurl, CURLOPT_POSTFIELDS, $data_string);
                curl_setopt($secondayCheckCurl, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($secondayCheckCurl, CURLOPT_HTTPHEADER, array(
                        'Content-Type: application/json',
                        'Content-Length: ' . strlen($data_string))
                );

                $result = curl_exec($secondayCheckCurl);
                curl_close($secondayCheckCurl);

                // secondary check was successful
                if ($result != 'failed') {
                    $order->setBluecheckVerificationStatus("Verified");
                    $order->save();
                }
                else {
                    // secondary check failed so we need to update order status
                    /**
                     * Possible statuses
                     *
                     * canceled. pending and holded
                     */ 
                    $order->addStatusHistoryComment("BlueCheck couldn't verify this order.");
                    $order->setBluecheckVerificationStatus("Not Verified");
                    $order->save();
                }

                return $this;

            } catch(Exception $e){
                $this->_logger->log(100,print_r($e->getMessage(),true));
            }
        }
    }
}