var app = {};

window.onload = function()    {

    dataSource.prepare(1000);

    app.list = new List({
        id: 'scroll-cmp',
        width: '300px',
        height: '300px',
        model: dataSource,
        columnModel: {
            caption: {
                width: '200px',
                caption: 'caption'
            },
            param1: {
                width: '150px',
                caption: 'value',
                type: 'radio',
                enum: [0, 1, 2]
            }

        }
    });

};

quickDelegate = function(event, target) {
    var eventCopy = document.createEvent("MouseEvents");
    eventCopy.initMouseEvent(event.type, event.bubbles, event.cancelable, event.view, event.detail,
        event.pageX || event.layerX, event.pageY || event.layerY, event.clientX, event.clientY, event.ctrlKey, event.altKey,
        event.shiftKey, event.metaKey, event.button, event.relatedTarget);
    target.dispatchEvent(eventCopy);
    // ... and in webkit I could just dispath the same event without copying it. eh.
};