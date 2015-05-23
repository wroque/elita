define(['knockout', 'text!./profile.html'], function (ko, template) {

    function User(data) {
        this.id = ko.observable(data.id);
        this.person_id = ko.observable(data.person_id);
        this.username = ko.observable(data.username);
        this.image = ko.observable(data.image);
        this.password = ko.observable('');
    }

    function Person(data) {
        this.id = ko.observable(data.id);
        this.commune_id = ko.observable(data.commune_id);
        this.name = ko.observable(data.name);
        this.lastname = ko.observable(data.lastname);
        this.phone = ko.observable(data.phone);
        this.address = ko.observable(data.address);
        this.sex = ko.observable(data.sex);
    }

    function Email(data) {
        this.id = ko.observable(data.id);
        this.user_id = ko.observable(data.user_id);
        this.address = ko.observable(data.address);
    }

    function ProfileViewModel() {
        this.User = null;
        this.Email = null;
        this.Person = null;
        this.communes = ko.observableArray([]);
        this.init(this);
    }


    ProfileViewModel.prototype.image = function (element, event) {
        var files = event.target.files;
        if (files && files[0]) {
            if (files[0].type.match('image.*')) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    this.User.image(e.target.result);
                };
                reader.readAsDataURL(files[0]);
            }
        }
    };

    ProfileViewModel.prototype.init = function (self) {
        $.ajax({
            type: 'GET',
            async: false,
            dataType: 'json',
            url: 'admin/users/users/profile/',
            beforeSend: function () {
                self.listCommune();
            }
        }).done(function (data) {
            self.User = new User(data.user.User);
            self.Email = new Email(data.user.Email);
            self.Person = new Person(data.user.Person);
        });
    };

    ProfileViewModel.prototype.listCommune = function () {
        var self = this,
                communes = [];
        $.getJSON('admin/users/communes/list', function (data) {
            communes = $.map(data.communes, function (value, key) {
                return {id: key, name: value};
            });
            self.communes(communes);
            $('[name=communes]').trigger('chosen:updated');
        });
    };

    ProfileViewModel.prototype.profile = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                lastname: 'required',
                email: {
                    email: true,
                    required: true
                },
                address: 'required'
            }
        });

        if ($(form).valid()) {
            $.post('admin/users/users/profile', {
                'data[Person]': ko.toJS(self.Person),
                'data[Email]': ko.toJS(self.Email)
            }, function (data) {
                notify(data.message);
            }, 'json');
        }
    };

    ProfileViewModel.prototype.password = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                password: 'required',
                confirm: {
                    equalTo: '[name=password]'
                }
            }
        });

        if ($(form).valid()) {
            $.post('admin/users/users/password', {
                'data[User][password]': self.User.password()
            }, function (data) {
                notify(data.message);
            }, 'json');
        }
    };

    ProfileViewModel.prototype.image = function (form) {
        $.ajax({
            type: 'POST',
            cache: false,
            dataType: 'json',
            url: 'admin/users/users/image',
            contentType: false,
            processData: false,
            data: new FormData(form)
        }).done(function (data) {
            notify(data.message);
        });
    };

    return {viewModel: ProfileViewModel, template: template};
});