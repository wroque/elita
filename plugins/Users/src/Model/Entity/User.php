<?php

namespace Users\Model\Entity;

use Cake\Auth\DefaultPasswordHasher;
use Cake\ORM\TableRegistry;
use Cake\ORM\Entity;

class User extends Entity {

    protected function _setPassword($password) {
        return (new DefaultPasswordHasher)->hash($password);
    }

    protected function _getPeople() {
        $people = TableRegistry::get('People');
        return $people->find()
                        ->where(['People.id' => $this->person_id])
                        ->first();
    }

}
