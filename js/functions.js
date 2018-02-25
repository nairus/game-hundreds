$(document).ready(function () {
    var game = window.game || {};
    var models = game.models || {};
    var functions = {};


    functions.getRandom = function (min, max) {
        return Math.ceil(Math.random() * (max - min) + min);
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
    functions.drawBoxes = function(nbElements, elements, x, y) {
        // Initialisation de la position de départ.
        var position = {x: x, y: y};

        // Dessin des centaines.
        var c = elements.c;
        position = functions.drawBloc(nbElements.c, c, position, 100, 10);

        var sizeBlocC = (((models.sizesList[c.size] + 1) * 10));
        position.x = x;

        if (nbElements.c > 0) {
            position.y += 10;
            // Si le nb de boite n'est pas égale à la limite en largeur (retour à la ligne auto).
            // On force le retour à la ligne.
            if (nbElements.c != 7) {
                position.y += sizeBlocC;
            }
        }

        // Dessin des dizaines.
        var d = elements.d;
        position = functions.drawBloc(nbElements.d, d, position, 10, 5);

        var sizeBlocD = ((models.sizesList[d.size] + 1) * 2);
        position.x = x;

        if (nbElements.d > 0) {
            position.y += 10;

            // Si le nb de boite n'est pas égale à la limite en largeur (retour à la ligne auto).
            // On force le retour à la ligne.
            if (nbElements.d != 8) {
                position.y += sizeBlocD;
            }
        }

        // Dessin des unités
        position = functions.drawBloc(nbElements.u, elements.u, position, 1, 1);
    };

    /**
     * Dessine un  bloc de boites (centaines, dizaines, unités).
     */
    functions.drawBloc = function(nbElements, element, position, nbBloc, nbBlocsPerLine) {
        if (nbElements > 0) {
            var size = models.sizesList[element.size];
            var colorId = element.color;

            var startX = position.x;
            var startY = position.y;

            for (var i = 0; i < nbElements; i++) {
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
    functions.drawMoney = function(nbElements, elements, x, y) {
        // Initialisation de la position de départ.
        var position = {x: x, y: y};

        // Dessin des billets de 100 euros.
        var c = elements.c;
        position = functions.drawBankBills(nbElements.c, c, position);

        position.x = x;
        var sizeBlocC = models.sizesList[c.size] + 1;
        if (nbElements.c > 0) {
            position.y += 10;
            if (nbElements.c != 6 && nbElements.c != 12) {
                position.y += sizeBlocC;
            }
        }

        // Dessin des billets de 10 euros.
        var d = elements.d
        position = functions.drawBankBills(nbElements.d, d, position);

        position.x = x;
        var sizeBlocD = models.sizesList[d.size] + 1;
        if (nbElements.d > 0) {
            position.y += 10;
            if (nbElements.d != 8) {
                position.y += sizeBlocD;
            }
        }

        // Dessin des pièces de 1 euro.
        functions.drawCoins(nbElements.u, elements.u, position);
    };
    /**
     * Dessine des billets de banque.
     *
     * Ex. {"nb": 5, "size": "l", "color": "0", "fontSize": 10, "fontColor": "4", "value": 10}
     */
    functions.drawBankBills = function(nbElements, element, position) {
        if (nbElements > 0) {
            var size = models.sizesList[element.size];
            var colorId = element.color;
            var startX = position.x;

            for (var i = 0; i < nbElements; i++) {
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
    functions.drawCoins = function(nbElements, element, position) {
        if (nbElements > 0) {
            var radius = models.sizesList[element.size];
            var colorId = element.color;
            position.x += radius + 1;
            position.y += radius + 1;
            var startX = position.x;

            for(var i = 0; i < nbElements; i++) {
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
        models.resetVariables();

        // Remise à zéro des données.
        models.modes.currentMode = functions.getRandom(0, 2);
        var min = 0;
        var max = 5;
        for (var i = 0; i < models.levelsList.length; i++) {
            var elements = models.levelsList[i].elements;
            elements.c = game.functions.getRandom(min, max);
            elements.d = game.functions.getRandom(min, max);
            elements.u = game.functions.getRandom(min, max);
            min += 2;
            max += 2;
        }

        models.clearFields();

        // On vide le canvas.
        functions.clearCanvas();
    };

    game.models = models;
    game.functions = functions;
    window.game = game;
});