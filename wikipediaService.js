// wikipediaService.js

// 1. Conexión a la base de datos de Neon
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // O NEON_DATABASE_URL
  ssl: {
    rejectUnauthorized: false
  }
});

// El resto de tu código
// Por ejemplo, tu función para guardar datos ahora usaría esta conexión:
async function saveArticleToNeon({ title, summary, pageUrl }) {
  try {
    await pool.query(
      `INSERT INTO articles (title, summary, page_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (title) DO UPDATE SET
       summary = EXCLUDED.summary,
       page_url = EXCLUDED.page_url;`,
      [title, summary, pageUrl]
    );
    console.log(`Artículo "${title}" guardado/actualizado en la base de datos.`);
  } catch (error) {
    console.error('Error al guardar el artículo en Neon:', error);
    throw error;
  }
}

// 2. Exporta las funciones que tu server.js necesita
module.exports = {
  getArticleSummary,
  saveArticleToNeon,
};// wikipediaService.js

// ... (imports como axios y neon)
//const { neon } = require('@neondatabase/serverless');
//const sql = neon(process.env.DATABASE_URL); // Conexión a Neon

import { Pool } from 'pg';

const sql = new Pool({
  connectionString: process.env.DATABASE_URL, // <-- Aquí debe estar el nombre de tu variable
});


// Función para obtener el resumen (código existente)
async function getArticleSummary(pageTitle) {
    // ... (código existente para la llamada a la API de Wikipedia)
}

// Nueva función para guardar los datos en la tabla `articles` de Neon
async function saveArticleToNeon({ title, summary, pageUrl }) {
    try {
        await sql`
            INSERT INTO articles (title, summary, page_url)
            VALUES (${title}, ${summary}, ${pageUrl})
            ON CONFLICT (title) DO UPDATE SET
            summary = EXCLUDED.summary,
            page_url = EXCLUDED.page_url,
            created_at = CURRENT_TIMESTAMP;
        `;
        console.log(`Artículo "${title}" guardado/actualizado en la base de datos de Neon.`);
    } catch (error) {
        console.error('Error al guardar el artículo en Neon:', error);
        throw error;
    }
}

// ... (otras funciones como loadAllLinks, loadLastArticle, etc., que ahora usarían Neon)

export  {
    getArticleSummary,
    saveArticleToNeon,
    // ... (otras funciones)
};

