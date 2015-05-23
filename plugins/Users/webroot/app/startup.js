define(['jquery', 'knockout', './router', './session', 'pace', 'bootstrap', 'knockout-projections', 'functions'], function ($, ko, router, session, pace) {
    
    $.ajaxSetup({
        error: function (e) {
            switch (e.status) {
                case 401:
                case 403:
//            location.hash = '#/login';
                    break;
            }
        }
    });

    pace.start({
        document: false,
        ajax: {
            trackMethods: ['GET', 'POST', 'PUT', 'DELETE']
        }
    });

    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('nav-bar', {require: 'components/element/nav-bar'});
    ko.components.register('sidebar', {require: 'components/element/sidebar'});

    ko.components.register('login', {require: 'components/users/login'});
    ko.components.register('profile', {require: 'components/users/profile'});
    ko.components.register('users', {require: 'components/users/users'});
    ko.components.register('add-user', {require: 'components/users/add'});
    ko.components.register('edit-user', {require: 'components/users/edit'});
    ko.components.register('groups', {require: 'components/groups/groups'});
    ko.components.register('add-group', {require: 'components/groups/add'});
    ko.components.register('edit-group', {require: 'components/groups/edit'});
    ko.components.register('posts', {require: 'components/posts/posts'});
    ko.components.register('add-post', {require: 'components/posts/add'});
    ko.components.register('edit-post', {require: 'components/posts/edit'});
//    ko.components.register('menu', {require: 'components/menu/menu'});
//    ko.components.register('add-menu', {require: 'components/menus/add'});
//    ko.components.register('edit-menu', {require: 'components/menus/edit'});
    ko.components.register('link', {require: 'components/link/link'});

    ko.components.register('extras', {
        template: {require: 'text!components/element/extras.html'}
    });

    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

    // Start the application

    ko.applyBindings({route: router.currentRoute, session: session});
});
