// Importa el módulo 'fs' para manejar el sistema de archivos
const fs = require('fs').promises;
const path = require('path');

// Ruta del archivo JSON que actuará como nuestra "base de datos"
const dataPath = path.join(process.cwd(), 'data.json');

// Función auxiliar para leer los datos del archivo
const readData = async () => {
    try {
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // Si el archivo no existe, lo creamos con un array vacío.
        if (error.code === 'ENOENT') {
            await fs.writeFile(dataPath, JSON.stringify([], null, 2));
            return [];
        }
        throw error;
    }
};

// Función auxiliar para escribir los datos en el archivo
const writeData = async (data) => {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};

module.exports = async (req, res) => {
    try {
        let items = await readData();

        // Manejador para el método GET
        if (req.method === 'GET') {
            // Devuelve todos los ítems
            return res.status(200).json(items);
        }

        // Manejador para el método POST (Crear)
        if (req.method === 'POST') {
            const newItem = req.body;
            if (!newItem.title) {
                return res.status(400).json({ error: 'El título del ítem es obligatorio.' });
            }
            // Asigna un ID simple (en una base de datos real, esto sería automático)
            newItem.id = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
            items.push(newItem);
            await writeData(items);
            return res.status(201).json({ message: 'Ítem creado', item: newItem });
        }

        // Manejador para el método PUT (Actualizar)
        if (req.method === 'PUT') {
            const updatedItem = req.body;
            if (!updatedItem.id) {
                return res.status(400).json({ error: 'El ID del ítem es obligatorio para actualizar.' });
            }
            const itemIndex = items.findIndex(i => i.id === updatedItem.id);
            if (itemIndex === -1) {
                return res.status(404).json({ error: 'Ítem no encontrado.' });
            }
            items[itemIndex] = { ...items[itemIndex], ...updatedItem };
            await writeData(items);
            return res.status(200).json({ message: 'Ítem actualizado', item: items[itemIndex] });
        }

        // Manejador para el método DELETE (Eliminar)
        if (req.method === 'DELETE') {
            const { id } = req.body;
            if (!id) {
                return res.status(400).json({ error: 'El ID del ítem es obligatorio para eliminar.' });
            }
            const initialLength = items.length;
            items = items.filter(i => i.id !== id);
            if (items.length === initialLength) {
                return res.status(404).json({ error: 'Ítem no encontrado.' });
            }
            await writeData(items);
            return res.status(200).json({ message: 'Ítem eliminado.' });
        }

        // Si el método no es reconocido, envía un error
        res.status(405).json({ error: 'Método no permitido.' });

    } catch (error) {
        console.error('Error en la API:', error);
        res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
    }
};