$(document).ready(function () {
    var game = window.game || {};
    var models = game.models || {};
    var rules = game.rules || {};
    var functions = game.functions || {};

    /**
     * Création des règles du jeu.
     */
    rules.createRules = function() {
        if ("#game" == models.currentScreen) {
            rules.animate();
            // On incrémente que les 10ème de secondes
            models.gameTime ++;
        }
    };

    /**
     * Arrêt du jeu.
     */
    rules.stopGame = function() {
        models.gameTime = 0;
    };

    /**
     * Animation du jeu.
     */
    rules.animate = function() {
        if (models.timeLimit <= models.gameTime) {
            rules.displayScore("Game Over: Temps dépassé", false);
        } else {            
            // effaçage de tous les dessins.
            functions.clearCanvas();
            functions.writeMessage("Temps: " + Math.ceil(models.gameTime / 10) + "'' / " + (models.timeLimit / 10) + " sec.", 12, "blue", 5, 20, true);
            functions.writeMessage("Mode: " + models.modes[models.modes.currentMode].label, 10, "green", 5, 40, true);
            
            // Initialisation des positions 10px en dessous des écritures.
            var x = 0;
            var y = 60;

            // On dessine les formes selon le mode (box/money);
            var elements = models.modes[models.modes.currentMode].elements;
            if (models.modes.currentMode == 1) {
                functions.drawBoxes(elements, x, y);
            } else {
                functions.drawMoney(elements, x, y);
            }
        }
    };

    /**
     * Affiche l'écran de score (bilan).
     */
    rules.displayScore = function (message, success, score) {
        models.currentScreen = "#score";
        var cssClass = "fail";
        if (true === success) {
            cssClass = "success"
        }
        $summary = $("#summary");
        $summary.removeClass();
        $summary.addClass(cssClass);
        $summary.html("<span>" + message + "</span>");
        if (false == success && "undefined" != typeof score) {
            $summary.append("<br><em>Le score à trouver était: <strong>" + score + "</strong></em>");
        }

        $("#game").hide();
        $("#score").show();
    }

    game.rules = rules;
    window.game = game;
});