<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title><?php echo $this->fetch('title'); ?></title>
        <!-- build:css -->
        <?php
        echo $this->Html->meta('icon');
        echo $this->Html->css([
            '../bower_modules/components-bootstrap/css/bootstrap',
            '../bower_modules/chosen_v1.3.0/chosen',
            '../bower_modules/bootstrap-datepicker/css/datepicker',
            '../bower_modules/components-font-awesome/css/font-awesome',
            '../styles/dataurl',
            '../styles/dropdown-menu',
            '../styles/admin'
        ]);
        ?>
        <!-- endbuild -->
        <script type="text/javascript">
            var baseUrl = '<?php echo $this->Url->build(); ?>';
        </script>
        <!-- build:js -->
        <?php
        echo $this->Html->script('../app/require.config.js');
        echo $this->Html->script('../bower_modules/requirejs/require.js', array('data-main' => 'app/startup.js'));
        ?>
        <!-- endbuild -->
    </head>
    <body>
        <?php echo $this->fetch('content'); ?>
        <!-- ko if: route().page === 'login' -->
        <div class="wrapper">
            <div class="header">
                <div class="brand">
                    <a href="#/login">Elita <span>Admin</span></a>
                </div>
            </div>
            <div class="cell">
                <div class="content">
                    <login params='session: session'></login>
                </div>
            </div>
        </div>
        <!-- /ko -->

        <!-- ko ifnot: route().page === 'login' -->
        <nav-bar params='session: session'></nav-bar>
        <extras></extras>

        <div class="container-fluid">
            <div class="row">
                <sidebar params='session: session, route: route'></sidebar>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <div data-bind="component: { name: route().page, params: route }"></div>
                </div>
            </div>
        </div>
        <!-- /ko -->

        <div class="footer">
            <div class="container-fluid">
                <p class="text-right">&copy; 2014. All Rights Reserved. <br/>Created by wroque</p>
            </div>
        </div>
    </body>
</html>