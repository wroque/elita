define(['knockout', 'text!./users.html'], function (ko, template) {

    function Group(data) {
        this.name = ko.observable(data.name);
    }

    function Email(data) {
        this.address = ko.observable(data.address);
    }

    function Person(data) {
        this.firstname = ko.observable(data.firstname);
        this.lastname = ko.observable(data.lastname);
        this.phone = ko.observable(data.phone);
        this.address = ko.observable(data.address);
        this.birthday = ko.observable(data.birthday);
        this.sex = ko.observable(data.sex);
    }

    function User(data) {
        this.id = ko.observable(data.id);
        this.group_id = ko.observable(data.group_id);
        this.person_id = ko.observable(data.person_id);
        this.username = ko.observable(data.username);
        this.status = ko.observable(data.status);
        this.created = ko.observable(data.created);
        this.modified = ko.observable(data.modified);
        this.last_session = ko.observable(data.last_session);
        this.image = ko.observable(data.image);
        this.checked = ko.observable(false);
        this.Group = new Group(data.group);
        this.Person = new Person(data.person);
        this.Email = new Email(data.email);
        this.detail = ko.observable(false);
    }

    function UsersViewModel(route) {
        this.route = route;
        this.users = ko.observableArray();
        this.groups = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'},
            {id: false, name: 'inactivo'}
        ]);

        this.display = ko.observable(false);
        this.checked = ko.observable(false);
        this.active = ko.computed(function () {
            var arr = ko.utils.arrayFilter(this.users(), function (item) {
                return item.checked();
            });
            return arr.length > 0;
        }, this);

        this.filter = {
            Users: {
                id: ko.observable(),
                username: ko.observable(),
                group_id: ko.observable(),
                status: ko.observable(),
                created: ko.observable(''),
                last_session: ko.observable()
            },
            People: {
                firstname: ko.observable()
            },
            Emails: {
                address: ko.observable()
            },
            direction: ko.observable('asc'),
            sort: ko.observable('Users.id')
        };

        this.paging = new Paging(this);
        this.refresh();
    }

    UsersViewModel.prototype.showFilter = function () {
        this.display(!this.display());
    };

    UsersViewModel.prototype.checkAll = function (data, event) {
        ko.utils.arrayForEach(this.users(), function (item) {
            item.checked(event.target.checked);
        });
    };

    UsersViewModel.prototype.orderBy = function (str) {
        var sort = this.filter.sort(),
                by = this.filter.direction() || 'asc';

        if (sort === str) {
            by = (by === 'desc') ? 'asc' : 'desc';
        }

        this.filter.direction(by);
        this.filter.sort(str);
        this.refresh();
    };

    UsersViewModel.prototype.refresh = function () {
        var self = this,
                users = [];

        $.getJSON(baseUrl + '/users/users.json?page=' + self.paging.page(),
                ko.toJS(self.filter),
                function (data) {
                    self.paging.pageCount(data.paging.pageCount);
                    users = ko.utils.arrayMap(data.users, function (item) {
                        return new User(item);
                    });
                    self.users(users);
                });
        this.enumGroup();
    };

    UsersViewModel.prototype.update = function (self, item) {
        var id = item.id(),
                status = !item.status();
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: baseUrl + '/users/users/update.json',
            data: {
                id: id,
                status: status
            }
        }).done(function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                item.status(status);
            }
        });
    };

    UsersViewModel.prototype.updateAll = function (status) {
        var self = this,
                ids = [];
        ko.utils.arrayForEach(self.users(), function (item) {
            if (item.checked()) {
                ids.push(item.id());
            }
        });
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: baseUrl + '/users/users/update.json',
            data: {
                id: ids.join(','),
                status: status
            }
        }).done(function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                self.refresh();
            }
        });
    };

    UsersViewModel.prototype.deleteAll = function () {
        if (confirm('¿Estas Seguro?')) {
            var self = this,
                    ids = [];
            ko.utils.arrayForEach(self.users(), function (item) {
                if (item.checked()) {
                    ids.push(item.id());
                }
            });
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: baseUrl + '/admin/users/users/deleteAll.json',
                data: {
                    ids: ids.join('/')
                }
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.refresh();
                }
            });
        }
    };

    UsersViewModel.prototype.enumGroup = function () {
        var self = this,
                groups = [];
        $.getJSON(baseUrl + '/users/groups/enum.json',
                function (data) {
                    groups = $.map(data.groups, function (value, key) {
                        return {id: key, name: value};
                    });
                    self.groups(groups);
                    $('[name=groups]').trigger('chosen:updated');
                });
    };

    UsersViewModel.prototype.collapse = function () {
        this.detail(!this.detail());
    };

    return {viewModel: UsersViewModel, template: template};
});