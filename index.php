<?php

require_once "autoload.inc.php";
require_once "access.inc.php";

enable_error_reporting(true);

$bodyPath = "apps/sps-import";
$title = "SPS EDI Order Import";


$ui = new WebUI($bodyPath, $title, '', true, true);
$ui->release = iUI::RELEASE_LIVE;
$ui->version = '20200220';
$ui->bodyClassName = 'container-fluid';

$ui->addManifest('public/js/manifest.json');
$ui->AddCSS("public/css/styles.css?v={$ui->version}");

$ui->Send();
