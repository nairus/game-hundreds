$(document).ready(function () {
    var game = window.game || {};
    var models = {};
    var functions = {};


    functions.getRandom = function (min, max) {
        return Math.ceil(Math.random() * (max - min) + min);
    };

    /**
     * Créer les données du jeux.
     */
    functions.createDatas = function() {
        models.modes = {
            "currentMode": functions.getRandom(0,2),
            "1": {
                "label": "box",
                "elements": {
                    "c": {
                        "nb": functions.getRandom(0,9),
                        "size": "xs",
                        "color": "1"
                    },
                    "d": {
                        "nb": functions.getRandom(0,9),
                        "size": "s",
                        "color": "0"
                    },
                    "u": {
                        "nb": functions.getRandom(0,9),
                        "size": "m",
                        "color": "2"
                    }
                }
            }, 
            "2": {
                "label": "money",
                "elements": {
                    "c": {
                        "nb": functions.getRandom(0,9),
                        "size": "xxl",
                        "color": "1",
                        "fontSize": 15,
                        "fontColor": "4",
                        "value": 100
                    },
                    "d": {
                        "nb": functions.getRandom(0,9),
                        "size": "l",
                        "color": "0",
                        "fontSize": 10,
                        "fontColor": "4",
                        "value": 10
                    },
                    "u": {
                        "nb": functions.getRandom(0,9),
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
            "3": "gold",
            "4": "#FFFFFF", // blanc
            "5": "#333333"  // gris foncé
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
     * Initialise les variables du ;jeu.
     */
    functions.initVariables = function() {
        models.currentScreen = "#home";
        models.gameTime = 0;
        models.timeLimit = 1000;
    };

    /**
     * Dessine un carré.
     */
    functions.drawSquare = function(w, x, y, colorId) {
        functions.drawRectangle(w, w, x, y, colorId);
    };

    /**
     * Dessine un rectangle.
     */
    functions.drawRectangle = function(w, h, x, y, colorId) {
        var ctx = game.models.canvas.ctx;
    
        ctx.save();
        // 1. On définit la couleur.
        ctx.fillStyle = models.colorsList[colorId];
        // 2. Définir la rotation
        //ctx.translate(x, y);
        // 3. Dessiner un rectangle
        ctx.fillRect(x, y, w, h);
        // 4. Contour de la forme.
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
    };

    /**
     * Dessine un cercle.
     */
    functions.drawBall = function(radius, x, y, colorId) {
        // sauvegarde de l'état du contexte
        var ctx = models.canvas.ctx;
        ctx.save();
        // dessin
        ctx.translate(x, y);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = models.colorsList[colorId];
        ctx.fill();     
        // retour à l'état précédent du contexte
        ctx.restore();
    };

    /**
     * Ecrit un message dans le canvas.
     */
    functions.writeMessage = function(message, size, colorId, x, y, withStroke) {
        var ctx = models.canvas.ctx;
        ctx.fillStyle = models.colorsList[colorId];
        ctx.font = "Normal " + size + "px Sans-Serif";
        ctx.Baseline = "top";
        // Texte plein
        ctx.fillText(message, x, y);

        if (true === withStroke) {
            // Contour de texte
            ctx.strokeText(message, x + 1, y + 1);    
        }
    };

    /**
     * Dessine l'ensemble des boites de centaines/dizaines/unités
     .
     */
    functions.drawBoxes = function(elements, x, y) {        
        // Initialisation de la position de départ.
        var position = {x: x, y: y};

        // Dessin des centaines.
        var c = elements.c;
        position = functions.drawBloc(c, position, 100, 10);

        var sizeBlocC = (((models.sizesList[c.size] + 1) * 10));
        position.x = x;

        if (c.nb > 0) {
            position.y += sizeBlocC + 20;
        }

        // Dessin des dizaines.
        var d = elements.d;
        position = functions.drawBloc(d, position, 10, 5);

        var sizeBlocD = ((models.sizesList[d.size] + 1) * 2);
        position.x = x;

        if (d.nb > 0) {
            position.y += sizeBlocD + 20;
        }

        // Dessin des unités
        var u = elements.u;
        position = functions.drawBloc(u, position, 1, 1);
    };

    /**
     * Dessine un  bloc de boites (centaines, dizaines, unités).
     */
    functions.drawBloc = function(element, position, nbBloc, nbBlocsPerLine) {
        if (element.nb > 0) {
            var size = models.sizesList[element.size];
            var colorId = element.color;

            var startX = position.x;
            var startY = position.y;

            for (var i = 0; i < element.nb; i++) {
                var tempX = position.x;

                for (var j = 0; j < nbBloc; j++)  {
                    // Si on est en fin de ligne.
                    if (j > 0 &&  j % nbBlocsPerLine == 0) {
                        position.x = tempX;
                        position.y += size + 1;
                    }

                    functions.drawSquare(size, position.x, position.y, colorId);
                    position.x += size + 1;
                }

                // On décale de 5 à la fin du bloc.
                position.x += 5;
                position.y = startY;

                // Si le bloc sort du canvas, on va à la ligne.
                if ((nbBlocsPerLine * (size + 1)) + position.x > models.canvas.width) {
                    position.x = startX;
                    startY = startY + ((nbBloc / nbBlocsPerLine) * (size + 1)) + 5;
                    position.y = startY;
                }
            }
        }
        return position;
    };

    /**
     * Dessine les éléments en mode "argent".
     */
    functions.drawMoney = function(elements, x, y) {
        // Initialisation de la position de départ.
        var position = {x: x, y: y};

        // Dessin des billets de 100 euros.
        var c = elements.c;
        position = functions.drawBankBills(c, position);

        position.x = x;
        if (c.nb > 0) {
            position.y += (models.sizesList[c.size] + 1) + 20;
        }

        // Dessin des billets de 10 euros.
        var d = elements.d
        position = functions.drawBankBills(d, position);

        position.x = x;
        if (d.nb > 0) {
            position.y += (models.sizesList[d.size] + 1) + 20;
        }

        // Dessin des pièces de 1 euro.
        var u = elements.u;
        functions.drawCoins(u, position);
    };
    /**
     * Dessine des billets de banque.
     *
     * Ex. {"nb": 5, "size": "l", "color": "0", "fontSize": 10, "fontColor": "4", "value": 10}
     */
    functions.drawBankBills = function(element, position) {
        if (element.nb > 0) {
            var size = models.sizesList[element.size];
            var colorId = element.color;
            var startX = position.x;

            for (var i = 0; i < element.nb; i++) {
                var w = (size) * 2.5;
                var h = size;
                functions.drawRectangle(w, h, position.x, position.y, element.color);
                functions.writeMessage(element.value, element.fontSize, element.fontColor, (position.x + 2), (position.y + element.fontSize ), false);

                // On décale de 5 à la fin du bloc.
                position.x += ((size + 1) * 2.5) + 5;

                // Si le bloc sort du canvas, on va à la ligne.
                if (((size + 1) * 2.5) + position.x > models.canvas.width) {
                    position.x = startX;
                    position.y += (size + 1) + 5;
                }
            }
        }
        return position;
    };

    /**
     * Dessine des pièce de monnaie.
     */
    functions.drawCoins = function(element, position) {
        if (element.nb > 0) {
            var radius = models.sizesList[element.size];
            var colorId = element.color;
            position.x += radius + 1;
            position.y += radius + 1;
            var startX = position.x;

            for(var i = 0; i < element.nb; i++) {
                functions.drawBall(radius, position.x, position.y, colorId);
                functions.writeMessage(element.value, element.fontSize, element.fontColor, (position.x - 4), (position.y + 4), false);

                // On décale la position pour dessiner la prochaine pièce.
                position.x += (radius * 2) + 5;

                // Si le bloc sort du canvas, on va à la ligne.
                if (((radius + 1) * 2) + position.x > models.canvas.width) {
                    position.x = startX;
                    position.y += (radius * 2) + 5;
                }
            }
        }
        return position;
    };

    /**
     * Efface tous les éléments dessinés dans le canvas.
     */
    functions.clearCanvas = function() {
        var ctx = models.canvas.ctx;
        ctx.clearRect(0,0, models.canvas.width, models.canvas.height);
    };

    /**
     * Remet le jeu à zéro.
     */
    functions.resetGame = function() {
        models.gameTime = 0;
        models.modes.currentMode = functions.getRandom(0, 2);
        models.modes[1].elements.c.nb = functions.getRandom(0, 9);
        models.modes[1].elements.d.nb = functions.getRandom(0, 9);
        models.modes[1].elements.u.nb = functions.getRandom(0, 9);
        models.modes[2].elements.c.nb = functions.getRandom(0, 9);
        models.modes[2].elements.d.nb = functions.getRandom(0, 9);
        models.modes[2].elements.u.nb = functions.getRandom(0, 9);
    };

    game.models = models;
    game.functions = functions;
    window.game = game;
});