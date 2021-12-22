$(window).on("load", function() {

    $("#sign-out-button").click(() => signOut().then((data) => {

        if(data.result.status === "failure") {
            alert("Erreur serveur: déconnexion impossible");
            return;
        }
        
        localStorage.removeItem("token");
        window.location.href = "/";
    }));

    getBugs().then((data) => setInnerBugList(data.result.bug));
})

function signOut() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}


function getBugs() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${localStorage.getItem("token")}/0`,
        async: true,
        dataType: 'jsonp'
    })
}

function setInnerBugList(bugs) {

    console.log(bugs);
    
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
                        <select name="bug-state" id="bug-state-select" class="bug-state-select" value=${bug.state}>
                            <option value="1">Non traité</option>
                            <option value="2">En cours</option>
                            <option value="3">Traité</option>
                        </select>
                    </div>

                    <div class="list-grid-item">
                        <button class="delete-button" onclick="deleteBug(${bug.id})">Supprimer</button>
                    </div>
                </div>
            `

            $("#inner-bug-list").html(innerContent);
        })
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
                }).then(() => getBugs().then((data) => setInnerBugList(data.result.bug)))
            },
            Annuler: function () {
                return;
            }
        }
    });
}