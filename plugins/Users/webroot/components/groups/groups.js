define(['knockout', 'text!./groups.html'], function (ko, template) {

    function Group(data) {
        this.id = ko.observable(data.id);
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.user_count = ko.observable(data.user_count);
        this.status = ko.observable(data.status);
        this.created = ko.observable(data.created);
        this.modified = ko.observable(data.modified);
        this.checked = ko.observable(false);
    }

    function GroupsViewModel(route) {
        this.route = route;
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
            id: ko.observable(''),
//            name: ko.observable(''),
//            description: ko.observable(''),
//            created: ko.observable(''),
//            modified: ko.observable(''),
//            status: ko.observable(''),
            direction: ko.observable('asc'),
            sort: ko.observable('Groups.id')
        };

        this.paging = new Paging(this);
        this.refresh();
    }

    GroupsViewModel.prototype.showFilter = function () {
        this.filter.display(!this.filter.display());
    };

    GroupsViewModel.prototype.checkAll = function (data, event) {
        ko.utils.arrayForEach(this.groups(), function (item) {
            item.Group.checked(event.target.checked);
        });
        return true;
    };

    GroupsViewModel.prototype.orderBy = function (str) {
        var order = this.filter.order();
        if (order.indexOf('DESC') === -1) {
            this.filter.order(str + ' DESC');
        } else {
            this.filter.order(str);
        }
    };

    GroupsViewModel.prototype.refresh = function () {
        var self = this;
        $.getJSON('admin/users/groups/index/page:' + self.paging.page(),
                ko.toJS(self.filter),
                function (data) {
                    self.paging.set(data.paging);
                    var map = ko.utils.arrayMap(data.groups, function (item) {
                        return {Group: new Group(item.Group)};
                    });
                    self.groups(map);
                });
    };

    GroupsViewModel.prototype.remove = function (self, item) {
        if (confirm('¿Estas Seguro?')) {
            var id = item.Group.id();
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/users/groups/delete/' + id
            }).done(function (data) {
                if (data.message.type === 'success') {
                    self.groups.remove(item);
                }
                notify(data.message);
            });
        }
    };

    GroupsViewModel.prototype.update = function (item) {
        var status = !item.Group.status(),
                id = item.Group.id();
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: 'admin/users/groups/status/' + id,
            data: {
                'data[Group][status]': status
            }
        }).done(function (data) {
            if (data.message.type === 'success') {
                item.Group.status(status);
            }
            notify(data.message);
        });
    };

    GroupsViewModel.prototype.removeAll = function () {
        var self = this,
                ids = [];
        ko.utils.arrayForEach(self.groups(), function (item) {
            if (item.Group.checked()) {
                ids.push(item.Group.id());
            }
        });

        if (ids.length > 0 && confirm('¿Estas Seguro?')) {
            var params = ids.join('/');
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/users/groups/delete/' + params
            }).done(function (data) {
                if (data.message.type === 'success') {
                    self.refresh();
                } else {
                    notify(data.message);
                }
            });
        }
    };

    return {viewModel: GroupsViewModel, template: template};
});