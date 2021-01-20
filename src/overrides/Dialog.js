const Dialog = Ext.Dialog;
const superCls = Dialog.prototype;
const initialize = superCls.initialize;

Ext.define(null, {
    override: 'Ext.Dialog',

    initialize() {
        initialize.call(this);

        if (this.autoShow) {
            this.show();
        }
    },
});
