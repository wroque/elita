define(['knockout', 'text!./edit.html', 'simplegrid'], function (ko, template) {

    function Group(data) {
        this.id = ko.observable(data.id);
        this.name = ko.observable(data.name);
        this.description = ko.observable(data.description);
        this.status = ko.observable(data.status.toString());
        this.created = ko.observable(data.created);
        this.modified = ko.observable(data.modified);
    }

    function EditGroupViewModal(params) {
        this.id = params.id;
        this.data = ko.observable();
        this.nodes = ko.observableArray();
        this.status = ko.observableArray([
            {id: true, name: 'activo'}, {id: false, name: 'inactivo'}
        ]);

        this.gridViewModel = new ko.simpleGrid.viewModel({
            data: this.nodes,
            filter: {
                plugin: ko.observable(''),
                controller: ko.observable(''),
                action: ko.observable('')
            },
            columns: [
                {headerText: "Plugin", rowText: "plugin"},
                {headerText: "Controller", rowText: "controller"},
                {headerText: "View", rowText: "action"},
                {headerText: "Status", rowText: "status", rowAction: {action: function (data) {
                            var result = false;
                            $.getJSON('admin/users/groups/permission/' + params.id, {
                                'data[Node]': data
                            }, function (data) {
                                notify(data.message);
                                if (data.message.type === 'success') {
                                    result = true;
                                }
                            });
                            return result;
                        }}}
            ],
            pageSize: 10
        });

        this.init(this);
    }

    EditGroupViewModal.prototype.init = function (self) {        
        $.ajax({
            type: 'GET',
            async: false,
            dataType: 'json',
            url: 'admin/users/groups/view/' + self.id
        }).done(function (data) {
            self.data({
                Group: new Group(data.group.Group)
            });
            self.getNodes(self);
        });
    };

    EditGroupViewModal.prototype.getNodes = function (self) {
        $.getJSON('admin/users/groups/nodes/' + self.id, function (data) {
            self.nodes(data.nodes);
        });
    };

    EditGroupViewModal.prototype.save = function (form) {
        var self = this;
        $(form).validate({
            rules: {
                name: 'required',
                status: 'required'
            }
        });

        if ($(form).valid()) {
            $.ajax({
                type: 'PUT',
                dataType: 'json',
                url: 'admin/users/groups/edit/' + self.id,
                data: {
                    data: ko.toJS(self.data)
                }
            }).done(function (data) {
                if (data.message.type === 'success') {
                    location.hash = '/groups';
                } else {
                    notify(data.message);
                }
            });
        }
    };

    return {viewModel: EditGroupViewModal, template: template};
});