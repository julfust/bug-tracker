$(window).on("load", function() {

    let login = "";
    let password = "";

    $("#input-field-login").change((e) => login = e.target.value);
    $("#input-field-password").change((e) => password = e.target.value);

    $("#submit-form-button").click((e) =>{

        e.preventDefault();

        signUp(login, password).then((data) => {
            
            if(data.result.status === "failure") {

                $("#sign-up-paragraph").css("padding-bottom", "1rem");
                $("#error-message").css("display", "block");
                
                $(".input-field").each(function() {
                    $(this).css("border-color", "red");
                });

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