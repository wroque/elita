define(['knockout', 'text!./links.html'], function (ko, template) {

    function Link(data) {
        this.id = ko.observable(data.id);
        this.title = ko.observable(data.title);
        this.link = ko.observable(data.link);
        this.status = ko.observable(data.status.toString());
        this.checked = ko.observable(false);
    }

    function LinksViewModel(params) {
        this.menu_id = params.id;
        this.tree = ko.observableArray();
        this.links = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
        this.checked = ko.observable(false);

        this.filter = {
            id: ko.observable(''),
            title: ko.observable(''),
            slug: ko.observable(''),
            status: ko.observable(''),
            menu_id: ko.observable(this.menu_id),
            display: ko.observable(false),
            page: ko.observable(1)
        };

        this.paging = new Paging(this);
        this.refresh();
    }

    LinksViewModel.prototype.showFilter = function () {
        this.filter.display(!this.filter.display());
    };

    LinksViewModel.prototype.checkAll = function (data, event) {
        ko.utils.arrayForEach(this.links(), function (item) {
            item.Link.checked(event.target.checked);
        });
        return true;
    };

    LinksViewModel.prototype.paginate = function (page) {
        this.filter.page(page);
        this.refresh();
    };

    LinksViewModel.prototype.refresh = function () {
        var self = this,
                links = [];
        $.getJSON('admin/menus/links/index/page:' + self.filter.page(),
                ko.toJS(self.filter),
                function (data) {
                    self.paging.set(data.paging);
                    links = ko.utils.arrayMap(data.links, function (item) {
                        return {Link: new Link(item.Link)};
                    });
                    self.links(links);

                });
    };

    LinksViewModel.prototype.remove = function (self, item) {
        if (confirm('¿Estas Seguro?')) {
            var id = item.Link.id();
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/menus/links/delete/' + id
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.links.remove(item);
                }
            });
        }
    };

    LinksViewModel.prototype.duplicate = function (self, item) {
        var id = item.Link.id();
        $.getJSON('admin/menus/links/duplicate/' + id, function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                self.links.unshift(new Link(data.link.Link));
            }
        });
    };

    LinksViewModel.prototype.update = function (item) {
        var status = !item.Link.status(),
                id = item.Link.id();
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: 'admin/menus/links/status/' + id,
            data: {
                'data[Link][status]': status
            }
        }).done(function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                item.Link.status(status);
            }
        });
    };

    LinksViewModel.prototype.removeAll = function () {
        var self = this,
                ids = [];
        ko.utils.arrayForEach(self.links(), function (item) {
            if (item.Link.checked()) {
                ids.push(item.Link.id());
            }
        });

        if (ids.length > 0 && confirm('¿Estas Seguro?')) {
            var params = ids.join('/');
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/menus/links/delete/' + params
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.refresh();
                }
            });
        }
    };

    LinksViewModel.prototype.edit = function (self, item) {
        $.getJSON('admin/menus/links/view/' + item.Menu.id(),
                function (data) {
                    self.Link(new Link(data.link.Link));
                });
    };
    
    

    LinksViewModel.prototype.list = function (self, item) {
        $.getJSON('admin/menus/links/list/',
                function (data) {
                    self.tree(data);
                });
    };

    return {viewModel: LinksViewModel, template: template};
});