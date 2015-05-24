<?php

namespace Users\Controller\Admin;

use Users\Controller\AppController;
use Cake\Utility\Text;
use Users\Model\Entity\User;
use Cake\I18n\Time;

class UsersController extends AppController {

    public function login() {
        if ($this->request->is('post')) {
            $user = $this->Auth->identify();
            if ($user) {
                $this->Auth->setUser($user);
                $message = [
                    'message' => __('Welcome!'),
                    'type' => 'success'
                ];
            } else {
                $message = [
                    'message' => __('Invalid username or password, try again'),
                    'type' => 'error'
                ];
            }
            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

    public function logout() {
        $this->Auth->logout();

        $message = [
            'message' => __('Session close.'),
            'type' => 'success'
        ];

        $this->set([
            'message' => $message,
            '_serialize' => ['message']
        ]);
    }

    public function session() {
        $user = $this->Auth->user();
        $this->set([
            'user' => $user,
            '_serialize' => ['user']
        ]);
    }

    public function index() {
        $this->paginate = [
            'fields' => [
                'Users.id',
                'Users.group_id',
                'Users.username',
                'Users.created',
                'Users.status',
                'Groups.name',
                'People.firstname',
                'People.lastname',
                'People.phone',
                'People.address',
                'People.birthday',
                'People.sex',
                'Emails.address'
            ],
            'contain' => [
                'Groups', 'People', 'Emails'
            ],
            'limit' => PAGINATE_LIMIT,
            'order' => [
                'Users.id' => 'asc'
            ],
            'sortWhitelist' => [
                'Users.id',
                'Users.username',
                'Users.created',
                'Users.status',
                'Groups.name',
                'People.firstname',
                'Emails.address'
            ]
        ];

        $filter = $this->request->query;
        $conditions = array();

        if (!empty($filter['Users']['id'])) {
            $conditions['Users.id'] = $filter['Users']['id'];
        }

        if (!empty($filter['Users']['username'])) {
            $conditions['Users.username LIKE'] = '%' . $filter['Users']['username'] . '%';
        }

        if (!empty($filter['Users']['group_id'])) {
            $conditions['Groups.id'] = $filter['Users']['group_id'];
        }

        if (!empty($filter['People']['firstname'])) {
            $conditions['People.firstname LIKE'] = '%' . $filter['People']['firstname'] . '%';
        }

        if (!empty($filter['Emails']['address'])) {
            $conditions['Emails.address LIKE'] = '%' . $filter['Emails']['address'] . '%';
        }

        if (!empty($filter['Users']['created'])) {
            $created = Time::createFromFormat('d-m-Y', $filter['Users']['created']);
            array_push($conditions, [
                'Users.created >=' => $created->i18nFormat('YYYY-MM-dd 00:00:00'),
                'Users.created <=' => $created->i18nFormat('YYYY-MM-dd 23:59:59')
            ]);
        }

        if (!empty($filter['Users']['modified'])) {
            $created = Time::createFromFormat('d-m-Y', $filter['Users']['modified']);
            array_push($conditions, [
                'Users.modified >=' => $created->i18nFormat('YYYY-MM-dd 00:00:00'),
                'Users.modified <=' => $created->i18nFormat('YYYY-MM-dd 23:59:59')
            ]);
        }

        if (!empty($filter['Users']['status'])) {
            $conditions['Users.status'] = filter_var($filter['Users']['status'], FILTER_VALIDATE_BOOLEAN);
        }

        $this->paginate['conditions'] = $conditions;

        $users = $this->paginate();
        $paging = $this->count();

        $this->set(compact('users', 'paging'));
        $this->set('_serialize', ['users', 'paging']);
    }

    public function view($id = null) {
        $user = $this->Users->find()
                ->contain(['People', 'Emails'], true)
                ->where(['Users.id' => $id])
                ->first();

        $this->set([
            'user' => $user,
            '_serialize' => ['user']
        ]);
    }

    public function add() {
        $user = new User();
        if ($this->request->is('post')) {
            $user = $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {
                $message = [
                    'message' => __('The user has been saved.'),
                    'type' => 'success'
                ];
            } else {
                $message = [
                    'message' => __('Unable to add the user.'),
                    'type' => 'error'
                ];
            }

            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

    public function edit($id = null) {
        $user = $this->Users->get($id);
        if ($this->request->is(['post', 'put'])) {
            $this->Users->patchEntity($user, $this->request->data);
            if ($this->Users->save($user)) {
                $message = [
                    'message' => __('Your user has been updated.'),
                    'type' => 'success'
                ];
            } else {
                $message = [
                    'message' => __('Unable to update your user.'),
                    'type' => 'error'
                ];
            }

            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

    public function update() {
        if ($this->request->is(['post', 'put'])) {
            $status = $this->request->data['status'];
            $ids = Text::tokenize($this->request->data['id'], ',');
            if ($this->Users->updateAll(['status' => $status], ['id IN' => $ids])) {
                $message = [
                    'message' => __('Your user has been updated.'),
                    'type' => 'success'
                ];
            } else {
                $message = [
                    'message' => __('Unable to update your user.'),
                    'type' => 'error'
                ];
            }

            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

    public function remove() {
        if ($this->request->is(['post', 'put'])) {
            $ids = Text::tokenize($this->request->data['ids'], ',');
            if ($this->Users->deleteAll(['id IN' => $ids])) {
                $message = [
                    'message' => __('Your user has been deleted.'),
                    'type' => 'success'
                ];
            } else {
                $message = [
                    'message' => __('Unable to delete your user.'),
                    'type' => 'success'
                ];
            }

            $this->set([
                'message' => $message,
                '_serialize' => ['message']
            ]);
        }
    }

}
