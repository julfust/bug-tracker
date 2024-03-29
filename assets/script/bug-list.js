// GLOBAL VARIABLES: DATAS FOR BUG LIST AND USER LIST.
let userList = [];
let bugList = [];

$(window).on("load", function() {

    // Denial access if user tries to access page by URL without authentification token.
    if(!localStorage.getItem("token")) {
        window.location.href = "/";
        return;
    }

    // Event listener: get only user's bugs.
    $("#filter-user-bug").click(() => getBugs(localStorage.getItem("userId")).then((data) => {

        bugList = data.result.bug;

        getUserList().then((data) => {

            userList = data.result.user;

            $("#main-header-paragraph").html(`${bugList.length} bugs, ${bugList.filter((bug) => bug.state === "1").length} en cours, ${bugList.filter((bug) => bug.state === "2").length} traité`);
            
            setInnerBugList();
        })
    }));
    
    // Event listener: get all bug.
    $("#no-filter").click(() => getBugs().then((data) => {

        bugList = data.result.bug;

        getUserList().then((data) => {

            userList = data.result.user;

            $("#main-header-paragraph").html(`${bugList.length} bugs, ${bugList.filter((bug) => bug.state === "1").length} en cours, ${bugList.filter((bug) => bug.state === "2").length} traité`);
            
            setInnerBugList();
        })
    }));

    // Event listener: Trigger for sign-out system.
    $("#sign-out-button").click(() => signOut().then((data) => {

        if(data.result.status === "failure") {
            alert("Erreur: déconnexion impossible");
            return;
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
    }));

    // View initialisation.
    getBugs().then((data) => {

        bugList = data.result.bug;

        $("#main-header-paragraph").html(`${bugList.length} bugs, ${bugList.filter((bug) => bug.state === "1").length} en cours, ${bugList.filter((bug) => bug.state === "2").length} traité`);

        getUserList().then((data) => {
            
            userList = data.result.user;
            setInnerBugList();

            $("#loading-screen").css("display", "none");
            $("#bugs-list-section").css("display", "block");
        })
    });
})

// Ajax request for fetching bugs.
function getBugs(userId = "0") {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${localStorage.getItem("token")}/${userId}`,
        async: true,
        dataType: 'jsonp'
    })
}

// Ajax request for fetching users.
function getUserList() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/users/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}

// Function used to set bug list content.
function setInnerBugList() {

    $("#pagination").pagination({
        dataSource: bugList,
        autoHidePrevious: true,
        showNavigator: true,
        formatNavigator: '<span>Page: <%= currentPage %></span> sur <%= totalPage %>',
        className: 'paginationjs-theme-green paginationjs-big',
        callback: function(bugs) {

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
        }
    })
}

// Function used to format bug's date.
function formatDate(timeStamp) {

    let bugDate = new Date(timeStamp);

    bugDate.setMonth(bugDate.getMonth() + 11);
    bugDate.setFullYear(bugDate.getFullYear() + 51);

    return bugDate.toLocaleDateString("fr-FR");
}

// Function used to change bug state (Ajax request + update view).
function changeBugState(bugId, selectBar) {

    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/state/${localStorage.getItem("token")}/${bugId}/${selectBar.value}`,
        async: true,
        dataType: 'jsonp'
    }).then(() => {
        const bugIndex = bugList.findIndex((bug) => parseInt(bug.id) === bugId);
        bugList[bugIndex].state = selectBar.value;

        $("#main-header-paragraph").html(`${bugList.length} bugs, ${bugList.filter((bug) => bug.state === "1").length} en cours, ${bugList.filter((bug) => bug.state === "2").length} traité`);
    });
}

// Function used to delete bug (Ajax request + update view).
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
                }).then(() => {

                    bugList = bugList.filter((bug) => parseInt(bug.id) !== bugId);

                    $("#main-header-paragraph").html(`${bugList.length} bugs, ${bugList.filter((bug) => bug.state === "1").length} en cours, ${bugList.filter((bug) => bug.state === "2").length} traité`);

                    setInnerBugList();
                });
            },
            Annuler: function () {
                return;
            }
        }
    });
}