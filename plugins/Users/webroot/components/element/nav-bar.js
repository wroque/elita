define(['knockout', 'text!./nav-bar.html'], function (ko, template) {

    function NavBarViewModel(params) {
        this.session = params.session;
        this.init(this);

        if ($('body').hasClass('ready')) {
            $.backstretch('destroy');
        }
    }

    NavBarViewModel.prototype.init = function (self) {
        $.getJSON(baseUrl + '/users/users/session.json', function (data) {
            self.session.user(data.user);
        });
    };

    NavBarViewModel.prototype.logout = function () {
        $.getJSON(baseUrl + 'users/users/logout.json', function (data) {
            location.hash = '/logout';
            notify(data.message);
        });
    };

    return {viewModel: NavBarViewModel, template: template};
});