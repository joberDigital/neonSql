
// Importa la librería oficial de base de datos de Replit.
// Asegúrate de instalarla en tu proyecto con "npm install @replit/database".
const Database = require("@replit/database");
const db = new Database();

// Esta es tu función principal de la API
module.exports = async (req, res) => {
  try {
    // Obtenemos todos los ítems de la base de datos.
    const items = await db.get("items") || [];

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
      // Guardamos el nuevo arreglo de ítems en la base de datos
      await db.set("items", items);
      return res.status(201).json({ message: 'Ítem creado.', item: newItem });
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
      // Guardamos el arreglo actualizado en la base de datos
      await db.set("items", items);
      return res.status(200).json({ message: 'Ítem actualizado.', item: items[itemIndex] });
    }

    // Manejador para el método DELETE (Eliminar)
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'El ID del ítem es obligatorio para eliminar.' });
      }
      const initialLength = items.length;
      const filteredItems = items.filter(i => i.id !== id);
      if (filteredItems.length === initialLength) {
        return res.status(404).json({ error: 'Ítem no encontrado.' });
      }
      // Guardamos el nuevo arreglo sin el ítem eliminado
      await db.set("items", filteredItems);
      return res.status(200).json({ message: 'Ítem eliminado.' });
    }

    // Si el método no es reconocido, envía un error
    res.status(405).json({ error: 'Método no permitido.' });

  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
  }
};
