document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos (pueden ser null dependiendo de la página) ---
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const messageDiv = document.getElementById('message'); // Para mensajes en index.html
    const welcomeElement = document.getElementById('welcomeMessage'); // Para mensaje en dashboard.html

    // --- Función para mostrar mensajes (principalmente en index.html) ---
    const showMessage = (text, type) => {
        if (messageDiv) {
            messageDiv.textContent = text;
            // Asigna clases para estilizar (ej. 'message success' o 'message error')
            // Asegúrate de tener una clase base 'message' si quieres estilos comunes.
            messageDiv.className = `message ${type}`;
        } else {
            // Si messageDiv no existe (ej. en dashboard), muestra en consola
            console.log(`Mensaje (${type}):`, text);
        }
    };

    // --- Lógica de Registro (CON FETCH CORREGIDO) ---
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita el envío tradicional del formulario
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;

            // Validaciones básicas (opcional pero recomendado)
            if (!username || !password) {
                showMessage('Nombre de usuario y contraseña son requeridos.', 'error');
                return;
            }

            showMessage('Registrando...', 'info'); // Mensaje provisional

            try {
                const response = await fetch('/api/register', {
                    method: 'POST', // <- ¡ESENCIAL!
                    headers: {      // <- ¡ESENCIAL!
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password }) // <- ¡ESENCIAL!
                });

                // Intenta parsear la respuesta como JSON SIEMPRE,
                // incluso si hay error, para obtener el mensaje del servidor si lo envía.
                let data = {};
                try {
                    data = await response.json();
                } catch (jsonError) {
                    // Si falla el parseo de JSON (ej. respuesta HTML de error 500)
                    console.error("Error al parsear JSON de respuesta:", jsonError);
                    // Usa el texto de la respuesta si está disponible, o un mensaje genérico
                    const responseText = await response.text(); // Intenta obtener texto plano
                    data.message = responseText || `Error HTTP ${response.status}`;
                }


                if (response.ok) { // Estado HTTP 200-299
                    // El servidor respondió OK, ahora verificamos el 'success' interno
                    if (data.success) {
                         showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.', 'success');
                         registerForm.reset(); // Limpia el formulario
                    } else {
                         // El servidor respondió OK pero indicó un fallo (ej: usuario ya existe)
                         showMessage(`Error: ${data.message || 'Error desconocido en registro.'}`, 'error');
                    }
                } else {
                    // El servidor respondió con un error HTTP (4xx, 5xx)
                     showMessage(`Error: ${data.message || `Error del servidor (${response.status})`}`, 'error');
                }

            } catch (networkError) {
                // Error de red (no se pudo conectar, etc.)
                console.error('Error de red en registro:', networkError);
                showMessage('Error de conexión al registrar. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Lógica de Login (CON sessionStorage) ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) {
                showMessage('Nombre de usuario y contraseña son requeridos.', 'error');
                return;
            }

            showMessage('Iniciando sesión...', 'info');

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                let data = {};
                 try {
                    data = await response.json();
                } catch (jsonError) {
                    console.error("Error al parsear JSON de respuesta (login):", jsonError);
                    const responseText = await response.text();
                    data.message = responseText || `Error HTTP ${response.status}`;
                }


                if (response.ok && data.success) {
                    // Guarda el username en sessionStorage ANTES de redirigir
                    sessionStorage.setItem('loggedInUser', username);

                    showMessage('Inicio de sesión correcto. Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = '/dashboard.html'; // Redirige al dashboard
                    }, 1000); // Pequeña pausa para ver el mensaje
                } else {
                    // Login fallido (usuario/pass incorrecto - 401) u otro error
                    showMessage(`Error: ${data.message || `Credenciales incorrectas o error del servidor (${response.status})`}`, 'error');
                }
            } catch (networkError) {
                console.error('Error de red en login:', networkError);
                showMessage('Error de conexión al iniciar sesión. Intenta de nuevo.', 'error');
            }
        });
    }

    // --- Lógica de Dashboard (Leer de sessionStorage) ---
    if (welcomeElement) { // Este código solo se ejecuta si estamos en dashboard.html
        const loggedInUsername = sessionStorage.getItem('loggedInUser');

        if (loggedInUsername) {
            // Si encontramos un usuario en sessionStorage, mostramos el saludo
            welcomeElement.textContent = `Bienvenido, ${loggedInUsername}!`;
        } else {
            // Si no hay usuario (ej: acceso directo a dashboard.html), mostramos genérico
            // En una app real, aquí deberíamos redirigir a la página de login
            welcomeElement.textContent = 'Bienvenido!';
            console.warn("No se encontró usuario en sessionStorage. Acceso no autenticado.");
            // Opcional: Redirigir forzosamente a login si no hay sesión
            // alert("Debes iniciar sesión para acceder a esta página.");
            // window.location.href = '/';
        }
    }

    // --- Lógica de Logout (Limpiar sessionStorage) ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Limpia el nombre de usuario de sessionStorage
            sessionStorage.removeItem('loggedInUser');

            // (Opcional) Podrías hacer una llamada a una API de /api/logout en el backend si tuvieras sesiones del lado del servidor

            alert('Cerrando sesión...'); // Notificación simple
            window.location.href = '/'; // Redirige a la página principal (index.html)
        });
    }
});