define(['knockout', 'text!./edit.html'], function (ko, template) {

    function Menu(data) {
        this.id = ko.observable(data.id);
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.status = ko.observable(data.status.toString());
        this.checked = ko.observable(false);
        this.alias = ko.computed(function () {
            var result = data.alias;
            if (data.alias.length === 0) {
                $.getJSON('admin/menus/menus/slug/' + this.name(), function (data) {
                    result = data.slug;
                });
            }
            return result;
        }, this);
    }

    function EditMenuViewModal(params) {
        this.id = params.id;
        this.Menu = null;
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
        this.init(this);
    }

    EditMenuViewModal.prototype.init = function (self) {
        $.getJSON('admin/menus/menus/view/' + self.id, function (data) {
            self.Menu = new Menu(data.menu.Menu);
        });
    };

    EditMenuViewModal.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                alias: 'required',
                status: 'required'
            }
        });

        if ($(form).valid()) {
            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: 'admin/menus/menus/add',
                data: {
                    'data[Menu]': ko.toJS(self.Menu)
                }
            }).done(function (data) {
                if (data.message.type === 'success') {
                    location.hash = '/menus';
                } else {
                    notify(data.message);
                }
            });
        }
    };

    return {viewModel: EditMenuViewModal, template: template};
});