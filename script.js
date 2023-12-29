let currPage = 1;
let posts = [];
let userID
let loginStatus

$(document).ready(function(){

    $("#loginFront").show()
    $("#registerFront").hide()
    $("#inProgress").hide()
    

    $("#logout").click(function(){
        localStorage.clear();
        $("#loginFront").show()
        $("#registerFront").hide()
        $("#inProgress").hide()
    });

    
    $("#registerer").click(function(){
        $("#loginFront").hide()
        $("#registerFront").show()
    });

    $("#loginer").click(function(){
        $("#loginFront").show()
        $("#registerFront").hide()
    });

    $("#createUser").click(function(){
        const rFirstName = $("#rFirstName").val();
        const rLastName = $("#rLastName").val();
        const rUserName = $("#rUserName").val();

        if (rFirstName === "" || rLastName === "" || rUserName === "") {
            alert("Please fill in all the details");
            return;
        }

        $.ajax({
            type: "POST",
            url: "http://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/userRegistration.php",
            data: {
                firstname : rFirstName,
                lastname : rLastName,
                username : rUserName,
                role : "user"
            },
            success: (data) => {
                if(data.success == true){
                    data = JSON.stringify(data);
                    data = JSON.parse(data);
                    console.log(data)
                    userID = data.user.uid
                    localStorage.setItem("currUser", JSON.stringify(data));
                    localStorage.setItem("loggedIn", "true");
                    alert("Welcome to Metro Events!")
                    $("#registerFront").hide()
                    $("#inProgress").show()
                    showPosts(posts);
                }else{
                    alert(data.message)
                }
            },
            error: function(xhr, status, error) {
                var err = eval("An error has occured" + "(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });

    $("#login").click(function(){
        const lUserName = $("#lUserName").val();
        $.ajax({
            type: "POST",
            url: "https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/userLogin.php",
            data: {
                username : lUserName
            },
            success: (data) => {
                if(data.success == false){
                    alert("Error: User may not exist. Register instead");
                }else{
                    data = JSON.stringify(data);
                    data = JSON.parse(data);
                    console.log(data)
                    userID = data.user.id
                    localStorage.setItem("currUser", JSON.stringify(data));
                    localStorage.setItem("loggedIn", "true");
                    localStorage.setItem("currPage", currPage);
                    console.log(userID)
                    // lastPage();
                    $("#loginFront").hide();
                    $("#inProgress").show();
                    showPosts(posts);
                }
            },
            error: function(xhr, status, error) {
                var err = eval("An error has occured" + "(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });

    $("#newPost").click(function(){
        const message = $("#newPostText").val();
        $.ajax({
            type: "POST",
            url: "http://hyeumine.com/forumNewPost.php",
            data: {
                id : userID,
                post : message
            },
            success: (data) => {
                data = JSON.parse(data);
                console.log(data);
                alert("Successfully posted! Refresh page to see post.");
            },    
            error: function(xhr, status, error) {
                var err = eval("An error has occured" + "(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });
});

function showPosts(){
    let posts

    $.ajax({
        type: "GET",
        async: false,
        url: `https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/getPosts.php`,
        success: (data) => {
            data = JSON.stringify(data)
            data = JSON.parse(data)
            posts = data
            console.log(posts)
        },
        error: function(xhr, status, error) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });

    $("#posts").html("");
    posts.forEach((post) => {
        $("#posts").append(`
            <div class="wholePost" id="wh${post.postid}">
                <div class="poster">${post.user} posted: <div class="posterCode">User Code: ${post.uid}</div></div>
                <div class="indivPost">
                    <div class="postItself">${post.eventdetails}</div>
                </div>
                <div class="date">${post.postdate} <div class="posterCode">Post Code: ${post.postid}</div></div>
            </div> 
        `);
    });
}

function replyPost(code){
    const replyCode = code;
    const replyMsg = $(`#pr${replyCode}`).val();
    $.ajax({
        type: "POST",
        url: "http://hyeumine.com/forumReplyPost.php",
        data: {
            user_id : userID,
            post_id : replyCode,
            reply : replyMsg
        },
        success: (data) => {
            data = JSON.parse(data);
            console.log(data);
            alert("Successfully replied! Refresh page to see reply.");
        },
        error: function(xhr, status, error) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function deletePost(code){
    const deleteCode = code;    
    $.ajax({
        type: "GET",
        url: "http://hyeumine.com/forumDeletePost.php",
        data: {
            id : deleteCode
        },
        success: (data) => {
            data = JSON.parse(data);
            console.log(data);
            document.getElementById(`wh${code}`).remove();
            alert("Successfully deleted post!");
        },
        error: function(xhr, status, error) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}


function deleteReply(code){
    const deleteCode = code
    $.ajax({
        type: "GET",
        url: "http://hyeumine.com/forumDeleteReply.php",
        data: {
            id : deleteCode
        },
        success: (data) => {
            data = JSON.parse(data);
            console.log(data)
            document.getElementById(`re${code}`).remove();
            alert("Successfully deleted reply!");
        },
        error: function(xhr, status, error) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
};