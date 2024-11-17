const baseURL = 'https://localhost:8080';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userName = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${baseURL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                if(response.status===401){
                    const warning=document.getElementById('login-warning');
                    warning.classList.add('show');
                    warning.textContent='Username or password error';
                    setTimeout(() => {
                        warning.classList.remove('show');
                    }, 1000);                }
            } else {
                const data = await response.json();
                const token=data.token;
                sessionStorage.setItem('jwt_token',token);
                sessionStorage.setItem('user_name',userName);
                window.location.href = 'index.html';
            }
        } catch (error) {
            console.error('Error during login:', error);
            const warning=document.getElementById('login-warning');
            warning.classList.add('show');
            warning.textContent='An error ocurred. Please try again.';
            setTimeout(() => {
                warning.classList.remove('show');
            }, 1000);
        }
    });
});
const username=document.getElementById('username');
const password=document.getElementById('password');
username.oninvalid=showInvalidWarning(username);
username.oninvalid=showInvalidWarning(password);
username.oninput=clearInvalidWarning(username);
username.oninput=clearInvalidWarning(password);

function showInvalidWarning(input){
    input.setCustomValidity("This field cannot be empty.");
}
function clearInvalidWarning(input){
    input.setCustomValidity("");
}

function anonymousLogin(){
    fetch(`${baseURL}/login`, {
        method: 'GET'},)
    .then(response=>{
        if (response.ok) {
            if(response.status===200){
                response.json()
                .then(data=>{
                    sessionStorage.setItem('jwt_token',data.token);
                    sessionStorage.setItem('user_name',"Guest");
                    window.location.href = 'index.html';
                });
            }
        }   
    })
    .catch(error=>{
        console.error('Error during login:', error);
    });
}