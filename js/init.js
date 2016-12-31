$(document).ready(function () {
    var game = window.game || {};

    /**
     * Initialise l'application.
     */
    game.init = function() {
        // définitions des données
        game.functions.createDatas();
        // initialisation des variables
        game.functions.initVariables();
        // définitions des gestionnaires
        game.listeners.createlisteners();

        // moteur de règles
        game.interRules = setInterval(game.rules.createRules, 100);

        // lancement
        $("#home").show();
        $("#game").hide();
        $("#score").hide();
    }

    game.init();
    window.game = game;
});