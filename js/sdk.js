/**
 * Created with JetBrains PhpStorm.
 * User: fliak
 * Date: 7/20/13
 * Time: 3:10 PM
 * To change this template use File | Settings | File Templates.
 */

var sdk = {};

sdk.uniqueid = function (){

    var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));

    do {
        var ascicode=Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64){
            idstr += String.fromCharCode(ascicode);
        }
    } while (idstr.length<8);

    return (idstr);
};

sdk.apply = function (firstObject, secondObject)    {
    var i, middleResult;

    if (arguments.length > 2)  {
        middleResult = arguments[arguments.length];
        for (i = arguments.length - 1; i >= 0; i = i - 1) {
            middleResult = sdk.apply(arguments[i], middleResult);
        }

        return middleResult;
    }
    else    {

        for (i in secondObject) {
            firstObject[i] = secondObject[i];
        }

        return firstObject;
    }

};

sdk.on = function(el, event, fn, scope)    {
    scope = scope || this;
    if (el instanceof Array || el instanceof HTMLCollection)    {
        for (var i in el)   {
            sdk.on (el[i], event, fn, scope);
        }

        return;
    }

    el['on' + event] = function()   {
        fn.apply(scope, arguments);
    }
}

sdk.setCookie = function(key, value, exdays)
{
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var cValue = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());

    document.cookie = key + "=" + cValue;
}