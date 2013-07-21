var app = {};

window.onload = function()    {

    if(typeof(Storage) === 'undefined') {
        alert('No web storage support, so you can\'t save your changes.')
    }
    else    {
        if (localStorage.gurtam_data === undefined) {
            dataSource.prepare(1000);
        }
        else    {
            try {
                var data = JSON.parse(localStorage.gurtam_data);
                dataSource.restore(data);
            }
            catch(e)    {
                dataSource.prepare(1000);
            }

        }
    }



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

        },
        listeners: {
            change: function()  {
                var dataString = this.model.serialize();
                localStorage.gurtam_data = dataString;
            }
        }
    });

};