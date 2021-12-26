$(window).on("load", function() {

    if(localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }

    let login = "";
    let password = "";

    $("#input-field-login").change((e) => login = e.target.value);
    $("#input-field-password").change((e) => password = e.target.value);

    $("#submit-form-button").click((e) =>{

        e.preventDefault();

        if(!login || !password) {
            showError("Veuillez renseigner l'intégralité des champs");
            return;
        }

        signIn(login, password).then((data) => {
            
            if(data.result.status === "failure") {
                showError("Identifiant ou mot de passe erroné");
                return;
            }

            localStorage.setItem("token", data.result.token);
            localStorage.setItem("userId", data.result.id);
            window.location.href = "./bug-list.html";
        })
    });
})

function signIn(login, password) {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/login/${login}/${password}`,
        async: true,
        dataType: 'jsonp'
    })
}