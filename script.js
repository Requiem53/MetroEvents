let currPage = 1;
let posts = [];
let userID
let loginStatus

$(document).ready(function(){
    loginStatus = localStorage.getItem("loggedIn");
    
    if(loginStatus == "true"){
        const currUser = JSON.parse(localStorage.getItem("currUser"))
        userID = currUser.id
        console.log(userID)
        currPage = localStorage.getItem("currPage")
        // lastPage();
        getPost(currPage);
        showPosts(posts);
        $("#loginFront").hide()
        $("#registerFront").hide()
        $("#inProgress").show()
    }else{
        $("#loginFront").hide()
        $("#registerFront").show()
        $("#inProgress").hide()
    }

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

    $("#prevPage").click(function(){
        if(currPage > 1){
            getPost(currPage-1);
            if(posts.length > 0){
                document.querySelectorAll('.wholePost').forEach(e => e.remove());
                showPosts(posts);
                currPage--;
            }
        }
        document.getElementById("currPage").innerHTML = `Current Page: ${currPage}`
    })

    $("#nextPage").click(function(){
        getPost(currPage+1);
            if(posts.length > 0){
                document.querySelectorAll('.wholePost').forEach(e => e.remove());
                showPosts(posts);
                currPage++;
            }
        document.getElementById("currPage").innerHTML = `Current Page: ${currPage}`
    })

    $("#createUser").click(function(){
        const rFirstName = $("#rFirstName").val();
        const rLastName = $("#rLastName").val();
        const rUserName = $("#rUserName").val();

        $.ajax({
            type: "POST",
            url: "http://hyeumine.com/forumCreateUser.php",
            data: {
                firstName : rFirstName,
                lastName : rLastName,
                username : rUserName
            },
            success: (data) => {
                data = JSON.parse(data);
                console.log(data)
                userID = data.id
                localStorage.setItem("currUser", JSON.stringify(data));
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("currPage", currPage);
                // lastPage();
                getPost(currPage);
                $("#registerFront").hide()
                $("#inProgress").show()
                showPosts(posts);
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
            url: "http://hyeumine.com/forumLogin.php",
            data: {
                username : lUserName
            },
            success: (data) => {
                data = JSON.parse(data);
                console.log(data)
                if(data.success == false){
                    alert("Error: User may not exist. Register instead");
                }else{
                    userID = data.user.id
                    localStorage.setItem("currUser", JSON.stringify(data));
                    localStorage.setItem("loggedIn", "true");
                    localStorage.setItem("currPage", currPage);
                    console.log(userID)
                    // lastPage();
                    getPost(currPage);
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

function getPost(page){
    $.ajax({
        type: "GET",
        async: false,
        url: `http://hyeumine.com/forumGetPosts.php?page=${page}`,
        success: (data) => {
            posts = JSON.parse(data)
            console.log(posts)
        },
        error: function(xhr, status, error) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });
}

function showPosts(posts){
    $("#posts").html("");
    posts.forEach((post) => {
        $("#posts").append(`
            <div class="wholePost" id="wh${post.id}">
                <div class="poster">${post.user} posted: <div class="posterCode">User Code: ${post.uid}</div></div>
                <div class="indivPost">
                    <div class="postItself">${post.post}</div>
                </div>
                <div class="date">${post.date} <div class="posterCode">Post Code: ${post.id}</div></div>
                <input class="inputter" type="text" id="pr${post.id}" val="" placeholder="Enter reply">
                <button class="replyer" type="button" onclick="replyPost(${post.id})">Reply to Post</button>
                <button class="deleter" type="button" onclick="deletePost(${post.id})">Delete Post</button>
                <div class="replies" id=${post.id}></div>
            </div> 
        `);

        if(post.reply != undefined){
            let replies = post.reply;

            replies.forEach((reply) => {
                $(`#${post.id}`).append(`
                    <div class="wholeReply" id="re${reply.id}">
                        <div class="poster">${reply.user} replied: <div class="posterCode">User Code: ${post.uid}</div></div>
                        <div class="indivPost">
                            <div class="replyItself">${reply.reply}</div>
                        </div>
                        <div class="date">${reply.date} <div class="posterCode">Reply Code: ${reply.id}</div></div>
                        <button class="deleter" type="button" onclick="deleteReply(${reply.id})">Delete Reply</button>
                    </div>
                `)
            });
        }
        
    });
}