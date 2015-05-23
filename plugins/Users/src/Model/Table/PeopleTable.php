<?php

namespace Users\Model\Table;

use Cake\ORM\Table;

class PeopleTable extends Table {

    public function initialize(array $config) {
        $this->hasMany('Emails', [
            'className' => 'Users.Emails'
        ]);
    }

}
