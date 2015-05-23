define(['knockout', 'text!./add.html'], function (ko, template) {

    function Group(data) {
        this.id = ko.observable();
        this.name = ko.observable('');
        this.description = ko.observable('');
        this.status = ko.observable('false');
        this.created = ko.observable();
        this.modified = ko.observable();
        this.checked = ko.observable(false);
    }

    function AddGroupViewModal() {
        this.data = ko.observable({
            Group: new Group()
        });
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);
    }

    AddGroupViewModal.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                status: 'required'
            }
        });

        if ($(form).valid()) {
            $.post('admin/users/groups/add', {
                data: ko.toJS(self.data)
            }, function (data) {
                if (data.message.type === 'success') {
                    location.hash = '/groups';
                } else {
                    notify(data.message);
                }
            }, 'json');
        }
    };

    return {viewModel: AddGroupViewModal, template: template};
});