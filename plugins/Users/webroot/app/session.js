define(["knockout"], function (ko) {
    return new Session();
    
    function Session() {
        this.user = ko.observable();
    }
});