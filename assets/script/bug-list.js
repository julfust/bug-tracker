$(window).on("load", function() {

    $("#sign-out-button").click(() => signOut().then((data) => {

        if(data.result.status === "failure") {
            alert("Erreur serveur: déconnexion impossible");
            return;
        }
        
        localStorage.removeItem("token");
        window.location.href = "/";
    }));

    getBugs(localStorage.getItem("token")).then((data) => setInnerBugList(data.result.bug));
})

function signOut() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}


function getBugs(token) {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/0`,
        async: true,
        dataType: 'jsonp'
    })
}

function setInnerBugList(bugs) {

    console.log(bugs);

    bugs.map((bug) => {

        $("#bugs-list").append(`
            <div class="list-grid" id="list-grid">
                <div class="list-grid-item bug-info">
                    <h3 class="bug-title">${bug.title}</h3>
                    <p class="bug-description">${bug.description}</p>
                </div>

                <p class="list-grid-item bug-date">${formatDate(bug.timestamp)}</p>

                <p class="list-grid-item bug-name">${bug.user_id}</p>

                <div class="list-grid-item bug-state">
                    <select name="bug-state" id="bug-state-select" class="bug-state-select" value=${bug.state}>
                        <option value="1">Non traité</option>
                        <option value="2">En cours</option>
                        <option value="3">Traité</option>
                    </select>
                </div>

                ${
                    bug.user_id === localStorage.getItem("userId") ?
                        `<div class="list-grid-item">
                            <button class="delete-button">Supprimer</button>
                        </div>`
                        :
                        ""
                }
            </div>
        `)
    })
}

function formatDate(timeStamp) {

    const currentDate = new Date();

    let bugDate = new Date(timeStamp);

    bugDate.setMonth(currentDate.getMonth());
    bugDate.setFullYear(currentDate.getFullYear());

    return bugDate.toLocaleDateString("fr-FR");
}