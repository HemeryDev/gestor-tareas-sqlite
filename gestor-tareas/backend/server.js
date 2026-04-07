// entr backend
const { PORT, DB_JSON_PATH } = require("./src/config");
const { ensureDbFile } = require("./src/db/jsonDb");
const { createApp } = require("./src/app");

const express = require('express');

let app;

// En Vercel, necesitamos exportar una función que inicialice todo por request
if (process.env.VERCEL) {
    module.exports = async (req, res) => {
        await ensureDbFile(DB_JSON_PATH);
        const myApp = createApp({ dbPath: DB_JSON_PATH });
        return myApp(req, res);
    };
} else {
    // Localmente, levantamos el servidor escuchando en el puerto
    app = express();
    
    // Inicializar db asíncronamente y luego iniciar app
    ensureDbFile(DB_JSON_PATH).then(() => {
        const myApp = createApp({ dbPath: DB_JSON_PATH });
        app.use(myApp);
        
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`🚀 Servidor local en http://localhost:${PORT}`);
            });
        }
    }).catch(err => {
        console.error("Error inicializando DB:", err);
    });

    module.exports = app;
}
