<h1>Add Article</h1>
<?php
    echo $this->Form->create($user);
    echo $this->Form->input('username');
    echo $this->Form->input('password');
    echo $this->Form->input('People.firstname');
    echo $this->Form->button(__('Save User'));
    echo $this->Form->end();
?>