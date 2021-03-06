/*
 * Controller responsabile della schermata post partita. Mostra dati sull'esito della partita e dà la possibilità di
 * portarne avanti una con lo stesso avversario
 */
angular.module('codyColor').controller('arcadeAftermatchCtrl', ['$scope', 'rabbit', 'gameData', 'scopeService',
    '$location', '$translate', 'authHandler', 'navigationHandler', 'audioHandler', 'sessionHandler',
    function ($scope, rabbit, gameData, scopeService, $location, $translate, authHandler,
              navigationHandler, audioHandler, sessionHandler) {

        let autoCloseTimer = undefined;

        // esci dalla partita in modo sicuro, chiudendo la connessione e effettuando il
        // clean dei dati di gioco
        let quitGame = function (fullExit) {
            if (autoCloseTimer !== undefined) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = undefined;
            }
            rabbit.quitGame();
            navigationHandler.goToPage($location, fullExit === true ? '/create' : '/custom-mmaking');
        };

        // inizializzazione sessione
        navigationHandler.initializeBackBlock($scope);
        if (sessionHandler.isSessionInvalid()) {
            navigationHandler.goToPage($location, '/');
            return;
        }

        // testo iniziale visualizzato in fondo a dx
        $scope.userLogged = authHandler.loginCompleted();
        if (authHandler.loginCompleted()) {
            $scope.userNickname = authHandler.getServerUserData().name;
        }

        // imposta dati e stats dell'ultima partita, da mostrare all'utente
        $scope.timeFormatter = gameData.formatTimeDecimals;
        $scope.timeFormatterCountdown = gameData.formatTimeSeconds;
        $scope.user = gameData.getUser();
        $scope.enemy = gameData.getEnemy();
        $scope.draw = gameData.getMatch().winnerId === -1;
        $scope.winner = gameData.getMatchWinner().nickname;
        $scope.matchCount = gameData.getAggregated().matchCount;
        $scope.userMatch = gameData.getUserMatchResult();
        $scope.userGlobal = gameData.getUserGlobalResult();
        $scope.enemyMatch = gameData.getEnemyMatchResult();
        $scope.enemyGlobal = gameData.getEnemyGlobalResult();

        if ($scope.winner === gameData.getUser().nickname) {
            audioHandler.playSound('win');
        } else if ($scope.winner === gameData.getEnemy().nickname) {
            audioHandler.playSound('lost');
        }

        autoCloseTimer = setTimeout(function () {
            // do nothing in this case. The game will start if some
            // other player confirmed;
            //
            // if some other player completed the timeout, it will send
            // automatically the ready message, and the wall will follow
            //
            // if one or more player left, it will be handled by the server.
        }, 60000);

        rabbit.setPageCallbacks({
            onReadyMessage: function () {
                scopeService.safeApply($scope, function () {
                    rabbit.sendReadyMessage();
                });

            }, onStartMatch: function (message) {
                scopeService.safeApply($scope, function () {
                    gameData.initializeMatchData();
                    gameData.editMatch({ tiles: gameData.formatMatchTiles(message.tiles) });

                    if (autoCloseTimer !== undefined) {
                        clearTimeout(autoCloseTimer);
                        autoCloseTimer = undefined;
                    }

                    navigationHandler.goToPage($location, '/arcade-match');
                });

            }, onGameQuit: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });

            }, onConnectionLost: function () {
                scopeService.safeApply($scope, function () {
                    quitGame();
                });
            }
        });

        $scope.exitGame = function() {
            rabbit.sendPlayerQuitRequest();
            quitGame(true);
        };

        // impostazioni multi language
        $scope.openLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = true;
        };

        $scope.closeLanguageModal = function() {
            audioHandler.playSound('menu-click');
            $scope.languageModal = false;
        };

        $scope.changeLanguage = function(langKey) {
            audioHandler.playSound('menu-click');
            $translate.use(langKey);
            $scope.languageModal = false;
        };

        // impostazioni audio
        $scope.basePlaying = audioHandler.isAudioEnabled();
        $scope.toggleBase = function () {
            audioHandler.toggleBase();
            $scope.basePlaying = audioHandler.isAudioEnabled();
        };
    }
]);