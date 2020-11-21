var currentPage = "homeDiv";

document.addEventListener('keydown', function (event) {
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
		case "ArrowUp": case "w":
			var currentPosition = document.getElementById("fish").style.marginTop;
			currentPosition = Number(currentPosition.substr(0, currentPosition.indexOf("px")));
			var increment = (currentPosition >= 0.05 * window.innerHeight) ? (0.03 * window.innerHeight) : 0;
			var newPosition = currentPosition - increment;

			document.getElementById("fish").style.marginTop = newPosition + "px";

			setTimeout(async function () {
				document.getElementById("bear").style.marginTop = newPosition + "px";
			}, 500);
			break;
		case "ArrowDown": case "s":
			var currentPosition = document.getElementById("fish").style.marginTop;
			currentPosition = Number(currentPosition.substr(0, currentPosition.indexOf("px")));
			var increment = (currentPosition <= 0.8 * window.innerHeight) ? (0.03 * window.innerHeight) : 0;
			var newPosition = currentPosition + increment;

			document.getElementById("fish").style.marginTop = newPosition + "px";

			setTimeout(async function () {
				document.getElementById("bear").style.marginTop = newPosition + "px";
			}, 500);
			break;
	}
});

function show(element) {
	document.getElementById(element).style.display = "flex";
}

function hide(element) {
	document.getElementById(element).style.display = "none";
}

var health = 100;
var distance = 0;
var collisions = 0;

function start() {
	hide("homeDiv");
	show("gameDiv");

	currentPage = "gameDiv";

	const bear = `
	    <img
	        id="bear"
	        class="bear"
			src="bear.png"
			width="10%"
			height="12%"
	        style="z-index: 1000; position: absolute; margin-top: ${window.innerHeight * 0.48}px; margin-left: ${window.innerWidth * 0.03}px;"
	    >
	`;

	const fish = `
	    <img
	        id="fish"
	        class="fish"
			src="fish.png"
			width="8%"
			height="10%"
	        style="z-index: 999; position: absolute; margin-top: ${window.innerHeight * 0.48}px; margin-left: ${window.innerWidth * 0.20}px;"
	    >
	`;

	document.getElementById("gameDiv").innerHTML += fish;
	document.getElementById("gameDiv").innerHTML += bear;

	setTimeout(spawner, 1000);

	setInterval(collisionDetection, 500);
}

async function spawner() {
	if (currentPage != "gameDiv") {
		alert("Game over! Your score was " + distance + "!");

		health = 100;
		distance = 0;
		collisions = 0;

		return;
	}

	// var right = Math.floor(Math.random() * 8);
	// var right = 0;
	var right = distance % 8;
	
	switch (right) {
		case 0:
			var name = "object" + distance;
			var classList = "flow gravity";
			var src = "rock0.png";
			var dimensions = `width="${7 * (Math.random() + 0.5)}%" height="${7 * (Math.random() + 0.5)}%"`;
			var marginTop = 0.015 * window.innerHeight;
			var marginLeft = Math.floor(Math.random() * window.innerWidth * 0.9);
			var delay = 1000;
			break;
		case 1:
			var name = "object" + distance;
			var classList = "flow gravity";
			var src = "bottle.png";
			var dimensions = `width="3%" height="15%"`;
			var marginTop = 0.015 * window.innerHeight;
			var marginLeft = Math.floor(Math.random() * window.innerWidth * 0.9);
			var delay = 1000;
			break;
		case 2:
			var name = "object" + distance;
			var classList = "flow";
			var src = "derp_fish.png";
			var dimensions = `width="10%" height="10%"`;
			var marginTop = Math.floor(Math.random() * window.innerHeight * 0.86);
			var marginLeft = window.innerWidth * 0.98;
			var delay = 1000;
			break;
		case 3:
			var name = "object" + distance;
			var classList = "flow";
			var src = "blue_fish.png";
			var dimensions = `width="8%" height="10%"`;
			var marginTop = Math.floor(Math.random() * window.innerHeight * 0.86);
			var marginLeft = window.innerWidth * 0.98;
			var delay = 1000;
			break;
		case 4:
			var name = "object" + distance;
			var classList = "flow gravity";
			var src = "toilet.png";
			var dimensions = `width="5%" height="12%"`;
			var marginTop = 0.015 * window.innerHeight;
			var marginLeft = Math.floor(Math.random() * window.innerWidth * 0.9);
			var delay = 1500;
			break;
		case 5:
			var name = "object" + distance;
			var classList = "flow gravity";
			var src = "plastic_bag.png";
			var dimensions = `width="5%" height="12%"`;
			var marginTop = 0.015 * window.innerHeight;
			var marginLeft = Math.floor(Math.random() * window.innerWidth * 0.9);
			var delay = 1500;
			break;
		case 6:
			var name = "object" + distance;
			var classList = "flow";
			var src = "blue_fish.png";
			var dimensions = `width="8%" height="10%"`;
			var marginTop = 0.5 * window.innerHeight;
			var marginLeft = window.innerWidth * 0.98;
			var delay = 1000;
			break;
		case 7:
			var name = "object" + distance;
			var classList = "flow";
			var src = "volcano.png";
			var dimensions = `width="40%" height="60%"`;
			var marginTop = 0.35 * window.innerHeight;
			var marginLeft = window.innerWidth * 0.98;
			var delay = 1000;
			break;
	}

	const object = `
	    <img
	        id="${name}"
	        class="${classList}"
			src="${src}"
			${dimensions}
	        style="z-index: ${distance + 5}; position: absolute; margin-top: ${marginTop}px; margin-left: ${marginLeft}px;"
	    >
	`;

	document.getElementById("gameDiv").innerHTML += object;

	var move = setInterval(async function () {
		var beforeLeft = document.getElementById(name).style.marginLeft;

		if (classList.includes("flow")) {
			var incrementLeft = window.innerWidth * 0.005;
			var newMarginLeft = Number(beforeLeft.substr(0, beforeLeft.indexOf("px"))) - incrementLeft;
			document.getElementById(name).style.marginLeft = newMarginLeft + "px";
		} else {
			newMarginLeft = beforeLeft;
		}

		var beforeTop = document.getElementById(name).style.marginTop;

		if (classList.includes("gravity")) {
			var incrementTop = window.innerHeight * 0.005;
			var newMarginTop = Number(beforeTop.substr(0, beforeTop.indexOf("px"))) + incrementTop;
			document.getElementById(name).style.marginTop = newMarginTop + "px";
		} else {
			newMarginTop = beforeTop;
		}

		if (newMarginTop >= 0.86 * window.innerHeight) {
			classList = "flow";
		}

		if (newMarginLeft <= 0) {
			document.getElementById(name).remove();

			return clearInterval(move);
		}

		// console.log(`[${right}] ${name}: (${beforeLeft}, ${beforeTop}) -> (${newMarginLeft}, ${newMarginTop})`);
	}, 50);

	distance++;

	return setTimeout(spawner, delay);
}

async function collisionDetection() {
	var fish = document.getElementById("fish");

	const fx1 = Number(fish.style.marginLeft.substr(0, fish.style.marginLeft.indexOf("px")));
	const fx2 = fish.width + fx1;

	const fy1 = Number(fish.style.marginTop.substr(0, fish.style.marginTop.indexOf("px")));
	const fy2 = fish.height + fy1;

	for (object of document.getElementById("gameDiv").children) { 
		if (object.tagName != "IMG" || ["background", "bear", "fish"].includes(object.id)) continue;

		const x1 = Number(object.style.marginLeft.substr(0, object.style.marginLeft.indexOf("px")));
		const x2 = object.width + x1;
	
		const y1 = Number(object.style.marginTop.substr(0, object.style.marginTop.indexOf("px")));
		const y2 = object.height + y1;
	
		if (
			// 4 Corners
			(
				x2 > fx1 && x2 < fx2 &&
				y1 > fy1 && y1 < fy2
			)
			||
			(
				x1 > fx1 && x1 < fx2 &&
				y1 > fy1 && y1 < fy2
			)
			||
			(
				x2 > fx1 && x2 < fx2 &&
				y2 > fy1 && y2 < fy2
			)
			||
			(
				x1 > fx1 && x1 < fx2 &&
				y2 > fy1 && y2 < fy2
			)
		) {
			object.remove();

			collisions++;

			health -= 10;

			var decrement = (window.innerWidth * 0.03 + bear.width) / 10;

			var beforeLeft = document.getElementById("fish").style.marginLeft;
			var newMarginLeft = Number(beforeLeft.substr(0, beforeLeft.indexOf("px"))) - decrement;
			document.getElementById("fish").style.marginLeft = newMarginLeft + "px";

			document.getElementById("healthNumber").textContent = `Health: ${health}`;

			document.getElementById("health").style.width = `${health}%`;
			document.getElementById("health").textContent = `${health}%`;
			
			if (health <= 0) {
				setTimeout(async function () {
					alert("Game over! Your score was " + distance + "!");

					health = 100;
					distance = 0;
					collisions = 0;
					
					return document.location.reload();
				}, 500);
			}
		}
	}
}

function quit() {
	hide("gameDiv");
	show("homeDiv");

	currentPage = "homeDiv";

	document.getElementById("gameDiv").innerHTML = `
		<div id="score">
			<p id="healthNumber">Health: 100</p>

			<div class="progress">
				<div id="health" class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuemin="0" aria-valuemax="100">100%</div>
			</div>
		</div>

		<img id="background" class="background" src="background.png">
	`;
}