<?php
use Cake\Routing\Router;

Router::plugin('Posts', function ($routes) {
    $routes->fallbacks('InflectedRoute');
});
