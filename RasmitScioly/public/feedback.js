window.addEventListener("load", () => {
    var urlParams = new URLSearchParams(decodeURIComponent(window.location.search));
    var query = urlParams.get('query');

    var filters = [];

    urlParams.forEach((value, key) => {
        if (key == "competition") {
            window.competition = value;
        } else if (key == "event") {
            window.event = value;
        } else if (key == "division") {
            window.divsion = value;
        }
    });
});

function submit(competition = "", event = "", division = "") {
    var competed = document.getElementById("competedYes").value;
    var id = document.getElementById("id").value;
    var neww = document.getElementById("firstYes").value;
    var difficulty = document.getElementById("difficultyRange").value;
    var quality = document.getElementById("qualityRange").value;
    var issues = document.getElementById("issues").value;
    var thoughts = document.getElementById("thoughts").value;
    var criticism = document.getElementById("criticism").value;
    var fun = document.getElementById("funYes").value;

    if (id == "") {
        id = new Date().getTime();
    }

    if (competition == "") {
        competition = window.competition;
    }

    if (event == "") {
        event = window.event;
    }

    console.log(id, competed, neww, difficulty, quality, issues, thoughts, criticism, fun);

    competitions.doc(competition).collection(event + division).doc(id).get().then(function (doc) {
        if (doc.exists) {
            console.log(`Duplicate submission`);

            return alert(`Based on your name/team name/team ID, it looks like you've already submitted this form!`
                       + `If you think this is a mistake, or if you would like to resubmit feedback, you may contact me at rdatch101@gmail.com.`);
        } else {
            doc.set({
                id: id,
                competed: competed,
                new: neww,
                difficulty: difficulty,
                quality: quality,
                issues: issues,
                thoughts: thoughts,
                criticism: criticism,
                fun: fun
            }, { merge: true }).then(function () {
                console.log(`Successfully submitted feedback!`);

                return alert(`Successfully submitted feedback! Thank you for your time!`);
            }).catch(function (e) {
                console.error(e);

                return alert("Error occurred! Please contact a developer!");
            });
        }
    }).catch(function (e) {
        console.error(e);

        return alert("Error occurred! You may contact me at rdatch101@gmail.com if you want.");
    });
}