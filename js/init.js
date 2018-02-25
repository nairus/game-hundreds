$(document).ready(function () {
    var game = window.game || {};

    /**
     * Initialise l'application.
     */
    game.init = function() {
        // définitions des données
        game.models.createDatas();
        // initialisation des variables
        game.models.initVariables();
        // définitions des gestionnaires
        game.listeners.createlisteners();

        // moteur de règles
        game.interRules = setInterval(game.rules.createRules, 100);

        $("#description").html("Trouve le nombre juste selon le mode (boite ou euros) et passe avec succès les " + game.models.levelsList.length + " niveaux du jeux.");

        // lancement
        $("#home").show();
        $("#game").hide();
        $("#score").hide();
    }

    game.init();
    window.game = game;
});