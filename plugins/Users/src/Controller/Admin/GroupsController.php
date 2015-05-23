<?php

namespace Users\Controller\Admin;

use Users\Controller\AppController;

class GroupsController extends AppController
{

    public function index()
    {
        $conditions = array();
        $filter = $this->request->query;

        if (!empty($filter['Groups']['id'])) {
            $conditions['Groups.id'] = $filter['Groups']['id'];
        }

        if (!empty($filter['Groups']['name'])) {
            $conditions['Groups.name LIKE'] = '%' . $filter['Groups']['name'] . '%';
        }

        if (!empty($filter['Users']['status'])) {
            $conditions['Users.status'] = filter_var($filter['status'], FILTER_VALIDATE_BOOLEAN);
        }

        $this->paginate = [
            'fields' => [
                'Groups.id',
                'Groups.name',
                'Groups.created',
                'Groups.status',
                'Groups.description'
            ],
            'limit' => PAGINATE_LIMIT,
            'order' => [
                'Groups.id' => 'asc'
            ],
            'sortWhitelist' => [
                'Groups.id',
                'Groups.name',
                'Groups.created',
                'Groups.status',
                'Groups.description'
            ],
            'conditions' => $conditions
        ];

        $groups = $this->paginate();

        $this->set([
            'groups' => $groups,
            '_serialize' => ['groups']
        ]);
    }

    public function enum()
    {
        $groups = $this->Groups->find('list');
        $this->set([
            'groups' => $groups,
            '_serialize' => ['groups']
        ]);
    }

}
