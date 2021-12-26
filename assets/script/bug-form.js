$(window).on("load", function() {

    if(!localStorage.getItem("token")) {
        window.location.href = "/";
        return;
    }

    let title = "";
    let description = "";

    $("#input-field-title").change((e) => title = e.target.value);
    $("#input-field-description").change((e) => description = e.target.value);

    $("#submit-form-button").click((e) => {

        e.preventDefault();

        if(!title || !description) {
            showError("Veuillez renseigner l'intégralité des champs");
            return;
        }

        const formData = JSON.stringify({title: title, description: description});

        addBug(formData).then((data) => {

            const response = JSON.parse(data);

            if(response.result.status === "failure") {
                alert("Erreur: le bug n'a pas été ajouté");
                return;
            }

            window.location.href = "/bug-list.html";
        });
    })

    $("#sign-out-button").click(() => signOut().then((data) => {

        if(data.result.status === "failure") {
            alert("Erreur: déconnexion impossible");
            return;
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/";
    }));
})

function addBug(formData) {

    return $.post(`http://greenvelvet.alwaysdata.net/bugTracker/api/add/${localStorage.getItem("token")}/${localStorage.getItem("userId")}`, formData);
}