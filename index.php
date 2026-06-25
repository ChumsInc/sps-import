<?php

use chums\ui\WebUI2;
use chums\user\Groups;
use chums\ui\JSOptions;
use chums\ui\CSSOptions;

require_once "autoload.inc.php";

$ui = new WebUI2([
    'title' => 'SPS EDI Order Import',
    'bodyClassName' => 'container-fluid',
    'requiredRoles' => [Groups::CS],
]);
$ui->addCSS('public/css/styles.css', CSSOptions::parse(['useTimestampVersion' => true]))
    ->addViteManifest()
    ->render();
