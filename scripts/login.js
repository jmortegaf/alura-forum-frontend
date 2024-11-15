const githubBaseURL="https://jmortegaf.github.io/alura-forum-frontend/"

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const userName = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('https://artemis2.ddns.net:8080', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });
            if (!response.ok) {
                const errorData = await response.json();
            } else {
                const data = await response.json();
                const token=data.token;
                sessionStorage.setItem('jwt_token',token)
                window.location.href = `../index.html`;
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    });
});
