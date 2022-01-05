import './view/Main.js';

export default Ext.define('MyApp.Application', {
    extend: 'Ext.app.Application',

    namespaces: 'MyApp',
    name: 'MyApp',
    mainView: 'MyApp.view.Main',

    setStateItem(item, value) {
        debugger
        MyApp.Boot.getAppStateStorage().setItem(item, value);
    },
});
