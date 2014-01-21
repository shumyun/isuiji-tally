<?php

/**
 *    isuiji_tally v0.1.0
 *    Plug-in for Discuz!
 *    Last Updated: 2013-10-17
 *    Author: shumyun
 *    Copyright (C) 2011 - forever isuiji.com Inc
 */

if(!defined('IN_DISCUZ')) {
	exit('Access Denied');
}

/**
 * xxx_tally_loandebt
 * @type	b : 借入, l : 借出, r : 还债, d : 收债
 */
$version = '0.1.0';
$sql = <<<EOF
DROP TABLE IF EXISTS pre_tally_profile;
CREATE TABLE pre_tally_profile (
  uid mediumint(8) unsigned NOT NULL default '0',
  firstdate int(10) unsigned NOT NULL default '0',
  totalearn decimal(14,2) unsigned NOT NULL default '0.00',
  totalpay decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (uid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_account;
CREATE TABLE pre_tally_account (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  account text NOT NULL default '',
  type varchar(1) NOT NULL default '',
  status varchar(1) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_paytype;
CREATE TABLE pre_tally_paytype (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  onelv varchar(255) NOT NULL default '',
  seclv varchar(255) NOT NULL default '',
  abbr varchar(255) NOT NULL default '',
  status varchar(1) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_earntype;
CREATE TABLE pre_tally_earntype (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  onelv varchar(255) NOT NULL default '',
  seclv varchar(255) NOT NULL default '',
  abbr varchar(255) NOT NULL default '',
  status varchar(1) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_paydata;
CREATE TABLE pre_tally_paydata (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  typeid mediumint(8) unsigned NOT NULL default '0',
  accountid mediumint(8) unsigned NOT NULL default '0',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_earndata;
CREATE TABLE pre_tally_earndata (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  typeid mediumint(8) unsigned NOT NULL default '0',
  accountid mediumint(8) unsigned NOT NULL default '0',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_budget;
CREATE TABLE pre_tally_budget (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uidtime bigint(14) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  typeid mediumint(8) unsigned NOT NULL default '0',
  category varchar(255) NOT NULL default '',
  budget decimal(14,2) unsigned NOT NULL default '0.00',
  realcash decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_daytotal;
CREATE TABLE pre_tally_daytotal (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datadate int(10) unsigned NOT NULL default '0',
  earnmoney decimal(14,2) unsigned NOT NULL default '0.00',
  paymoney decimal(14,2) unsigned NOT NULL default '0.00',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_transfer;
CREATE TABLE pre_tally_transfer (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  iaccount mediumint(8) unsigned NOT NULL default '0',
  oaccount mediumint(8) unsigned NOT NULL default '0',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;


DROP TABLE IF EXISTS pre_tally_loandebt;
CREATE TABLE pre_tally_loandebt (
  cid mediumint(8) unsigned zerofill NOT NULL auto_increment,
  uid mediumint(8) unsigned NOT NULL default '0',
  type varchar(1) NOT NULL default '',
  datatime int(10) unsigned NOT NULL default '0',
  recordtime int(10) unsigned NOT NULL default '0',
  amount decimal(14,2) unsigned NOT NULL default '0.00',
  aid mediumint(8) unsigned NOT NULL default '0',
  lid mediumint(8) unsigned NOT NULL default '0',
  info varchar(255) NOT NULL default '',
  PRIMARY KEY (cid)
) ENGINE=MyISAM;
EOF;
runquery($sql);
$finish = TRUE;
?>