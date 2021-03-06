/*
 * Main AngularJS Web Application: crea il modulo applicazione
 */
angular.module('codyColor', ['ngRoute', 'ngAnimate', 'ngDragDrop',
    'ngCookies', 'pascalprecht.translate', 'ngSanitize', 'monospaced.qrcode' ]);

// global module configuration
angular.module('codyColor').config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'locales/locale-',
        suffix: '.json'
    });

    $translateProvider.registerAvailableLanguageKeys(['en', 'it'], {
        'it*': 'it',
        '*': 'en'
    });

    // l'autorilevazione del linguaggio utente delle volte su chrome restituisce inglese a priori
    $translateProvider.determinePreferredLanguage(function () {
        if (navigator.languages && navigator.languages.length) {
            return navigator.languages[0];
        } else {
            return navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
        }
    });

    //$translateProvider.preferredLanguage('it');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');
    $translateProvider.useCookieStorage();
}]);