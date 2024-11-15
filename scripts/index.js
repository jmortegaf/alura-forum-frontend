
const newThreadMessage=document.getElementById('thread-message');
newThreadMessage.addEventListener('input',function(){
    this.style.height='auto';
    this.style.height=(this.scrollHeight)+'px';
});

document.getElementById('toggle-btn').addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-btn');
    
    sidebar.classList.toggle('active');
  
    if (sidebar.classList.contains('active')) {
        toggleButton.classList.add('active-toggle');
    } else {
        toggleButton.classList.remove('active-toggle');
    }

    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-btn');
    

    if (sidebar.classList.contains('active') && !sidebar.contains(event.target) && !toggleButton.contains(event.target)) {
        sidebar.classList.remove('active');
        toggleButton.classList.remove('active-toggle');
    }
});

loadPage();