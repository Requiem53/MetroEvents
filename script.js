let currPage = 1;
let posts = [];
let userID
let currUser
let loginStatus

$(document).ready(function(){
    loginStatus = localStorage.getItem("loggedIn");
    
    if(loginStatus == "true"){
        currUser = JSON.parse(localStorage.getItem("currUser"))
        userID = currUser.uid

        $("#loginFront").hide()
        $("#registerFront").hide()
        $("#mainScene").show()

        showPosts()
    }else{
        $("#loginFront").show()
        $("#registerFront").hide()
        $("#mainScene").hide()
    }

    $("#createPostArea").hide()

    $("#logout").click(function(){
        localStorage.clear();
        $("#loginFront").show()
        $("#registerFront").hide()
        $("#mainScene").hide()
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
                    loginProcess(data)
                    $("#registerFront").hide()
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
                    loginProcess(data)
                    $("#loginFront").hide();
                }
            },
            error: function(xhr, status, error) {
                var err = eval("An error has occured" + "(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });

    $("#newPost").click(function(){
        const eventTitle = $("#eventTitleInfo").val();
        const eventDetails = $("#eventDetailsInfo").val();
        const eventDate = $("#eventDateInfo").val();
        const user = currUser


        console.log(user)
        $.ajax({
            type: "POST",
            url: "https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/createPost.php",
            data: {
                eventname : eventTitle,
                eventdetails: eventDetails,
                eventdate : eventDate,
                eventorganizer : user
            },
            success: (data) => {
                if(data.success == true){
                    data = JSON.stringify(data);
                    data = JSON.parse(data);
                    console.log(data);
                    alert("Successfully posted! Refresh page to see post.");
                }else{
                    console.log(data)
                }
            },    
            error: function(xhr, status, error) {
                var err = eval("An error has occured" + "(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    });

    $("#showCreatePostArea").click(function(){
        $("#createPostArea").toggle()
    });
});
function loginProcess(data){
    data = JSON.stringify(data);
    data = JSON.parse(data);
    console.log(data) 
    currUser = data.user
    userID = data.user.uid
    localStorage.setItem("currUser", JSON.stringify(data.user));
    localStorage.setItem("loggedIn", "true");
    alert("Welcome to Metro Events!")
    showRoleSpecific(data.user.role)
    showPosts();
    $("#mainScene").show()
}


function showPosts(){
    let posts

    $.ajax({
        type: "GET",
        async: false,
        url: `https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/getPosts.php`,
        success: (data) => {
            data = JSON.stringify(data)
            data = JSON.parse(data)
            console.log(data)
            posts = data
        },
        error: function(xhr) {
            var err = eval("An error has occured" + "(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });

    $("#posts").html("");
    posts.forEach((post) => {
        $("#posts").prepend(`
        <div class="wholePost" id="wh${post.postid}">
            <div class="eventTitle">${post.eventname}</div>
            <div class="eventInformation">
                <div class="eventDetails">${post.eventdetails}</div>
                <div class="eventAuxi">
                    <div class="eventOrganizer">Event Organizer: ${post.eventorganizer.firstname} ${post.eventorganizer.lastname}</div>
                    <div class="eventDate">Event Date: ${post.eventdate}</div>
                    <div class="postDate">Posted in: ${post.postdate}</div>
                </div>
            </div>
            <div class="activityZone">
                <div class="upvoteArea">
                    <button class="upvoteButton" type="button" onclick="upvotePost(${post.postid}, ${post.postvote})">Upvote</button>
                    <div class="upvotes" id="upvotes${post.postid}">Upvotes: ${Object.keys(post.postvote).length}</div>
                </div>
                <div class="participantArea">
                    <button class="participateButton" type="button" onclick="participatePost(${post.postid})">Participate</button>
                    <div class="participants" id="participatePost${post.postid}">Participants: ${Object.keys(post.participants).length}</div>
                </div>
            </div>

            <div class="sendReviewArea">
                <button type="button" id="newReview">Send a review</button>
                <input type="text" id="newReviewText" val="" placeholder="Type your review here....">
            </div>

            <div class="reviewsArea">
            </div>
        </div>
        `);
    });
}
function participatePost(post){
    $.get("https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/upvotePost.php",
    {
        postid : post.postid,
        userid : userID
    },
    function(data){
        if(data.success == true){
            alert("Successfully participated to event! Refresh page to see")
            console.log(data)
        }else{
            alert(data.message)
            console.log(data)
        }
    }
);
}

function upvotePost(post, numOfUpvotes){

    $.get("https://hyeumine.com/DL0wgqiJ/Luab/MetroEvents/scripts/upvotePost.php",
        {
            postid : post,
            userid : userID
        },
        function(data){
            if(data.success == true){
                alert(data.message)
                var upvoteID = "upvotes" + post

                if(data.message === "Removed upvote"){
                    document.getElementById(upvoteID).innerHTML = "Upvotes: " + Object.keys(numOfUpvotes).length
                }
                  
            }else{
                alert(data.message)
            }
        }
    );
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

function showRoleSpecific(role){
    if (role === "organizer" || role === "admin"){
        $("#showCreatePostArea").show()
    }else{
        $("#showCreatePostArea").hide()
    }

}