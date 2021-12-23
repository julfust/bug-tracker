$(window).on("load", function() {

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

        signUp(login, password).then((data) => {
            
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

function signUp(login, password) {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/login/${login}/${password}`,
        async: true,
        dataType: 'jsonp'
    })
}

function showError(errorMessage) {

    $("#sign-up-paragraph").css("padding-bottom", "1rem");

    $("#error-message").text(errorMessage);
    $("#error-message").css("display", "block");
    
    $(".input-field").each(function() {
        $(this).css("border-color", "red");
    });
}