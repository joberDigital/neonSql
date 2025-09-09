// server.js
//Manejará las rutas y las peticiones a la API de Wikipedia
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

const wikipediaService = require('./wikipediaService');

app.post('/api/pagina/crear', async (req, res) => {
    const { pageTitle } = req.body;

    if (!pageTitle) {
        return res.status(400).json({ error: 'El título de la página es requerido.' });
    }

    try {
        const data = await wikipediaService.getArticleSummary(pageTitle);

        // Llama a una nueva función en el servicio que gestiona el almacenamiento en Neon.
        // `pageUrl` se crea a partir del `pageTitle` antes de guardar.
        const cleanPageTitle = pageTitle.replace(/[^a-zA-Z0-9_]/g, '');
        const pageUrl = `/paginas/${cleanPageTitle}.html`;

        await wikipediaService.saveArticleToNeon({
            title: data.title,
            summary: data.extract,
            pageUrl: pageUrl
        });

        res.status(200).json({
            message: 'Artículo guardado en Neon.',
            title: data.title,
            summary: data.extract,
            pageUrl: pageUrl
        });
    } catch (error) {
        console.error('Error en la ruta POST /api/pagina/crear:', error);
        res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
    }
});
