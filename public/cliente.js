// public/cliente.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (otras variables y elementos)
    const saveButton = document.getElementById('save-button');
    const inputElement = document.getElementById('wikipedia-link-input');
    
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const pageTitle = inputElement.value.trim(); // <-- Aquí capturas el valor
            
            // Si no hay valor, avisa al usuario
            if (!pageTitle) {
                // ... (lógica para mostrar un mensaje de error)
                return;
            }
            
            // Envías 'pageTitle' al servidor usando una petición POST
            try {
                const response = await fetch('/api/pagina/crear', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pageTitle }) // <-- Envías el valor en el cuerpo de la petición
                });
                
                // ... (lógica para manejar la respuesta del servidor)
            } catch (error) {
                // ... (lógica para manejar errores)
            }
        });
    }
});