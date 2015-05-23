<?php

namespace Users\Model\Table;

use Cake\ORM\Table;

class CommunesTable extends Table
{

    public function initialize(array $config)
    {
        $this->hasMany('People', [
            'className' => 'Users.People'
        ]);
    }

}
