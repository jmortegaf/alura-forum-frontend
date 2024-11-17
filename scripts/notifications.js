function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    
    const icon = document.createElement('span');
    icon.classList.add('icon');
    icon.textContent = type === 'success' ? '✔️' : '❌';
    
    const text = document.createElement('span');
    text.classList.add('text');
    text.textContent = message;
    
    notification.appendChild(icon);
    notification.appendChild(text);
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Example usage
// showNotification('Post created successfully!', 'success');
// showNotification('Failed to delete the reply.', 'error');
