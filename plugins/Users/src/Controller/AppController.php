<?php

namespace Users\Controller;

use App\Controller\AppController as BaseController;
use Cake\ORM\TableRegistry;
use Cake\Event\Event;

class AppController extends BaseController {

    public function beforeFilter(Event $event) {
        parent::beforeFilter($event);
        $settings = TableRegistry::get('Settings');
        $query = $settings->findAllByStatus(true);

        foreach ($query as $row) {
            $const = strtoupper($row->name);
            if (!defined($const)) {
                define($const, $row->value);
            }
        }
    }

    public function initialize() {
        parent::initialize();
        $this->loadComponent('RequestHandler');
        $this->loadComponent('Paginator');
    }
    
    protected function count(){
        $paging =$this->request->params['paging'];
        return current($paging);
    }

}
