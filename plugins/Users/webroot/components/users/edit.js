define(['knockout', 'text!./edit.html'], function (ko, template) {

    function Person(data) {
        this.id = ko.observable(data.id);
        this.commune_id = ko.observable(data.commune_id);
        this.firstname = ko.observable(data.firstname);
        this.lastname = ko.observable(data.lastname);
        this.phone = ko.observable(data.phone);
        this.address = ko.observable(data.address);
        this.sex = ko.observable(data.sex);
    }

    function Email(data) {
        this.id = ko.observable(data.id);
        this.address = ko.observable(data.address);
    }

    function User(data) {
        this.id = ko.observable(data.id);
        this.person_id = ko.observable(data.person_id);
        this.username = ko.observable(data.username);
        this.password = ko.observable('');
        this.group_id = ko.observable(data.group_id);
        this.status = ko.observable(data.status.toString());
        this.created = ko.observable(data.created);
        this.modified = ko.observable(data.modified);
        this.image = ko.observable(data.image);
        this.Person = new Person(data.person);
        this.Email = new Email(data.email);
    }

    function EditViewModel(params) {
        this.id = params.id;
        this.User = ko.observable();
        this.groups = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);

        this.init(this);
    }

    EditViewModel.prototype.init = function (self) {
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'admin/users/users/' + self.id + '.json',
            beforeSend: function () {
                self.enumGroup();
            }
        }).done(function (data) {
            self.User(new User(data.user));
        });
    };

    EditViewModel.prototype.enumGroup = function () {
        var self = this,
                groups = [];
        $.getJSON('admin/users/groups/enum.json', function (data) {
            groups = $.map(data.groups, function (value, key) {
                return {id: key, name: value};
            });
            self.groups(groups);
            $('[name=groups]').trigger('chosen:updated');
        });
    };

    EditViewModel.prototype.save = function (form) {
        var self = this;
        $(form).validate({
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
            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: 'admin/users/users/edit/' + self.id,
                data: {
                    data: ko.toJS(self.data)
                }
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    location.hash = '/users';
                }
            });
        }
    };

    return {viewModel: EditViewModel, template: template};
});