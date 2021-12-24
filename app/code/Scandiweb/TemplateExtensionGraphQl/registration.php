<?php
/**
 * @category    Scandiweb
 * @package     Scandiweb_TemplateExtensionGraphQl
 * @author      Jort Geurts <jort.geurts@scandiweb.com | info@scandiweb.com>
 * @copyright   Copyright (c) 2021 Scandiweb, Ltd (https://scandiweb.com)
 */

declare(strict_types=1);

use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(ComponentRegistrar::MODULE, 'Scandiweb_TemplateExtensionGraphQl', __DIR__);
