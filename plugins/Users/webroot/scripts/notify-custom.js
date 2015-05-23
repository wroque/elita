$.notify.addStyle("bootstrap", {
    html: "<div><button type=\"button\" class=\"close\"><span>&times;</span></button><span data-notify-text></span></div>",
    classes: {
        base: {
            "border": "0",
            "border-radius": "0",
            "padding": "15px 3em 15px 15px",
            "white-space": "relative"
        },
        error: {
            "color": "#fff",
            "background-color": "#f87961",
            "boder-color": "transparent"
        },
        success: {
            "color": "#fff",
            "background-color": "#a5ce78",
            "boder-color": "transparent"
        },
        info: {
            "color": "#fff",
            "background-color": "#5ec2dd",
            "boder-color": "transparent"
        },
        warn: {
            "color": "#fff",
            "background-color": "#edb25b",
            "boder-color": "transparent"
        }
    }
});

$.notify.defaults({
    hideDuration: 300
});