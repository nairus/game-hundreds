$(document).ready(function () {
    var game = window.game || {};
    var models = game.models || {};
    var rules = game.rules || {};
    var functions = game.functions || {};
    var listeners = {};

    /**
     * Callback de lancement du jeu.
     */
    listeners.playGame = function(event) {
        $("#home").hide();
        $("#game").show();
        models.currentScreen = "#game";
        functions.resetGame();
    };

    /**
     * Callback pour quitter le jeu.
     */
    listeners.quitGame = function(event) {
        rules.stopGame();
        $("#home").show();
        $("#game").hide();
        $("#score").hide();
        models.currentScreen = "#home";
        functions.resetGame();
    };

    /**
     * Callback pour rejouer.
     */
    listeners.replayGame = function(event) {
        rules.stopGame();
        $("#score").hide();
        $("#game").show();
        models.currentScreen = "#game";
        functions.resetGame();
    };

    /**
     * Callback pour valider les données.
     */
    listeners.validateForm = function(event) {
        // TODO
    };

    /**
     * Création des écouteurs du jeu.
     */
    listeners.createlisteners = function() {
        var $home = $("#home");
        var $game = $("#game");
        var $score = $("#score");
		
        // Listeners de l'accueil.
        $home.on("click", "#btnPlay", listeners.playGame);

        // Listeners du jeu.
        $game.on("click", "#btnValidate", listeners.validateForm);
        $game.on("click", "#btnQuit", listeners.quitGame);

        // Listeners de l'écran de bilan.
        $score.on("click", "#btnReplay", listeners.replayGame);
        $score.on("click", "#btnHome", listeners.quitGame);
    };

    game.listeners = listeners;
    window.game = game;
});