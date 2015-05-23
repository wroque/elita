define(['knockout', 'text!./menus.html'], function (ko, template) {

    function Menu(data) {
        this.id = ko.observable(data.id);
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.status = ko.observable(data.status);
        this.link_count = ko.observable(data.link_count);
        this.checked = ko.observable(false);
        this.alias = ko.computed(function () {
            var result = data.alias;
            if (data.alias.length === 0 && this.name().length > 0) {
                $.getJSON('admin/menus/menus/slug/' + this.name(),
                        function (data) {
                            result = data.slug;
                        });
            }
            return result;
        }, this);
    }

    function MenusViewModel(params) {
        this.route = params.route;
        this.data = ko.observable();
        this.menus = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
        this.filter = {
            id: ko.observable(''),
            name: ko.observable(''),
            alias: ko.observable(''),
            description: ko.observable(''),
            status: ko.observable(''),
            display: ko.observable(false)
        };
        this.checked = ko.observable(false);
        this.paging = new Paging(this);

        this.clear(this);
        this.refresh();
    }

    MenusViewModel.prototype.showFilter = function () {
        this.filter.display(!this.filter.display());
    };

    MenusViewModel.prototype.checkAll = function (data, event) {
        ko.utils.arrayForEach(this.menus(), function (item) {
            item.Menu.checked(event.target.checked);
        });
        return true;
    };

    MenusViewModel.prototype.refresh = function () {
        var self = this;
        $.getJSON('admin/menus/menus/index/page:' + self.paging.page(),
                ko.toJS(self.filter),
                function (data) {
                    self.paging.set(data.paging);
                    var map = ko.utils.arrayMap(data.menus, function (item) {
                        return {Menu: new Menu(item.Menu)};
                    });
                    self.menus(map);
                });
    };

    MenusViewModel.prototype.remove = function (self, item) {
        if (confirm('¿Estas Seguro?')) {
            var id = item.Menu.id();
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/menus/menus/delete/' + id
            }).done(function (data) {
                if (data.message.type === 'success') {
                    self.menus.remove(item);
                }
                notify(data.message);
            });
        }
    };

    MenusViewModel.prototype.duplicate = function (self, item) {
        var id = item.Menu.id();
        $.getJSON('admin/menus/menus/duplicate/' + id,
                function (data) {
                    notify(data.message);
                    if (data.message.type === 'success') {
                        self.data({
                            Menu: new Menu(data.menu.Menu)
                        });
                        self.menus.unshift(self.data());
                    }
                });
    };

    MenusViewModel.prototype.update = function (item) {
        var status = !item.Menu.status(),
                id = item.Menu.id();
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: 'admin/menus/menus/status/' + id,
            data: {
                'data[Menu][status]': status
            }
        }).done(function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                item.Menu.status(status);
            }
        });
    };

    MenusViewModel.prototype.removeAll = function () {
        var self = this,
                ids = [];
        ko.utils.arrayForEach(self.menus(), function (item) {
            if (item.Menu.checked()) {
                ids.push(item.Menu.id());
            }
        });

        if (ids.length > 0 && confirm('¿Estas Seguro?')) {
            var params = ids.join('/');
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/menus/menus/delete/' + params
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.refresh();
                }
            });
        }
    };

    MenusViewModel.prototype.clear = function (self) {
        self.data({
            Menu: new Menu({
                id: null,
                name: '',
                alias: '',
                description: '',
                status: 'false',
                link_count: 0
            })
        });
    };

    MenusViewModel.prototype.edit = function (self, item) {
        $.getJSON('admin/menus/menus/view/' + item.Menu.id(),
                function (data) {
                    data.status = data.status.toStting();
                    self.data({
                        Menu: new Menu(data.menu.Menu)
                    });
                });
    };

    MenusViewModel.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                alias: 'required',
                status: 'required'
            }
        });

        if ($(form).valid()) {
            if (self.Menu().id() !== null) {
                $.ajax({
                    type: 'PUT',
                    dataType: 'json',
                    url: 'admin/menus/menus/edit',
                    data: {
                        data: ko.toJS(self.data)
                    }
                }).done(function (data) {
                    notify(data.message);
                    if (data.message.type === 'success') {
                        self.refresh();
                    }
                });
            } else {
                $.post('admin/menus/menus/add', {
                    data: ko.toJS(self.data)
                }, function (data) {
                    notify(data.message);
                    if (data.message.type === 'success') {
                        self.refresh();
                    }
                }, 'json');
            }
        }
    };

    return {viewModel: MenusViewModel, template: template};
});