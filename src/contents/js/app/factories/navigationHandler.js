/*
 * NavigationHandler: permette la navigazione tra le pagine, ed applica un blocco al tasto back
 */
angular.module('codyColor').factory("navigationHandler", function () {
    let navigationHandler = {};
    let backBlock = true;

    navigationHandler.initializeBackBlock = function ($scope) {
        $scope.$on('$locationChangeStart', function (event) {
            if (backBlock) {
                alert("Utilizza i comandi interni alla pagina per navigare tra le schermate!");
                event.preventDefault();
            } else {
                backBlock = true;
            }
        });
    };

    navigationHandler.goToPage = function ($location, page) {
        backBlock = false;
        $location.search({});
        $location.path(page).replace();
    };

    return navigationHandler;
});

angular.module('codyColor').config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when("/", {templateUrl: "pages/create-match.html", controller: "createMatchCtrl"})
        .when("/mmaking", {templateUrl: "pages/mmaking.html", controller: "mmakingCtrl"})
        .when("/match", {templateUrl: "pages/match.html", controller: "matchCtrl"})
        .when("/aftermatch", {templateUrl: "pages/aftermatch.html", controller: "aftermatchCtrl"})
        .otherwise({templateUrl: "pages/404.html", controller: "emptyCtrl"});
}]);