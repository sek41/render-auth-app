const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Base de datos EN MEMORIA - Ahora guarda { username, password } ---
const users = []; // Ejemplo: { username: 'pepe', password: '123' }

// --- Rutas API ---

// Ruta para Registro (Modificada para username)
app.post('/api/register', (req, res) => {
    // Recibe username en lugar de email
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Nombre de usuario y contraseña son requeridos' });
    }

    // Verifica si el username ya existe
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'El nombre de usuario ya está registrado' });
    }

    // Guarda el nuevo usuario con username
    const newUser = { username, password }; // ¡SIN HASHEAR CONTRASEÑA - INSEGURO!
    users.push(newUser);
    console.log('Usuario registrado:', newUser.username);
    console.log('Usuarios actuales:', users);

    res.status(201).json({ success: true });
});

// Ruta para Login (Modificada para username)
app.post('/api/login', (req, res) => {
    // Recibe username en lugar de email
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Nombre de usuario y contraseña son requeridos' });
    }

    // Busca al usuario por username y verifica la contraseña (¡INSEGURO!)
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        console.log('Login exitoso para:', user.username);
        res.json({ success: true });
    } else {
        console.log('Intento de login fallido para:', username);
        res.status(401).json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
    }
});

// --- Rutas para servir HTML (Sin cambios) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/dashboard.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// --- Iniciar el Servidor (Sin cambios) ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});