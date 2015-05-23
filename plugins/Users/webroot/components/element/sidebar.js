define(['knockout', 'text!./sidebar.html'], function (ko, template) {

    function SidebarViewModel(session) {
        this.session = session;
        this.sidebar = ko.observableArray();
        this.init(this);
    }

    SidebarViewModel.prototype.init = function (self) {
//        jQuery.getJSON('admin/menus/menus/sidebar', function (data) {
//            self.sidebar(data.sidebar);
//        });
    };

    SidebarViewModel.prototype.open = function (data, event) {
        if (data.children.length > 0) {
            $('.nav-sidebar li ul').slideUp();
            $(event.currentTarget).siblings('ul').slideToggle('slow');
        } else {
            location.hash = data.Link.link;
        }
    };

    return {viewModel: SidebarViewModel, template: template};
});