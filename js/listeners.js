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
        // Récupération des valeurs saisies par l'utlisateurs.
        var userNbC = $("#unities #c").val();
        var userNbD = $("#unities #d").val();
        var userNbU = $("#unities #u").val();
        var userTotal = $("#total").val();

        // Récupération des données du mode courant.
        var elements = models.modes[models.modes.currentMode].elements;
        var total = (elements.c.nb * 100) + (elements.d.nb * 10) + elements.u.nb;

        // Vérification des centaines.
        if (elements.c.nb == userNbC &&
            elements.d.nb == userNbD &&
            elements.u.nb == userNbU &&
            total == userTotal) {
            rules.displayScore("Bravo !! Tu as réussi !!", true, total);
        } else {
            rules.displayScore("Game Over: Try again", false, total);
        }

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