<?php

namespace Users\Model\Table;

use Cake\ORM\Table;

class GroupsTable extends Table
{

    public function initialize(array $config)
    {
        $this->hasMany('Users', [
            'className' => 'Users.Users',
            'propertyName' => 'user_count'
        ]);
    }

}
