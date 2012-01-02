<?php
/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2011-10-03
 *    Author: shumyun
 *    Copyright (C) 2011 - forever 57day.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

$version = '0.1.0';
$sql = <<<EOF
DROP TABLE IF EXISTS pre_account_data;
CREATE TABLE pre_account_data (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  title varchar(255) NOT NULL default '',
  category varchar(255) NOT NULL default '',
  info varchar(255) NOT NULL default '',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  datatype int(2) unsigned NOT NULL default '0',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_profile;
CREATE TABLE pre_account_profile (
  uid mediumint(8) unsigned NOT NULL default '0',
  titleincome text NOT NULL default '',
  titlepay text NOT NULL default '',
  categorytype text NOT NULL default '',
  firstdate int(10) unsigned NOT NULL default '0',
  PRIMARY KEY (uid)
) ENGINE=MyISAM;


EOF;
runquery($sql);
$finish = TRUE;
?>