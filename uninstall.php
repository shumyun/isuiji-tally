<?php
/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2011-10-03
 *    Author: shumyun
 *    Copyright (C) 2011 - forever 57day.com Inc
 */

!defined('IN_DISCUZ') && exit('Access Denied');
$sql = <<<EOF
DROP TABLE IF EXISTS pre_account_data;
DROP TABLE IF EXISTS pre_account_profile;
EOF;
runquery($sql);
$finish = TRUE;
?>
