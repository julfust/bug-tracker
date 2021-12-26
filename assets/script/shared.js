// Ajax request for user sign-out.
function signOut() {

    return $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/logout/${localStorage.getItem("token")}`,
        async: true,
        dataType: 'jsonp'
    })
}

// Function used to display error messages on forms (sign-in, sign-out and add-bug).
function showError(errorMessage) {

    $("#sign-up-paragraph").css("padding-bottom", "1rem");

    $("#error-message").text(errorMessage);
    $("#error-message").css("display", "block");
    
    $(".input-field").each(function() {
        $(this).css("border-color", "red");
    });
}