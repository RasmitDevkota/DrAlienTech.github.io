var currentPage = "homeDiv";

window.onload = function () {
	var backgroundImage = localStorage.getItem("backgroundImage");

	if (backgroundImage && backgroundImage != "") {
		document.getElementById("background").src = backgroundImage;
	} else {
		document.getElementById("background").src = "other-background.png";
	}
};

function setBackground(background = "other-background.png") {
	document.getElementById("background").src = background;
}

document.addEventListener('keydown', function (event) {
	console.log(event.key);

	switch (event.key) {
		case "Escape":
			if (currentPage == "gameDiv") {
				quit();
			}
			break;
		case " ":
			if (currentPage == "gameDiv") {
				pause();
			} else {
				start();
			}
			break;
		case "w":
			document.getElementById("background").src = "background.png";
			break;
		case "m":
			document.getElementById("background").src = "other-background.png";
			break;
	}
});

function show(element) {
	document.getElementById(element).style.display = "flex";
}

function hide(element) {
	document.getElementById(element).style.display = "none";
}

var score = 0;
var pretzelCount = 0;
var pretzelLoss = 0;

function start() {
	hide("homeDiv");
	show("gameDiv");

	currentPage = "gameDiv";

	var game = setInterval(async function () {
		if (currentPage != "gameDiv") {
			pretzelCount = 0;
			pretzelLoss = 0;

			alert("Game over! Your score was: " + score + " 🥨!");
			score = 0;

			return clearInterval(game);
		}

		if (pretzelCount > 500) {
			return clearInterval(game);
		}

		if (pretzelLoss > 100) {
			pretzelCount = 0;
			pretzelLoss = 0;

			alert("Game over! Your score was: " + score + " 🥨!");
			score = 0;

			hide("gameDiv");
			show("homeDiv");

			currentPage = "homeDiv";

			return clearInterval(game);
		}

		var left = Math.floor(Math.random() * 0.96 * document.body.clientWidth);

		if (left % 8 == 0) {
			var name = "wonkek" + pretzelCount;

			var drop = `
				<img id="${name}" class="wonkek" src="wonkekspin.gif" width="4%" height="8%" onmouseover="pretzelClick('${name}')" style="z-index: ${pretzelCount}; position: absolute; margin-top: -15%; margin-left: ${left}px;">
			`;
		} else {
			var name = "pretzel" + pretzelCount;

			var drop = `
				<img id="${name}" class="pretzel" src="pretzel.svg" width="61" onmouseover="pretzelClick('${name}')" style="z-index: ${pretzelCount}; position: absolute; margin-top: -15%; margin-left: ${left}px;">
			`;
		}

		document.getElementById("gameDiv").innerHTML += drop;

		var move = setInterval(async function () {
			var before = document.getElementById(name).style.marginTop;

			if (name.includes("wonkek")) {
				var newMarginTop = Number(before.substr(0,before.indexOf("%"))) + 5;
			} else {
				var newMarginTop = Number(before.substr(0,before.indexOf("%"))) + 0.5;
			}

			document.getElementById(name).style.marginTop = newMarginTop + "%";

			if (newMarginTop > 45) {
				document.getElementById(name).remove();

				pretzelLoss++;
				pretzelCount--;

				// console.log(`Removed ${name}`);

				return clearInterval(move);
			}

			// console.log(`${name}: ${before} -> ${document.getElementById(name).style.marginTop}`);
		}, 100);

		pretzelCount++;
	}, 250);
}

async function pretzelClick(name) {
	return setTimeout(function() {
		document.getElementById(name).remove();

		var audio = new Audio('pretzel.mp4');
		audio.play();

		if (name.includes("wonkek")) {
			score += 5;
		} else {
			score++;
		}

		pretzelCount--;
		pretzelLoss--;

		document.getElementById("score").textContent = "Score: " + score + "🥨";
	}, 0);
}

function pause() {

}

function unpause() {

}

function quit() {
	hide("gameDiv");
	show("homeDiv");

	currentPage = "homeDiv";

	document.getElementById("gameDiv").innerHTML = `
		<p id="score">Score: 0🥨</p>
		<img id="background" src="other-background.png">
	`;
}