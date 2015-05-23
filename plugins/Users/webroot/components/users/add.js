define(['knockout', 'text!./add.html'], function (ko, template) {

    function User() {
        this.id = ko.observable();
        this.person_id = ko.observable();
        this.username = ko.observable('');
        this.password = ko.observable('');
        this.group_id = ko.observable();
        this.status = ko.observable('false');
    }

    function Person() {
        this.id = ko.observable();
        this.commune_id = ko.observable();
        this.name = ko.observable('');
        this.lastname = ko.observable('');
        this.phone = ko.observable('');
        this.address = ko.observable('');
        this.sex = ko.observable();
    }

    function Email() {
        this.id = ko.observable();
        this.address = ko.observable('');
    }

    function AddUserViewModel() {
        this.data = ko.observable({
            User: new User(),
            Person: new Person(),
            Email: new Email()
        });
        this.groups = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
        this.listGroup();
    }

    AddUserViewModel.prototype.listGroup = function () {
        var self = this,
                groups = [];
        $.getJSON('admin/users/groups/enum', function (data) {
            groups = $.map(data.groups, function (value, key) {
                return {id: key, name: value};
            });
            self.groups(groups);
            $('[name=groups]').trigger('chosen:updated');
        });
    };

    AddUserViewModel.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            onsubmit: false,
            rules: {
                username: 'required',
                password: 'required',
                name: 'required',
                email: {
                    required: true,
                    email: true
                }
            }
        });

        if ($(form).valid()) {
            $.post('admin/users/users/add', {
                data: ko.toJS(self.data)
            }, function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    location.hash = '/users';
                }
            }, 'json');
        }
    };

    return {viewModel: AddUserViewModel, template: template};
});