const { Router } = require('express');
const {authRouter}=require('./controlers')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/auth', authRouter)

module.exports = router;
