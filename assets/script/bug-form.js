$(window).on("load", function() {

    // Denial access if user tries to access page by URL without authentification token.
    if(!localStorage.getItem("token")) {
        window.location.href = "/";
        return;
    }

    // Form datas values.
    let title = "";
    let description = "";

    // Event listener: Update form datas values.
    $("#input-field-title").change((e) => title = e.target.value);
    $("#input-field-description").change((e) => description = e.target.value);

    // Event listener: Form datas submission.
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
})

// Ajax request for adding bug.
function addBug(formData) {

    return $.post(`http://greenvelvet.alwaysdata.net/bugTracker/api/add/${localStorage.getItem("token")}/${localStorage.getItem("userId")}`, formData);
}