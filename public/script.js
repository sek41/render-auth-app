document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const messageDiv = document.getElementById('message');

    const showMessage = (text, type) => {
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = type; // 'success' or 'error'
        }
    };

    // --- Lógica de Registro ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Obtener username en lugar de email
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            showMessage('Registrando...', 'info');

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviar username en lugar de email
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if (data.success) {
                    showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
                    registerForm.reset();
                } else {
                    showMessage(`Error: ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Error en registro:', error);
                showMessage('Error de conexión al registrar.', 'error');
            }
        });
    }

    // --- Lógica de Login ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            // Obtener username en lugar de email
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            showMessage('Iniciando sesión...', 'info');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    // Enviar username en lugar de email
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();

                if (data.success) {
                    showMessage('Inicio de sesión correcto. Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard.html';
                    }, 1000);
                } else {
                    showMessage(`Error: ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Error en login:', error);
                showMessage('Error de conexión al iniciar sesión.', 'error');
            }
        });
    }

    // --- Lógica de Logout (Sin cambios) ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            alert('Cerrando sesión...');
            window.location.href = '/';
        });
    }
});