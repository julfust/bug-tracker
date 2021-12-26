$(window).on("load", function() {

    //Remove token if user accesses page by URL.
    if(localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }

    // Form datas values.
    let login = "";
    let password = "";
    let passwordConfirm = "";

    // Event listener: Update form datas values.
    $("#input-field-login").change((e) => login = e.target.value);
    $("#input-field-password").change((e) => password = e.target.value);
    $("#input-field-password-confirm").change((e) => passwordConfirm = e.target.value);

    // Event listener: Form datas submission.
    $("#submit-form-button").click((e) => {

        e.preventDefault();

        if(!login || !password || !passwordConfirm) {
            showError("Veuillez renseigner l'intégralité des champs");
            return;
        }

        if(password !== passwordConfirm) {
            showError("Les champs des mots de passe doivent être identiques");
            return;
        }

        signUp(login, password).then((data) => {

            if(data.result.status === "failure") {
                showError("Ce nom d'utilisateur a déjà été pris Veuillez en sélectionner un autre");
                return;
            }

            localStorage.setItem("token", data.result.token);
            localStorage.setItem("userId", data.result.id);
            window.location.href = "./bug-list.html";
        });
    })
})

// Ajax request for user sign-in.
function signUp(login, password) {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/signup/${login}/${password}`,
        async: true,
        dataType: 'jsonp'
    })
}