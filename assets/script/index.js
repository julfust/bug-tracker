$(window).on("load", function() {

    //Remove token if user accesses page by URL.
    if(localStorage.getItem("token")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
    }

    // Form datas values.
    let login = "";
    let password = "";

    // Event listener: Update form datas values.
    $("#input-field-login").change((e) => login = e.target.value);
    $("#input-field-password").change((e) => password = e.target.value);

    // Event listener: Form datas submission.
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

// Ajax request for user sign-in.
function signIn(login, password) {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/login/${login}/${password}`,
        async: true,
        dataType: 'jsonp'
    })
}