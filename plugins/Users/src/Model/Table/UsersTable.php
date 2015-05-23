<?php

namespace Users\Model\Table;

use Cake\ORM\Table;
use Cake\Validation\Validator;

class UsersTable extends Table {

    public function initialize(array $config) {

        $this->belongsTo('Groups', [
            'className' => 'Users.Groups',
            'foreignKey' => 'group_id'
        ]);

        $this->belongsTo('People', [
            'className' => 'Users.People',
            'foreignKey' => 'person_id',
            'dependent' => true
        ]);

        $this->hasOne('Emails', [
            'className' => 'Users.Emails',
            'conditions' => ['Emails.status' => true],
            'dependent' => true
        ]);

//        $this->addBehavior('CounterCache', [
//            'User.Groups' => ['user_count']
//        ]);
    }

    public function validationDefault(Validator $validator) {
        return $validator
                        ->notEmpty('username', 'A username is required')
                        ->notEmpty('password', 'A password is required');
    }

}
