<?php
/**
 * Created by: Marco Segura.
 * Date: 8/26/16
 */

namespace BlueCheck\AgeValidator\Helper;

class Data extends \Magento\Framework\App\Helper\AbstractHelper
{
    protected $_scopeConfig;

    CONST ENABLE    = 'bluecheck_agevalidator/general/active';
    CONST REST      = 'bluecheck_agevalidator/general/rest_api';
    CONST TOKEN     = 'bluecheck_agevalidator/general/domain_token';

    public function __construct(
        \Magento\Framework\App\Helper\Context $context,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig
    ) {
        parent::__construct($context);

        $this->_scopeConfig = $scopeConfig;
    }

    public function getEnable(){
        return $this->_scopeConfig->getValue(self::ENABLE);
    }

    public function getUrl(){
        return $this->_scopeConfig->getValue(self::REST);
    }

    public function getDomainToken()
    {
        return $this->_scopeConfig->getValue(self::TOKEN);
    }
}