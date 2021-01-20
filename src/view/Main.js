import styles from './Main.css';

import '../core/field/Combobox';

const Panel = Ext.Panel;
const superCls = Panel.prototype;

export default Ext.define('App.view.Main', {
    extend: Panel,

    title: 'App',

    html: `<div class="${styles.testClass}">Left Panel, 1/3rd of total size></div>`,

    constructor(...args) {
        superCls.constructor.call(this, ...args);
    },

    items: [
        {
            xclass: 'App.core.field.Combobox',
            width: 400,
            margin: 5,
            label: 'Choose State',
            queryMode: 'local',
            displayField: 'name',
            valueField: 'abbr',
            allDisplayTpl: '{abbr} {name}',
            store: [
                {abbr: 'AL', name: 'Alabama'},
                {abbr: 'AK', name: 'Alaska'},
                {abbr: 'AZ', name: 'Arizona'}
            ]
        }
    ]
});
