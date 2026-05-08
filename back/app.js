'use strict';

require('dotenv').config({ path: __dirname + '/.env' });

console.log("URI:", process.env.MONGO_URI);

const cors        = require('cors');
const express     = require('express');
const bodyParser  = require('body-parser');
const mongoose    = require('mongoose');
const http        = require('http');

// ── Rutas ──────────────────────────────────────────────
const clienteRoute   = require('./routes/cliente');
const adminRoute     = require('./routes/admin');
const productoRoute  = require('./routes/producto');
const cuponRoute     = require('./routes/cupon');
const configRoute    = require('./routes/config');
const carritoRoute   = require('./routes/carrito');
const ventaRoute     = require('./routes/venta');
const descuentoRoute = require('./routes/descuento');

const app    = express();
const port   = process.env.PORT || 3000;
const server = http.createServer(app);

// ── Socket.io ──────────────────────────────────────────
const io = require('socket.io')(server, {
    cors: { origin: '*' },
});

io.on('connection', function (socket) {
    socket.on('delete-carrito', function (data) {
        io.emit('new-carrito', data);
    });
    socket.on('add-carrito-add', function (data) {
        io.emit('new-carrito-add', data);
    });
});

// ── CORS ───────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_ADMIN  || 'http://localhost:4200',
    process.env.FRONTEND_TIENDA || 'http://localhost:4201',
    'https://ecommercesoreusadmin.netlify.app',
    'https://ecommercesoreustienda.netlify.app',
];

app.use(cors({
    origin      : allowedOrigins,
    methods     : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type', 'X-API-KEY', 'Origin', 'X-Requested-With'],
    credentials : true,
}));

// ── Body Parser ────────────────────────────────────────
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// ── Rutas API ──────────────────────────────────────────
app.use('/api', clienteRoute);
app.use('/api', adminRoute);
app.use('/api', productoRoute);
app.use('/api', cuponRoute);
app.use('/api', configRoute);
app.use('/api', carritoRoute);
app.use('/api', ventaRoute);
app.use('/api', descuentoRoute);

// ── Inicio del servidor ────────────────────────────────
async function startServer() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser   : true,
        });
        console.log('✅ Conectado a MongoDB');

        server.listen(port, () => {
            console.log(`🚀 Servidor MONTERO'S corriendo en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
