<?php

/**
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link      http://cakephp.org CakePHP(tm) Project
 * @since     0.2.9
 * @license   http://www.opensource.org/licenses/mit-license.php MIT License
 */

namespace App\Controller;

use Cake\Controller\Controller;
use Cake\ORM\TableRegistry;
use Cake\Event\Event;

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @link http://book.cakephp.org/3.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller
{

    /**
     * Initialization hook method.
     *
     * Use this method to add common initialization code like loading components.
     *
     * @return void
     */
    public function initialize()
    {
        $this->loadComponent('Acl.Acl');
        $this->loadComponent('Paginator');
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Auth', [
            'loginAction' => [
                'controller' => 'Users',
                'action' => 'login',
                'plugin' => 'Users'
            ],
            'authenticate' => [
                'Form' => [
                    'userModel' => 'Users.Users',
                    'fields' => array(
                        'username' => 'username',
                        'password' => 'password'
                    ),
                    'scope' => array('status' => 1)
                ]
            ],
            'authError' => 'Did you really think you are allowed to see that?'
        ]);
    }
    
    public $theme = 'Users';

    public function beforeFilter(Event $event)
    {
        $this->settings();
//        if (empty($this->request->params['prefix'])) {
            $this->Auth->allow();
//        }
    }

    protected function count() {
        $paging = $this->request->params['paging'];
        return current($paging);
    }

    private function settings() {
        $settings = TableRegistry::get('Users.Settings');
        $query = $settings->findAllByStatus(true);

        foreach ($query as $row) {
            $const = strtoupper($row->name);
            if (!defined($const)) {
                define($const, $row->value);
            }
        }
    }
}
