var ko = require('knockout');

ko.bindingHandlers.chosen = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = allBindingsAccessor().chosenOptions || {allow_single_deselect: true, width: "100%"};
        if (element.hasAttribute('multiple')) {
            $(element).chosen(options).change(function () {
                var arr = [];
                $('[name="' + element.name + '"] :selected').each(function (i, elem) {
                    arr.push(elem.value);
                });
                valueAccessor(arr);
            });
        } else {
            $(element).chosen(options);
        }
    },
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).trigger('chosen:updated');
    }
};

ko.bindingHandlers.fadeVisible = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        $(element).toggle(ko.unwrap(value));
    },
    update: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut();
    }
};

ko.bindingHandlers.date = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var value = valueAccessor(),
                options = allBindingsAccessor().dateOptions || {format: 'DD-MM-YYYY HH:mm'};

        var locale = options.locale || 'es';
        
        var valueUnwrapped = ko.unwrap(value);
        if (valueUnwrapped) {
            var output = moment(valueUnwrapped).locale(locale).format(options.format);
            value(output);
        }
    }
};

ko.bindingHandlers.datepicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        var options = $.merge({language: 'es', format: 'dd-mm-yyyy', enableOnReadonly: false}, valueAccessor());
        var observable = allBindingsAccessor();

        $(element).datepicker(options);
        if (observable.value()) {
            $(element).datepicker('update', new Date(observable.value()));
        }

        ko.utils.registerEventHandler(element, 'changeDate', function (event) {
            var value = observable.value();
            if (ko.isObservable(value)) {
                value(event.date);
            }
        });
    },
    update: function (element, valueAccessor) {
        var widget = $(element).data('datepicker');
        if (widget) {
            widget.date = ko.utils.unwrapObservable(valueAccessor());
            widget.setValue();
        }
    }
};

function notify(data) {
    switch (typeof data.message) {
        case 'string':
            $.notify(data.message, data.type);
            break;
        default:
            $.map(data.message, function (elem) {
                notify({
                    message: elem,
                    type: data.error
                });
            });
    }
}

function Paging(viewModel) {
    var self = this;
    this.page = ko.observable(1);
    this.pageCount = ko.observable();
    this.pages = ko.computed(function () {
        var pages = [];
        for (var i = 1; i <= this.pageCount(); i++) {
            pages.push(i);
        }
        return pages;
    }, this);
    this.paginate = function (page) {
        if (self.pages().indexOf(page) > -1) {
            self.page(page || 0);
            viewModel.refresh();
        }
    };
}

$.validator.setDefaults({
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function (error, element) {
        if (element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    },
    success: function (element) {
        $(element)
                .closest('.form-group')
                .removeClass('has-error')
                .addClass('has-success');
    },
    highlight: function (element) {
        $(element)
                .closest('.form-group')
                .removeClass('has-success')
                .addClass('has-error');
    }
});