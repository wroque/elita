define(['knockout', 'text!./login.html'], function (ko, template) {

    function User() {
        this.username = ko.observable('');
        this.password = ko.observable('');
    }

    function Email() {
        this.address = ko.observable('');
    }

    function LoginViewModel(params) {
        this.session = params.session;
        this.User = ko.observable(new User());
        this.Email = ko.observable(new Email());

        $.backstretch([
            "users/images/bird.png",
            "users/images/space.png",
            "users/images/night.jpg"
        ], {duration: 3000, fade: 750});

        $(window).on("backstretch.after", function () {
            $('body').addClass('ready');
        });
    }

    LoginViewModel.prototype.login = function (form) {
        var self = this;
        $('[name=password]').change();
        $(form).validate({
            onfocusout: false,
            onsubmit: false,
            rules: {
                username: 'required',
                password: 'required'
            }
        });

        if ($(form).valid()) {
            $.post(self.base, ko.toJS(this.User()), function (data) {
                notify(data.message);
                if (data.message.type === 'success') {
                    self.session.user(true);
                    location.hash = '/users';
                }
            }, 'json');
        }
    };

    LoginViewModel.prototype.omission = function (form) {
        var self = this;

        $(form).validate({
            errorClass: 'help-block',
            errorElement: 'span',
            rules: {
                address: {
                    required: true,
                    email: true
                }
            }
        });

        if ($(form).valid()) {
            $.post(self.base + 'users/users/omission',
                    ko.toJS(self.Email()),
                    function (data) {
                        notify(data.message);
                    }, 'json');
        }
    };

    return {viewModel: LoginViewModel, template: template};
}); 