<?php

namespace BlueCheck\AgeValidator\Setup;
 
use Magento\Framework\Setup\UninstallInterface;
use Magento\Framework\Setup\SchemaSetupInterface;
use Magento\Framework\Setup\ModuleContextInterface;
 
class Uninstall implements UninstallInterface
{
    public function uninstall(SchemaSetupInterface $setup, ModuleContextInterface $context)
    {
        $setup->startSetup();

        $connection = $setup->getConnection();
 
        // get tables
        $tableNames = [
            $setup->getTable('sales_order_grid'),
            $setup->getTable('sales_order')
        ];

        // Check if the table already exists
        foreach ($tableNames as $table) {
            if ($connection->isTableExists($table) == true) {

                // del_flg = column name which you want to delete
                $connection->dropColumn($table, 'del_flg');
            }
        }
 
        $setup->endSetup();
    }
}