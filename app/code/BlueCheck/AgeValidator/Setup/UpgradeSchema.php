<?php

namespace BlueCheck\AgeValidator\Setup;

use Magento\Framework\Setup\UpgradeSchemaInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\SchemaSetupInterface;

class UpgradeSchema implements  UpgradeSchemaInterface
{

    public function upgrade(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();
        // Get module table
        $tableNames = [
            $setup->getTable('sales_order_grid'),
            $setup->getTable('sales_order')
        ];

        $connection = $setup->getConnection();

        foreach ($tableNames as $tableName) {
            // Check if the table already exists
            if ($setup->getConnection()->isTableExists($tableName) == true) {
                // Declare data
                $connection->addColumn($tableName, 
                    'bluecheck_verification_status', 
                    [
                        'type' => \Magento\Framework\DB\Ddl\Table::TYPE_TEXT,
                        'nullable' => true,
                        'comment' => 'BlueCheck Verification',
                    ]
                );
            }
        }
        $setup->endSetup();
    }
}