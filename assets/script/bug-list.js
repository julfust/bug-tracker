$(window).on("load", function() {

    $("#sign-out-button").click(() => signOut().then((data) => {

        if(data.result.status === "failure") {
            alert("Erreur: déconnexion impossible");
            return;
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
    }));

    $("#filter-user-bug").click(() => getBugs(localStorage.getItem("userId")).then((data) => setInnerBugList(data.result.bug)));
    $("#no-filter").click(() => getBugs().then((data) => setInnerBugList(data.result.bug)));

    getBugs().then((data) => setInnerBugList(data.result.bug));
})

function signOut() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}


function getBugs(userId = "0") {

    console.log(userId);

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${localStorage.getItem("token")}/${userId}`,
        async: true,
        dataType: 'jsonp'
    })
}

function setInnerBugList(bugs) {

    console.log(bugs);

    $("#main-header-paragraph").html(`${bugs.length} bugs, ${bugs.filter((bug) => bug.state === "1").length} en cours, ${bugs.filter((bug) => bug.state === "2").length} traité`);
    
    getUserList().then((data) => {

        const userList = data.result.user;
        let innerContent = "";

        bugs.map((bug) => {

            innerContent += `
                <div class="list-grid" id="list-grid">
                    <div class="list-grid-item bug-info">
                        <h3 class="bug-title">${bug.title}</h3>
                        <p class="bug-description">${bug.description}</p>
                    </div>

                    <p class="list-grid-item bug-date">${formatDate(bug.timestamp)}</p>

                    <p class="list-grid-item bug-name">${userList[parseInt(bug.user_id)]}</p>

                    <div class="list-grid-item bug-state">
                        <select name="bug-state" class="bug-state-select" onchange="changeBugState(${bug.id}, this)">
                            <option value="0" ${bug.state === "0" ? "selected" : ""}>Non traité</option>
                            <option value="1" ${bug.state === "1" ? "selected" : ""}>En cours</option>
                            <option value="2" ${bug.state === "2" ? "selected" : ""}>Traité</option>
                        </select>
                    </div>

                    <div class="list-grid-item">
                        <button class="delete-button" onclick="deleteBug(${bug.id})">Supprimer</button>
                    </div>
                </div>
            `
        })

        $("#inner-bug-list").html(innerContent);
    });
}

function getUserList() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/users/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}

function formatDate(timeStamp) {

    let bugDate = new Date(timeStamp);

    bugDate.setMonth(bugDate.getMonth() + 11);
    bugDate.setFullYear(bugDate.getFullYear() + 51);

    return bugDate.toLocaleDateString("fr-FR");
}

function changeBugState(bugId, selectBar) {

    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/state/${localStorage.getItem("token")}/${bugId}/${selectBar.value}`,
        async: true,
        dataType: 'jsonp'
    }).then(() => getBugs().then((data) => setInnerBugList(data.result.bug)));
}

function deleteBug(bugId) {

    $.confirm({
        title: '⚠️ Suppression',
        content: 'Vous êtes sur le point de supprimer un bug. Les données seront perdu de facon définitive. <br />Souhaitez-vous continuer ?',
        buttons: {
            Valider: function () {
                
                $.ajax({
                    url: `http://greenvelvet.alwaysdata.net/bugTracker/api/delete/${localStorage.getItem("token")}/${bugId}`,
                    async: true,
                    dataType: 'jsonp'
                }).then(() => getBugs().then((data) => setInnerBugList(data.result.bug)));
            },
            Annuler: function () {
                return;
            }
        }
    });
}