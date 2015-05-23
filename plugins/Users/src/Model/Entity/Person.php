<?php

namespace Users\Model\Entity;

use Cake\ORM\Entity;

class Person extends Entity {

    protected function _getFullName() {
        return $this->_properties['firstname'] . '  ' .
                $this->_properties['lastname'];
    }

}
