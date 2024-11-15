
const baseURL = 'http://artemis2.ddns.net:8080';
const githubBaseURL="https://jmortegaf.github.io/alura-forum-frontend/"

function getData(endpoint,token) {
    return fetch(`${baseURL}${endpoint}`,{
        method:'GET',
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'aplication/json',    
        },
    })
        .then(response => response.json())
        .catch(error => {
            console.error(error);
        });
}

function sendData(request_method,endpoint,token,data) {
    const response = fetch(`${baseURL}${endpoint}`, {
        method:request_method,
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type':'application/json',    
        },
        body: data,
    })
    .then(response => {
        if(response.status==200){
            console.log(response.json.id)
        }
    })
    .catch(error => {
        console.error(error);
    });
    return response;
}

function formatDateTime(localdatetime){
    let options={
        year:"numeric",
        month:"short",
        day:"numeric",
        hour:"2-digit",
        minute:"2-digit",
        hour12:false
    };
    let date=new Date(localdatetime);
    return date.toLocaleString('en-US',options);
}

function getValidToken(){
    const token=sessionStorage.getItem('jwt_token');
    // check if token is valid
    if(token==null)window.location.href = '/alura-forum-frontend/login.html';
    else return token
}
function showThreadContent(state){
    if(!state)
        document.getElementById("thread-details").style.display="none";
    else
        document.getElementById("thread-details").style.display="";
}
function showThreadsContent(state){
    if(!state){
        document.getElementById('threads').style.display="none";
        document.getElementById('new-thread-menu').style.display="none";
    }
    else{
        document.getElementById('threads').style.display="";
        document.getElementById('new-thread-menu').style.display="";    
    }
}

function loadPage(){
    document.getElementById("main-header").hidden=false;
    document.getElementById("main-container").hidden=false;
    document.getElementById("main-footer").hidden=false;
    renderThreads();
}

function renderThreads(){
    const token=getValidToken();
    getData("/threads?sort=creationDate,desc",token)
    .then(response => {
        showThreadContent(false);
        const threads=response.content;
        const threadsListContainer=document.getElementById('threads');
        threadsListContainer.innerHTML="";

        threads.forEach(thread => {
            const threadElement=document.createElement('div');
            threadElement.classList.add('thread');
            threadElement.dataset.id=thread.id;
    
            threadElement.innerHTML=`
            <div class="thread-title">${thread.title}</div>
            <div class="thread-preview">${thread.messageFragment}</div>
            <div class="thread-status">Status: ${thread.status}</div>
            <div class="thread-footer">
                <span>Created by ${thread.author} on ${formatDateTime(thread.creationDate)}
                <button class="replies-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                        <path d="M5.25,18 C3.45507456,18 2,16.5449254 2,14.75 L2,6.25 C2,4.45507456 3.45507456,3 
                        5.25,3 L18.75,3 C20.5449254,3 22,4.45507456 22,6.25 L22,14.75 C22,16.5449254 20.5449254,18 
                        18.75,18 L13.0124851,18 L7.99868152,21.7506795 C7.44585139,22.1641649 6.66249789,22.0512036 
                        6.2490125,21.4983735 C6.08735764,21.2822409 6,21.0195912 6,20.7499063 L5.99921427,18 L5.25,18 
                        Z M12.5135149,16.5 L18.75,16.5 C19.7164983,16.5 20.5,15.7164983 20.5,14.75 L20.5,6.25 
                        C20.5,5.28350169 19.7164983,4.5 18.75,4.5 L5.25,4.5 C4.28350169,4.5 3.5,5.28350169 
                        3.5,6.25 L3.5,14.75 C3.5,15.7164983 4.28350169,16.5 5.25,16.5 L7.49878573,16.5 
                        L7.49899997,17.2497857 L7.49985739,20.2505702 L12.5135149,16.5 Z" id="🎨-Color">
                        </path>
                    </svg>
                    ${thread.replyCount}
                </button>
            </div>
            `;
            threadElement.addEventListener('click',function(){
                renderThread(thread.id);
            })
            threadsListContainer.appendChild(threadElement);
        });    
    })
}

function createNewThread(){
    const threadTitle=document.getElementById("thread-title").value;
    const threadMessage=document.getElementById("thread-message").value;
    const token=getValidToken();
    sendData('POST',
        `/threads`,
        token,
        JSON.stringify({title:threadTitle, message:threadMessage})
    );
}

function renderThread(threadId){
    const token=getValidToken();
    showThreadsContent(false);
    showThreadContent(true)
    getData("/threads/"+threadId,token)
    .then(thread => {
        const threadContainer=document.getElementById('thread-card');
        threadContainer.style.display="";
        threadContainer.innerHTML=`
        <div class="thread-status">Status: ${thread.status}</div>
        <h1 id="thread-title">${thread.title}</h1>
        <p id="thread-content">${thread.message}</div>
        <div class="thread-meta">
            <span>Posted by: ${thread.author}</span>
            <span>${formatDateTime(thread.creationDate)}</span>
        </div>
        `;
        if(thread.status==="ACTIVE"){
            threadContainer.innerHTML+=`
            <button class="new-reply-btn" onclick="showReplyMenu(${thread.id},0);" id="show-thread-reply-menu">Reply
            `;
        }

        const repliesListContainer=document.getElementById('replies-list-card');

        const replies=document.createElement('div');
        replies.classList.add("replies-list");
        thread.replies.content.forEach(reply => {
            const replyElement=document.createElement('div');
            replyElement.classList.add('reply-card');
            replyElement.id="reply-"+reply.id;

            replyElement.innerHTML=`
            <p>${reply.message}</p>
            <div class="reply-meta">
                <span>Posted by: ${reply.author}</span>
                <span>${formatDateTime(reply.creationDate)}</span>
            </div> 
            `;
            if(reply.childReplies.length>0){
                const childRepliesContainer=document.createElement('div')
                childRepliesContainer.classList.add("child-replies-list")
                reply.childReplies.forEach(childReply => {
                    const childReplyElement=document.createElement('div');
                    childReplyElement.classList.add('child-reply-card');

                    childReplyElement.innerHTML=`
                    <p>${childReply.message}</p>
                    <div class="reply-meta">
                        <span>Posted by: ${childReply.author}</span>
                        <span>${formatDateTime(childReply.creationDate)}</span>
                    </div> 
                    `;
                    childRepliesContainer.appendChild(childReplyElement);
                });
                replyElement.appendChild(childRepliesContainer);
            }
            if(thread.status==="ACTIVE"){
                replyElement.innerHTML+=`
                <button class="new-reply-btn" onclick="showReplyMenu(${thread.id},${reply.id});" id="show-reply-menu-${reply.id}">Reply
                `;
            }

            repliesListContainer.appendChild(replyElement);
        });

    });
}

function createReplyMenu(threadId,replyId){
    const replyMenu=document.createElement('div');
    replyMenu.classList.add("reply-menu");
    const replyForm=document.createElement('form');
    replyForm.id="reply-to"
    if(replyId==0)
        replyForm.innerHTML=`
        <input type="text" id="thread-id" value=${threadId} hidden>
        <textarea id="reply-message" class="new-reply-message" autocomplete="off" rows="4" placeholder="Reply" required></textarea>
        <div class="new-reply-footer">
            <input type="button" class="new-reply-btn" value="Reply" onclick="replyToThread(${threadId});">
            <input type="button" class="new-reply-btn" value="Cancel" onclick="removeReplyMenu(${threadId},0)">
        </div>
    `;
    else
        replyForm.innerHTML=`
        <input type="text" id="reply-id" value=${replyId} hidden>
        <textarea class="new-reply-message" id="reply-message-${replyId}" autocomplete="off" rows="4" placeholder="Reply" required></textarea>
        <div class="new-reply-footer">
            <input type="button" class="new-reply-btn" value="Reply" onclick="replyToReply(${threadId},${replyId});">
            <input type="button" class="new-reply-btn" value="Cancel" onclick="removeReplyMenu(${threadId},${replyId})">
        </div>
        `;

    replyMenu.appendChild(replyForm);
    return replyMenu;
}

function showReplyMenu(threadId,replyId){
    if(replyId!=0){
        const replyMenu=createReplyMenu(threadId,replyId);
        replyMenu.id=`reply-menu-${replyId}`;
        const replyElement=document.getElementById("reply-"+replyId);
        replyElement.appendChild(replyMenu);
        replyElement.removeChild(document.getElementById("show-reply-menu-"+replyId));
    }
    else{
        const replyCard=document.createElement("div");
        replyCard.classList.add("add-reply-card");
        replyCard.id="add-thread-reply";

        const threadCard=document.getElementById("thread-card");

        const replyMenu=createReplyMenu(threadId,replyId);

        threadCard.removeChild(document.getElementById("show-thread-reply-menu"));
        replyCard.appendChild(replyMenu);
        threadCard.appendChild(replyCard);
    }
}

function removeReplyMenu(threadId,replyId){
    if(replyId!=0){
        const replyElement=document.getElementById(`reply-${replyId}`);
        replyElement.removeChild(document.getElementById(`reply-menu-${replyId}`));
        const replyBtn=document.createElement("button");
        replyBtn.onclick=function(){
            showReplyMenu(threadId,replyId);
        }
        replyBtn.classList.add("new-reply-btn");
        replyBtn.id=`show-reply-menu-${replyId}`;
        replyBtn.innerHTML="Reply";
        replyElement.appendChild(replyBtn);    
    }
    else{
        const threadCard=document.getElementById("thread-card");
        threadCard.removeChild(document.getElementById("add-thread-reply"));
        const replyBtn=document.createElement("button");
        replyBtn.onclick=function(){
            showReplyMenu(threadId,replyId);
        }
        replyBtn.classList.add("new-reply-btn");
        replyBtn.id=`show-thread-reply-menu`;
        replyBtn.innerHTML="Reply";
        threadCard.appendChild(replyBtn);    
    }
}

function replyToThread(threadId){
    const token=getValidToken();
    const message=document.getElementById("reply-message").value;
    sendData('POST',
        `/threads/${threadId}`,
        token,
        JSON.stringify({message:message}));

}

function replyToReply(threadId,replyId){
    const token=sessionStorage.getItem('jwt_token');
    const message=document.getElementById(`reply-message-${replyId}`).value;
    sendData('POST',
        `/threads/${threadId}/${replyId}`,
        token,
        JSON.stringify({message:message}));
}