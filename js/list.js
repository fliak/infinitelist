/**
 * Created with JetBrains PhpStorm.
 * User: fliak
 * Date: 7/19/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */
var List = function(config)   {
    config = config || {};

    this.config = sdk.apply({
        width: '300px',
        height: '300px',
        rowElementConfig: {
            className: 'row',
            attr: {}
        },
        colElementConfig: {
            className: 'column',
            attr: {}
        },
        generator: generator,
        model: undefined,
        columnModel: undefined
    }, config);

    if (config.id !== undefined)    {
        this.el = document.getElementById(config.id);
    }
    else    {
        this.el = document.body;
    }

    this._generator = this.config.generator;
    this.model = this.config.model;


    this.init();

};

List.prototype = {
    rowStart: 0,
    rowCount: 0,
    el: null,
    model: null,
    init: function()    {

        this._setupLayout();
        this._createStructure();
        this.render();
        this._createRows();

        this._calibrateScrolling();

        this._bindEvents();

        this.refresh();
    },
    _structure: {},
    _setupLayout: function()    {
        this.el.style.width = this.config.width;
        this.el.style.height = this.config.height;
    },
    render: function()  {
        this.el.appendChild(this._structure.workArea);
        this.el.appendChild(this._structure.scrollBox);
    },
    _createRows: function() {
        var height = this.getHeight();

        var rowIndex, availableSpace;
        rowIndex = 0;

        var tbody = this._structure.tbody;

        this.config.model.eachFrom(this.rowStart, function(key, value)   {
            var regularRow = this._generator.createRowEl(this.config);
            regularRow.setAttribute('data-index', rowIndex);
            this._createRowStructure(regularRow, rowIndex);
            tbody.appendChild(regularRow);
            availableSpace = height - this._structure.table.clientHeight;
            rowIndex++;

            //with overflow protection
            return availableSpace > regularRow.clientHeight && rowIndex < 1000;
        }, this);

        this.rowCount = rowIndex;

    },
    _createStructure: function()   {
        this._structure.workArea = this._generator.createEl('div', 'work-area');
        this._structure.workArea.style.width = this.el.clientWidth - 15 + 'px';
        this._structure.table = this._generator.createEl('table');
        this._structure.thead = this._generator.createEl('thead');
        this._structure.headRow = this._generator.createHeaderRowEl(this.config);

        this._structure.thead.appendChild(this._structure.headRow);
        this._structure.table.appendChild(this._structure.thead);

        this._structure.tbody = this._generator.createEl('tbody');
        this._structure.table.appendChild(this._structure.tbody);

        this._structure.workArea.appendChild(this._structure.table);

        this._structure.scrollBox = this._generator.createEl('div', 'scroll-box');


        this._structure.fakeBody = this._generator.createEl('div', 'fake-body');
        this._structure.scrollBox.appendChild(this._structure.fakeBody);


    },

    getHeight: function()   {
        return this.el.clientHeight;
    },

    getWidth: function()   {
        return this.el.clientWidth;
    },

    getRowHeight: function()    {
        var rows = this._structure.thead.children;

        return rows[0].clientHeight;
    },

    _calibrateScrolling: function() {
        if (this.config.model !== undefined)    {
            var count;
            count = this.config.model.getCount();

            var emptyBottom = this._structure.scrollBox.clientHeight;

            this._structure.fakeBody.style.height = emptyBottom + (count-this.rowCount) * (this.getRowHeight()) + 'px';

        }
    },

    _bindEvents: function() {
        var that = this;
        this._structure.scrollBox.onscroll = function(e) {
            var scroll = e.target.scrollTop;
            var rowStart = Math.round(scroll / that.getRowHeight());
            that._scrollTo.call(that, rowStart);
        }

        /**
         * FIXME should be redesigned
         * @param e
         */
        document.onkeydown = function(e) {
            console.log(e);
            switch (e.keyCode)  {
                case 38:
                    that._structure.scrollBox.scrollTop = that._structure.scrollBox.scrollTop - that.getRowHeight();
                    break;

                case 40:
                    that._structure.scrollBox.scrollTop = that._structure.scrollBox.scrollTop + that.getRowHeight();
                    break;
            }

        }
    },

    _scrollTo: function(rowStart)    {
        this.rowStart = rowStart;

        this.refresh();
    },

    refresh: function() {
        var index;
        index = 0;
        this.config.model.each(this.rowStart, this.rowStart + this.rowCount - 1, function(key, value)   {
            var tr = this.getAt(index);
            tr.setAttribute('data-index', key);
            this.fillRowWithData(tr, value);
            index++;
        }, this);
    },

    setValue: function(rowIndex, propName, value)  {
        var dataIndex = this.rowStart + rowIndex;
        this.config.model.setValue(rowIndex, propName, value);

        this.config.listeners.change.apply(this, arguments);
    },

    _createRowStructure: function(rowEl, rowIndex)   {
        var colIndex, columns, columnConf;

        columns = rowEl.children;
        colIndex = 0;
        for (propName in this.config.columnModel)   {
            columnConf = this.config.columnModel[propName];

            switch(columnConf.type) {
                case 'radio':
                    var control = this._generator.getRadioSet(rowIndex, colIndex, columnConf.enum);

                    sdk.on(control.children, 'change', function(e)   {
                        var rowIndex = e.target.parentNode.parentNode.parentNode.getAttribute('data-index');
                        console.log(rowIndex, e.target.parentNode.parentNode.parentNode)
                        this.setValue(rowIndex, propName, e.target.value);

                    }, this);
                    columns[colIndex].appendChild(control);
                    break;
                default:
//                    columns[propIndex].innerHTML = dataRow[propName];
                    break;
            }

            colIndex++;
        }
    },

    fillRowWithData: function(rowEl, dataRow)   {
        var colIndex, columns, columnConf, columnEl;
        columns = rowEl.children;

        colIndex = 0;
        for (propName in this.config.columnModel)   {
            columnConf = this.config.columnModel[propName];
            columnEl = columns[colIndex];

            switch(columnConf.type) {
                case 'radio':
                    var cIterator, control;
                    var radioSet = columnEl.children[0].children;
                    for (cIterator = 0; cIterator < radioSet.length; cIterator++)  {
                        control = radioSet[cIterator];
                        if (control.getAttribute('value') == dataRow[propName])    {
                            control.checked = true;
                        }
                        else    {
                            control.checked = false;
                        }
                    }
                    break;
                default:
                    columnEl.innerHTML = dataRow[propName];
                    break;
            }

            colIndex++;
        }
    },

    getAt: function(index)  {
        return this._structure.tbody.children[index];
    }



};



var generator = {
    createEl: function(tag, className, attrs, style, html)    {
        var el, attrName, attrValue, propName, propValue;
        tag = tag || 'div';


        el = document.createElement(tag);
        if (className !== undefined)    {
            el.setAttribute('class', className);
        }

        if (attrs !== undefined)    {
            for (attrName in attrs)   {
                attrValue = attrs[attrName];
                el.setAttribute(attrName, attrValue);
            }
        }

        if (style !== undefined)    {
            for (propName in style)   {
                propValue = style[propName];
                el.style[propName] = propValue;
            }
        }

        if (html !== undefined) {
            el.innerHTML = html;
        }

        return el;
    },

    createRowEl: function(config) {
        var i, rowConfig, colConfig, td, tr;

        rowConfig = config.rowElementConfig;
        colConfig = config.colElementConfig;
        tr = this.createEl('tr', rowConfig.className, rowConfig.attr);

        for (i in config.columnModel)  {
            td = this.createEl('td', colConfig.className, colConfig.attr);
            tr.appendChild(td);
        }

        return tr;
    },
    createHeaderRowEl: function(config)   {
        var columnName, rowConfig, colConfig, td, tr, html, attrs;

        rowConfig = config.rowElementConfig;
        colConfig = config.colElementConfig;
        tr = this.createEl('tr', rowConfig.className, rowConfig.attr);


        for (columnName in config.columnModel)  {
            cm = config.columnModel[columnName];
            html = cm.caption;
            attrs = sdk.apply({
                'data-field': columnName
            }, colConfig.attr || {});

            style = sdk.apply({

            }, colConfig.attr || {});

            if (cm.width !== undefined) {
                style.width = cm.width;
            }

            td = this.createEl('th', colConfig.className, attrs, style, html);

            tr.appendChild(td);
        }

        return tr;
    },
    getRadioSet: function(rowIndex, colIndex, enumList) {
        var div = this.createEl('div');

        for (i in enumList) {
            div.appendChild(this.createEl('input', undefined, {
                'type': 'radio',
                'value': enumList[i],
                'name': 'radio-' + rowIndex + '-' + colIndex
            }));
        }

        return div;
    }

};