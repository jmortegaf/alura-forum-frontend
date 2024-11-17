const baseURL = 'https://localhost:8080';

document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const warning = document.getElementById('register-warning');

    // Validate passwords match
    if (password !== confirmPassword) {
        warning.textContent = 'Passwords do not match';
        warning.classList.add('show');
        setTimeout(() => (warning.classList.remove('show') = 'none'), 1000);
    }
    else{
    try {
        const response = await fetch(`${baseURL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userName:username, email:email, password:password }),
        });

        if (response.ok) {
            alert('Registration successful! Redirecting to login.');
            window.location.href = 'login.html';
        } else {
            const errorData = await response.json();
            warning.textContent = errorData.message || 'Registration failed';
            warning.classList.add('show');
            setTimeout(() => (warning.classList.remove('show')), 1200);
        }
    } catch (error) {
        console.error('Error:', error);
        warning.textContent = 'An error occurred. Please try again.';
        warning.classList.add('show');
        setTimeout(() => (warning.classList.remove('show')), 1200);
    }
    }
});
