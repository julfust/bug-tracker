$(window).on("load", function() {

    signUp().then((data) => {
        localStorage.setItem("token", data.result.token);
        getBugs(data.result.token);
    });
})

function signUp() {

    return $.ajax({
        url: "http://greenvelvet.alwaysdata.net/bugTracker/api/login/JohnDoe/1337",
        async: true,
        dataType: 'jsonp'
    })
}


function getBugs(token) {

    $.ajax({
        url: `http://greenvelvet.alwaysdata.net/bugTracker/api/list/${token}/0`,
        async: true,
        dataType: 'jsonp'
    }).then((res) => console.log(res))
}