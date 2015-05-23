define(['knockout', 'text!./posts.html'], function (ko, template) {

    function Terms(data) {
        this.name = ko.observable(data.name);
    }

    function Post(data) {
        this.id = ko.observable(data.id);
        this.group_id = ko.observable(data.group_id);
        this.title = ko.observable(data.title);
        this.slug = ko.observable(data.slug);
        this.content = ko.observable(data.content);
        this.comment_status = ko.observable(data.comment_status);
        this.comment_count = ko.observable(data.comment_count);
        this.posts_taxonomy_count = ko.observable(data.posts_taxonomy_count);
        this.content_type = ko.observable(data.content_type);
        this.status = ko.observable(data.status);
        this.created = ko.observable(data.created);
        this.modified = ko.observable(data.modified);
        this.checked = ko.observable(false);
    }

    function Person(data) {
        this.name = ko.observable(data.name);
        this.lastname = ko.observable(data.lastname);
    }

    function Email(data) {
        this.address = ko.observable(data.address);
    }

    function PostsViewModel(route) {
        this.posts = ko.observableArray();
        this.groups = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
        this.checked = ko.observable(false);

        this.filter = {
            id: ko.observable(''),
            postname: ko.observable(''),
            group_id: ko.observable(''),
            person_name: ko.observable(''),
            email_address: ko.observable(''),
            created: ko.observable(''),
            modified: ko.observable(''),
            status: ko.observable(''),
            display: ko.observable(false)
        };

        this.paging = new Paging(this);
        this.refresh();
    }

    PostsViewModel.prototype.showFilter = function () {
        this.filter.display(!this.filter.display());
    };

    PostsViewModel.prototype.checkAll = function (data, event) {
        ko.utils.arrayForEach(this.posts(), function (item) {
            item.Post.checked(event.target.checked);
        });
        return true;
    };

    PostsViewModel.prototype.refresh = function () {
        var self = this,
                posts = [];
        $.getJSON('admin/posts/posts/index/page:' + self.paging.page(),
                ko.toJS(self.filter),
                function (data) {
                    self.paging.set(data.paging);
                    posts = ko.utils.arrayMap(data.posts, function (item) {
                        return {
                            Post: new Post(item.Post),
                            Person: new Person(item.Person),
                            Email: new Email(item.Email),
                            Group: new Group(item.Group)
                        };
                    });
                    self.posts(posts);
                });
        this.listGroup();
    };

    PostsViewModel.prototype.remove = function (self, item) {
        var id = item.Post.id();
        if (confirm('¿Estas Seguro?')) {
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/posts/posts/delete/' + id
            }).done(function (data) {
                if (data.message.type === 'success') {
                    self.posts.remove(item);
                }
                notify(data.message);
            });
        }
    };

    PostsViewModel.prototype.update = function (item) {
        var id = item.Post.id(),
                status = !item.Post.status();
        $.ajax({
            type: 'PUT',
            dataType: 'json',
            url: 'admin/posts/posts/status/' + id,
            data: {
                'data[Post][status]': status
            }
        }).done(function (data) {
            notify(data.message);
            if (data.message.type === 'success') {
                item.Post.status(status);
            }
        });
    };

    PostsViewModel.prototype.removeAll = function () {
        var self = this,
                ids = [];
        ko.utils.arrayForEach(self.posts(), function (item) {
            if (item.Post.checked()) {
                ids.push(item.Post.id());
            }
        });
        if (ids.length > 0 && confirm('¿Estas Seguro?')) {
            var params = ids.join('/');
            $.ajax({
                type: 'DELETE',
                dataType: 'json',
                url: 'admin/posts/posts/delete/' + params
            }).done(function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.refresh();
                }
            });
        }
    };

    PostsViewModel.prototype.listGroup = function () {
        var self = this,
                groups = [];
        $.getJSON('admin/posts/groups/list',
                function (data) {
                    groups = $.map(data.groups, function (value, key) {
                        return {id: key, name: value};
                    });
                    self.groups(groups);
                    $('[name=groups]').trigger('chosen:updated');
                });
    };

    return {viewModel: PostsViewModel, template: template};
});