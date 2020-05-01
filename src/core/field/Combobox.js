export default Ext.define('CARA.core.field.Combobox', {
    extend: 'Ext.field.ComboBox',

    clearable: true,
    forceSelection: true,

    config: {
        allDisplayTpl: false
    },
    allDisplayTplRegex: /[^{\}]+(?=})/g,

    applyAllDisplayTpl(tpl) {
        if (tpl !== false) {
            this.setItemTpl(tpl);
            this.setDisplayTpl(tpl);
            this.setPrimaryFilter(new Ext.util.Filter({
                property: tpl.match(this.allDisplayTplRegex),
                filterFn: this.allFilterFn
            }));
        }
        return tpl;
    },

    allFilterFn(candidateRecord) {
        // This called in the scope of the Filter instance, we have this config
        let searchValue = this.getValue();

        if (searchValue) {
            searchValue = searchValue.toLowerCase();

            return this.getProperty().some(field => {
                const value = (candidateRecord.get(field) || '').toLowerCase();
                return value.indexOf(searchValue) > -1;
            });
        }
        return false;
    }
});
