define(['knockout', 'text!./add.html'], function (ko, template) {

    function Menu(data) {
        this.id = ko.observable();
        this.name = ko.observable('');
        this.description = ko.observable('');
        this.status = ko.observable('false');
        this.checked = ko.observable(false);
        this.alias = ko.computed(function () {
            var result = null;
            $.getJSON('admin/menus/menus/slug/' + this.name(), function (data) {
                result = data.slug;
            });
            return result;
        }, this);
    }

    function AddMenuViewModal() {
        this.Menu = new Menu();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
    }

    AddMenuViewModal.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                alias: 'required',
                status: 'required'
            }
        });

        if ($(form).valid()) {
            $.post('admin/menus/menus/add', {
                'data[Menu]': ko.toJS(self.Menu)
            }, function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    location.hash = '/menus';
                }
            }, 'json');
        }
    };

    return {viewModel: AddMenuViewModal, template: template};
});