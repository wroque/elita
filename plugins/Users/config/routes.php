<?php

use Cake\Routing\Router;

//Router::plugin('Users', function ($routes) {
//    $routes->fallbacks();
//});

Router::prefix('admin', function ($routes) {
    $routes->extensions(['json']);

    $routes->connect('/', ['plugin' => 'Users', 'controller' => 'Users', 'action' => 'login']);

    $routes->plugin('Users', function ($routes) {

        $routes->resources('Users', [
            'map' => [
                'login' => [
                    'action' => 'login',
                    'method' => 'POST'
                ],
                'logout' => [
                    'action' => 'logout',
                    'method' => 'GET'
                ],
                'session' => [
                    'action' => 'session',
                    'method' => 'GET'
                ],
                'enum' => [
                    'action' => 'enum',
                    'method' => 'GET'
                ],
                'update' => [
                    'action' => 'update',
                    'method' => 'PUT'
                ],
                'remove' => [
                    'action' => 'remove',
                    'method' => 'DELETE'
                ]
            ]
        ]);

        $routes->resources('Groups', [
            'map' => [
                'enum' => [
                    'action' => 'enum',
                    'method' => 'GET'
                ]
            ]
        ]);
        
        $routes->fallbacks();
    });
});
