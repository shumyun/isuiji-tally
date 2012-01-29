<?php
/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2011-01-19
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/*
 * pre_account_data : 存储数据表
 *		{
 *			datatype : 1/支出类型；
 *		}
 */
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


DROP TABLE IF EXISTS pre_account_daytotal;
CREATE TABLE pre_account_daytotal (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datadate int(10) unsigned NOT NULL default '0',
  earnmoney decimal(14,2) unsigned NOT NULL default '0.00',
  paymoney decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_budget;
CREATE TABLE pre_account_budget (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datadate int(10) unsigned NOT NULL default '0',
  budget decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_profile;
CREATE TABLE pre_account_profile (
  uid mediumint(8) unsigned NOT NULL default '0',
  titleincome text NOT NULL default '',
  titlepay text NOT NULL default '',
  categorytype text NOT NULL default '',
  firstdate int(10) unsigned NOT NULL default '0',
  totalearn decimal(14,2) unsigned NOT NULL default '0.00',
  totalpay decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (uid)
) ENGINE=MyISAM;


EOF;
runquery($sql);
$finish = TRUE;
?>