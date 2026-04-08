// entr backend
const { PORT } = require("./src/config");
const { createApp } = require("./src/app");
const express = require('express');

let app;

// En Vercel, necesitamos exportar una función que inicialice todo por request
if (process.env.VERCEL) {
    module.exports = async (req, res) => {
        const myApp = createApp();
        return myApp(req, res);
    };
} else {
    // Localmente, levantamos el servidor escuchando en el puerto
    app = express();
    
    const myApp = createApp();
    app.use(myApp);
    
    if (process.env.NODE_ENV !== 'production') {
        app.listen(PORT, () => {
            console.log(`🚀 Servidor local en http://localhost:${PORT}`);
        });
    }

    module.exports = app;
}
