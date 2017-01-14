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
        $("#unities #c").focus();
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
        $("#unities #c").focus();
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
        var elements = models.levelsList[models.currentLevel].elements;
        var total = (elements.c * 100) + (elements.d * 10) + elements.u;

        // Vérification des centaines.
        if (elements.c == userNbC &&
            elements.d == userNbD &&
            elements.u == userNbU &&
            total == userTotal) {
            // Si le niveau courant est inférieur au nb de niveau.
            if ((models.currentLevel + 1) < models.levelsList.length) {
                // On incrémente de niveau.
                models.changeLevel();
                $("#unities #c").focus();
            } else {
                rules.displayScore("Bravo !! Tu as réussi !!", true, total);
            }
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