/**
 * Created with JetBrains PhpStorm.
 * User: fliak
 * Date: 7/20/13
 * Time: 2:53 PM
 * To change this template use File | Settings | File Templates.
 */


var dataSource = {
    data: [],
    dataStruct: [{
        name: 'id'
    },  {
        name: 'caption'
    },  {
        name: 'value'
    }],
    prepare: function(count) {
        var i;
        for (i = 0; i < count; i++) {
            this.data.push({
                id: sdk.uniqueid(),
                caption: 'test ' + i,
                param1: false
            });
        }
    },

    getCount: function()    {
        return this.data.length;
    },

    eachFrom: function(from, fn, scope)    {
        var i, ret;
        i = 0;
        do {

            ret = fn.call(scope, i, this.data[i]);
            i++;

        } while(ret !== false && i < this.data.length);

    },

    each: function(from, to, fn, scope)    {
        var i, row, ret;
        for (i = from; i <= to; i++)    {
            row = this.data[i];
            if (row === undefined)  {
                return false;
            }

            ret = fn.call(scope, i, row);
            if (ret === false)  {
                return false;
            }
        }

        return true;
    },

    getData: function(from, to)   {
        return this.data.slice(from, to);
    }
};