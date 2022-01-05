import './Main.scss';
import '../core/field/Combobox';

const Panel = Ext.Panel;
const superclass = Panel.prototype;

export default Ext.define('MyApp.view.Main', {
    extend: Panel,

    title: MyApp.t('appTitle'),

    html: `<div class="my-class-from-sass">Left Panel, 1/3rd of total size></div>`,

    constructor(...args) {
        superclass.constructor.call(this, ...args);
    },

    items: [
        {
            xtype: 'checkbox',
            boxLabel: MyApp.t('wantDarkTheme'),
            listeners: {
                change(field, isDarkMode) {
                    debugger
                    MyApp.app.setStateItem('theme-dark-mode', isDarkMode);
                }
            }
        },
        {
            xclass: 'App.core.field.Combobox',
            width: 400,
            margin: 5,
            label: 'Choose Language',
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
