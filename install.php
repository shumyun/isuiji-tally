<?php

/**
 *    account v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2012-02-28
 *    Author: shumyun
 *    Copyright (C) 2011 - forever jiashe.net Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/**
 * xxx_account_loandebt
 * @type	1 : 借入, 2 : 借出, 3 : 还债, 4 : 收债
 */
$version = '0.1.0';
$sql = <<<EOF
DROP TABLE IF EXISTS pre_account_earndata;
CREATE TABLE pre_account_earndata (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  onelv varchar(255) NOT NULL default '',
  seclv varchar(255) NOT NULL default '',
  category varchar(255) NOT NULL default '',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_paydata;
CREATE TABLE pre_account_paydata (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  onelv varchar(255) NOT NULL default '',
  seclv varchar(255) NOT NULL default '',
  category varchar(255) NOT NULL default '',
  info varchar(255) NOT NULL default '',
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
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  budget decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_loandebt;
CREATE TABLE pre_account_loandebt (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  type tinyint(2) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  category varchar(255) NOT NULL default '',
  loandebt varchar(255) NOT NULL default '',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_transfer;
CREATE TABLE pre_account_transfer (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  icategory varchar(255) NOT NULL default '',
  ocategory varchar(255) NOT NULL default '',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_account_profile;
CREATE TABLE pre_account_profile (
  uid mediumint(8) unsigned NOT NULL default '0',
  earntype text NOT NULL default '',
  paytype text NOT NULL default '',
  categorytype text NOT NULL default '',
  loandebt text NOT NULL default '',
  firstdate int(10) unsigned NOT NULL default '0',
  totalearn decimal(14,2) unsigned NOT NULL default '0.00',
  totalpay decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (uid)
) ENGINE=MyISAM;


EOF;
runquery($sql);
$finish = TRUE;
?>