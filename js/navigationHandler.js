/*
 * NavigationHandler: permette la navigazione tra le pagine, ed applica un blocco al tasto back
 */
angular.module('codyColor').factory("navigationHandler", function () {
    let navigationHandler = {};
    let backBlock = true;

    navigationHandler.initializeBackBlock = function ($scope) {
        $scope.$on('$locationChangeStart', function (evnt, next, current) {
            if (backBlock) {
                alert("Utilizza i comandi interni alla pagina per navigare tra le schermate!");
                evnt.preventDefault();
            } else {
                backBlock = true;
            }
        });
    };

    navigationHandler.goToPage = function ($location, $scope, page, notFromClick) {
        backBlock = false;
        $location.path(page).replace();
        if (notFromClick !== undefined && notFromClick === true)
            $scope.$apply();
    };

    return navigationHandler;
});

angular.module('codyColor').config(function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: "partials/splash.html", controller: "splashCtrl"})
        .when("/home", {templateUrl: "partials/home.html", controller: "homeCtrl"})
        .when("/login", {templateUrl: "partials/login.html", controller: "loginCtrl"})
        .when("/rules", {templateUrl: "partials/rules.html", controller: "emptyCtrl"})
        .when("/register", {templateUrl: "partials/register.html", controller: "registerCtrl"})
        .when("/rmmaking", {templateUrl: "partials/mmaking.html", controller: "rmmakingCtrl"})
        .when("/pmmaking", {templateUrl: "partials/404.html", controller: "emptyCtrl"})
        .when("/match", {templateUrl: "partials/match.html", controller: "matchCtrl"})
        .when("/aftermatch", {templateUrl: "partials/aftermatch.html", controller: "aftermatchCtrl"})
        .when("/ranking", {templateUrl: "partials/ranking.html", controller: "rankingCtrl"})
        .when("/profile", {templateUrl: "partials/ranking.html", controller: "rankingCtrl"})
        .otherwise({template: "partials/404.html", controller: "emptyCtrl"});
});