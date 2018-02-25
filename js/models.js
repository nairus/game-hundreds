$(document).ready(function () {
    var game = window.game || {};
    var models = {};

    /**
     * Créer les données du jeux.
     */
    models.createDatas = function() {
        models.levelsList = [
            {
                "level": 1,
                "timeLimit": 1000,
                "elements": {
                    "c": game.functions.getRandom(0,5),
                    "d": game.functions.getRandom(0,5),
                    "u": game.functions.getRandom(0,5),
                }
            },
            {
                "level": 2,
                "timeLimit": 800,
                "elements": {
                    "c": game.functions.getRandom(2,7),
                    "d": game.functions.getRandom(2,7),
                    "u": game.functions.getRandom(2,7),
                }
            },
            {
                "level": 3,
                "timeLimit": 600,
                "elements": {
                    "d": game.functions.getRandom(4,9),
                    "u": game.functions.getRandom(4,9),
                    "c": game.functions.getRandom(4,9),
                }
            },
            {
                "level": 4,
                "timeLimit": 500,
                "elements": {
                    "d": game.functions.getRandom(6,11),
                    "c": game.functions.getRandom(6,11),
                    "u": game.functions.getRandom(6,11),
                }
            },
            {
                "level": 5,
                "timeLimit": 400,
                "elements": {
                    "d": game.functions.getRandom(8,13),
                    "c": game.functions.getRandom(8,13),
                    "u": game.functions.getRandom(8,13),
                }
            }
        ];

        models.modes = {
            "currentMode": game.functions.getRandom(0,2),
            "1": {
                "label": "box",
                "elements": {
                    "c": {
                        "size": "xs",
                        "color": "1"
                    },
                    "d": {
                        "size": "s",
                        "color": "0"
                    },
                    "u": {
                        "size": "m",
                        "color": "2"
                    }
                }
            },
            "2": {
                "label": "money",
                "elements": {
                    "c": {
                        "size": "xxl",
                        "color": "1",
                        "fontSize": 15,
                        "fontColor": "4",
                        "value": 100
                    },
                    "d": {
                        "size": "l",
                        "color": "0",
                        "fontSize": 10,
                        "fontColor": "4",
                        "value": 10
                    },
                    "u": {
                        "size": "m",
                        "color": "3",
                        "fontSize": 15,
                        "fontColor": "5",
                        "value": 1
                    }
                }
            }
        };

        models.sizesList = {
            "xs":  5,
            "s":   10,
            "m":   15,
            "l":   20,
            "xl":  25,
            "xxl": 30
        };

        models.colorsList = {
            "0": "#FF0000", // rouge
            "1": "#008000", // vert
            "2": "#0000FF", // bleu
            "3": "gold",    // or
            "4": "#FFFFFF", // blanc
            "5": "#333333", // gris foncé
            "6": "purple"   // violet
        };

        // Ajout des données du canvas.
        var animation = document.getElementById("animation");
        if (animation.getContext) {
            var ctx = animation.getContext("2d");
            // composition
            ctx.globalCompositeOperation = 'lighter';
            var canvas = {
                x: animation.offsetLeft,
                y: animation.offsetTop - $("#home").outerHeight(),
                height: animation.height,
                width: animation.width,
                ctx: ctx
            }

            models.canvas = canvas;
        } else {
            throw Error("Votre navigateur ne supporte pas les canvas.");
        }
    };

    /**
     * Initialise les variables du jeu.
     */
    models.initVariables = function() {
        models.currentScreen = "#home";
        models.resetVariables();
    };
    models.resetVariables = function() {
        models.gameTime = 0;
        models.currentLevel = 0;
    }
    models.changeLevel = function() {
        models.gameTime = 0;
        models.currentLevel ++;
        models.modes.currentMode = game.functions.getRandom(0,2);
        models.clearFields();

    }
    models.clearFields = function() {
        // Remise à zéro de la saisie utilisateur.
        $("#unities #c").val("");
        $("#unities #d").val("");
        $("#unities #u").val("");
        $("#total").val("");
    }


    game.models = models;
    window.game = game;
});