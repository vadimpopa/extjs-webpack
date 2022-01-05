(async () => {
    const bootstrap = {
        lang: '',
        appName: 'MyApp',
        translations: {},

        /**
         *
         * @return {Object}
         */
        getAppStateStorage() {
            return Ext.util.LocalStorage.get(`${bootstrap.appName}State`);
        },

        getApp() {
            let app = window[bootstrap.appName];

            if (!app) {
                app = window[bootstrap.appName] = {};
            }

            return app;
        },

        getNavigatorLanguages() {
            let found = [];

            if (typeof navigator !== 'undefined') {
                if (navigator.languages) {
                    // chrome only; not an array, so can't use .push.apply instead of iterating
                    for (let i = 0; i < navigator.languages.length; i++) {
                        found.push(navigator.languages[i]);
                    }
                }
                if (navigator.userLanguage) {
                    found.push(navigator.userLanguage);
                }
                if (navigator.language) {
                    found.push(navigator.language);
                }
            }

            return found.length > 0 ? found : undefined;
        },

        /**
         * @return {String}
         */
        getLang() {
            let {lang} = bootstrap;

            if (!lang) {
                // First check localeStorage for saved language
                const localStorageInstance = bootstrap.getAppStateStorage();
                const isAutoDetectLanguage = true;

                lang = localStorageInstance.getItem('lang');
                localStorageInstance.release();

                // If saved language is not found in locales auto detect from OS or default
                if (!lang) {
                    if (isAutoDetectLanguage) {
                        const languages = bootstrap.getNavigatorLanguages();
                        const found = languages.find((lang) => lang);

                        if (found) {
                            lang = found;
                        }
                    }
                }

                if (!lang) {
                    lang = 'en';
                }

                document.documentElement.setAttribute('lang', lang);

                bootstrap.lang = lang;
            }

            return lang;
        },

        initLang() {
            bootstrap.lang = '';
            bootstrap.getLang();
        },

        isDarkMode() {
            const localStorageInstance = bootstrap.getAppStateStorage();
            let darkMode = localStorageInstance.getItem('theme-dark-mode');
            localStorageInstance.release();

            return darkMode === 'true';
        },

        loadTranslations() {
            const me = this;
            const {lang} = me;

            return new Promise((resolve, reject) => {
                Ext.Ajax.request({
                    url: `resources/locales/${lang}/${lang}.json`,
                    callback(options, success, response) {
                        const data = Ext.decode(response.responseText, true);

                        if (data) {
                            me.translations = data;
                            resolve();
                        } else {
                            reject();
                        }
                    },
                });
            }).catch(() => {
                const m = new Ext.MessageBox();
                m.alert('Failure', `Couldn't load files`);
            });
        },

        i18nInit({default: i18next}) {
            const me = this;
            const {lang} = me;

            return i18next
                .init({
                    lng: lang,
                    debug: true,
                    fallbackLng: false,
                    returnEmptyString: false,
                    interpolation: {
                        prefix: '{{',
                        suffix: '}}',
                    },
                    ns: ['app'],
                    nsSeparator: false,
                    keySeparator: false,
                    defaultNS: 'app',
                })
                .then(() => {
                    i18next.addResourceBundle(lang, 'app', me.translations);

                    const app = bootstrap.getApp();

                    app.i18next = i18next;
                    app.t = i18next.t.bind(i18next);
                    me.translations = null;
                });
        }
    };

    let themeName;
    let environment;

    const Ext = await import(/* webpackChunkName: "ext" */ 'Ext');
    const app = bootstrap.getApp();
    const {appName} = bootstrap;
    const localStorageInstance = bootstrap.getAppStateStorage();

    Ext.ns(appName);

    app.Boot = bootstrap;
    app.isDarkMode = bootstrap.isDarkMode;

    themeName = localStorageInstance.getItem('theme') || 'theme-material';
    environment = process.env.NODE_ENV;

    const {manifest} = Ext;

    manifest.env = environment;
    manifest.isDevelopment = environment === 'development';

    await import(
        /* webpackChunkName: '[request]' */
        `../themes/${themeName}/all${
            environment === 'development' ? '-debug' : ''
        }.js`
        ).then(bootstrap.initLang)

    await bootstrap.loadTranslations();

    await import('i18next').then(bootstrap.i18nInit.bind(bootstrap));

    await import(/* webpackChunkName: "app" */ './overrides/index');
    await import(/* webpackChunkName: "app" */ './Application');

    Ext.application(`${appName}.Application`);
})();
