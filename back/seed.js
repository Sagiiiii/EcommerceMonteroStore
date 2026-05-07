/**
 * ════════════════════════════════════════════════════════════════
 *  SEED DATA — Base de datos: tienda
 *  MONTERO'S · Panel Administrativo · JAIME PONCE MONTERO
 *
 *  INSTRUCCIONES DE USO:
 *  1. Asegúrate de tener MongoDB corriendo (local o Atlas)
 *  2. Instala dependencias si no las tienes:
 *       npm install mongoose bcryptjs
 *  3. Ejecuta el script:
 *       node seed.js
 *
 *  ⚠️  ADVERTENCIA: Este script ELIMINA todos los datos
 *  existentes en las colecciones antes de insertar.
 *  Úsalo solo en entorno de DESARROLLO.
 * ════════════════════════════════════════════════════════════════
 */

'use strict';

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// ── Conexión ──────────────────────────────────────────────────────
const MONGO_URI = 'mongodb://localhost:27017/tienda';

// ════════════════════════════════════════════════════════════════
//  SCHEMAS (inline para no depender de rutas del proyecto)
// ════════════════════════════════════════════════════════════════

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    nombres  : { type: String, required: true },
    apellidos: { type: String, required: true },
    email    : { type: String, required: true },
    password : { type: String, required: true },
    telefono : { type: String, required: true },
    rol      : { type: String, required: true },
    dni      : { type: String, required: true },
});

const CarritoSchema = new Schema({
    producto : { type: Schema.ObjectId, ref: 'producto', required: true },
    cliente  : { type: Schema.ObjectId, ref: 'cliente',  required: true },
    cantidad : { type: Number, required: true },
    variedad : { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ClienteSchema = new Schema({
    nombres      : { type: String, required: true },
    apellidos    : { type: String, required: true },
    pais         : { type: String },
    email        : { type: String, required: true },
    password     : { type: String, required: true },
    perfil       : { type: String, default: 'perfil.png' },
    telefono     : { type: String },
    genero       : { type: String },
    f_nacimiento : { type: String },
    dni          : { type: String },
    createdAt    : { type: Date, default: Date.now },
});

const ConfigSchema = new Schema({
    categorias  : [{ type: Object }],
    titulo      : { type: String, required: true },
    logo        : { type: String, required: true },
    serie       : { type: String, required: true },
    correlativo : { type: String, required: true },
});

const ContactoSchema = new Schema({
    cliente  : { type: String, required: true },
    mensaje  : { type: String, required: true },
    asunto   : { type: String, required: true },
    telefono : { type: String, required: true },
    correo   : { type: String, required: true },
    estado   : { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const CuponSchema = new Schema({
    codigo        : { type: String, required: true },
    tipo          : { type: String, required: true },
    valor         : { type: Number, required: true },
    limite        : { type: Number, required: true },
    disponibilidad: { type: Number },
    createdAt     : { type: Date, default: Date.now },
});

const DescuentoSchema = new Schema({
    titulo      : { type: String, required: true },
    banner      : { type: String, required: true },
    descuento   : { type: Number, required: true },
    fecha_inicio: { type: String, required: true },
    fecha_fin   : { type: String, required: true },
    createdAt   : { type: Date, default: Date.now },
});

const DireccionSchema = new Schema({
    cliente     : { type: Schema.ObjectId, ref: 'cliente' },
    destinatario: { type: String, required: true },
    dni         : { type: String, required: true },
    telefono    : { type: String, required: true },
    direccion   : { type: String, required: true },
    referencia  : { type: String },
    pais        : { type: String, required: true },
    region      : { type: String },
    provincia   : { type: String },
    distrito    : { type: String },
    zona        : { type: String },
    zip         : { type: String },
    status      : { type: Boolean, default: true },
    principal   : { type: Boolean, required: true },
    createdAt   : { type: Date, default: Date.now },
});

const DventaSchema = new Schema({
    producto : { type: Schema.ObjectId, ref: 'producto' },
    venta    : { type: Schema.ObjectId, ref: 'venta' },
    cliente  : { type: Schema.ObjectId, ref: 'cliente' },
    subtotal : { type: Number, required: true },
    variedad : { type: String, required: true },
    cantidad : { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

const InventarioSchema = new Schema({
    producto : { type: Schema.ObjectId, ref: 'producto' },
    cantidad : { type: Number, required: true },
    admin    : { type: Schema.ObjectId, ref: 'admin' },
    proveedor: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const ProductoSchema = new Schema({
    titulo          : { type: String, required: true },
    slug            : { type: String, required: true },
    galeria         : [{ type: Object }],
    portada         : { type: String, required: true },
    precio          : { type: Number, required: true },
    descripcion     : { type: String, required: true },
    contenido       : { type: String, required: true },
    stock           : { type: Number, required: true },
    nventas         : { type: Number, default: 0 },
    npuntos         : { type: Number, default: 0 },
    variedades      : [{ type: Object }],
    titulo_variedad : { type: String },
    categoria       : { type: String, required: true },
    estado          : { type: String, default: 'edicion' },
    createdAt       : { type: Date, default: Date.now },
});

const ReviewSchema = new Schema({
    producto      : { type: Schema.ObjectId, ref: 'producto' },
    cliente       : { type: Schema.ObjectId, ref: 'cliente' },
    venta         : { type: Schema.ObjectId, ref: 'venta' },
    review        : { type: String, required: true },
    clasificacion : { type: Number, required: true },
    createdAt     : { type: Date, default: Date.now },
});

const VentaSchema = new Schema({
    cliente     : { type: Schema.ObjectId, ref: 'cliente' },
    nventa      : { type: String, required: true },
    subtotal    : { type: Number, required: true },
    envio_titulo: { type: String, required: true },
    envio_precio: { type: Number, required: true },
    transaccion : { type: String, required: true },
    cupon       : { type: String, required: true },
    estado      : { type: String, required: true },
    direccion   : { type: Schema.ObjectId, ref: 'direccion' },
    nota        : { type: String },
    createdAt   : { type: Date, default: Date.now },
});

// ── Modelos ───────────────────────────────────────────────────────
const Admin     = mongoose.model('admin',     AdminSchema);
const Carrito   = mongoose.model('carrito',   CarritoSchema);
const Cliente   = mongoose.model('cliente',   ClienteSchema);
const Config    = mongoose.model('config',    ConfigSchema);
const Contacto  = mongoose.model('contacto',  ContactoSchema);
const Cupon     = mongoose.model('cupon',     CuponSchema);
const Descuento = mongoose.model('descuento', DescuentoSchema);
const Direccion = mongoose.model('direccion', DireccionSchema);
const Dventa    = mongoose.model('dventa',    DventaSchema);
const Inventario= mongoose.model('inventario',InventarioSchema);
const Producto  = mongoose.model('producto',  ProductoSchema);
const Review    = mongoose.model('review',    ReviewSchema);
const Venta     = mongoose.model('venta',     VentaSchema);

// ════════════════════════════════════════════════════════════════
//  FUNCIÓN PRINCIPAL
// ════════════════════════════════════════════════════════════════

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB:', MONGO_URI);

    // ── Limpiar colecciones ───────────────────────────────────────
    await Promise.all([
        Admin.deleteMany({}),
        Carrito.deleteMany({}),
        Cliente.deleteMany({}),
        Config.deleteMany({}),
        Contacto.deleteMany({}),
        Cupon.deleteMany({}),
        Descuento.deleteMany({}),
        Direccion.deleteMany({}),
        Dventa.deleteMany({}),
        Inventario.deleteMany({}),
        Producto.deleteMany({}),
        Review.deleteMany({}),
        Venta.deleteMany({}),
    ]);
    console.log('🗑️  Colecciones limpiadas');

    const passwordHash = await bcrypt.hash('123456', 10);

    // ════════════════════════════════════════════════════════════
    //  1. ADMINS
    // ════════════════════════════════════════════════════════════
    const admins = await Admin.insertMany([
        { nombres: 'Jaime',    apellidos: 'Ponce Montero',  email: 'jaime@monteros.com',   password: passwordHash, telefono: '987654321', rol: 'admin', dni: '12345678' },
        { nombres: 'Carlos',   apellidos: 'Quispe Ramos',   email: 'carlos@monteros.com',  password: passwordHash, telefono: '912345678', rol: 'admin', dni: '23456789' },
        { nombres: 'Ana',      apellidos: 'Torres Flores',  email: 'ana@monteros.com',     password: passwordHash, telefono: '923456789', rol: 'admin', dni: '34567890' },
        { nombres: 'Luis',     apellidos: 'Medina Paredes', email: 'luis@monteros.com',    password: passwordHash, telefono: '934567890', rol: 'admin', dni: '45678901' },
        { nombres: 'María',    apellidos: 'Sánchez Cruz',   email: 'maria@monteros.com',   password: passwordHash, telefono: '945678901', rol: 'admin', dni: '56789012' },
        { nombres: 'Pedro',    apellidos: 'Ramírez León',   email: 'pedro@monteros.com',   password: passwordHash, telefono: '956789012', rol: 'admin', dni: '67890123' },
        { nombres: 'Sofía',    apellidos: 'Vega Castillo',  email: 'sofia@monteros.com',   password: passwordHash, telefono: '967890123', rol: 'admin', dni: '78901234' },
        { nombres: 'Jorge',    apellidos: 'Huanca Mamani',  email: 'jorge@monteros.com',   password: passwordHash, telefono: '978901234', rol: 'admin', dni: '89012345' },
        { nombres: 'Lucía',    apellidos: 'Chávez Deza',    email: 'lucia@monteros.com',   password: passwordHash, telefono: '989012345', rol: 'admin', dni: '90123456' },
        { nombres: 'Roberto',  apellidos: 'Paz Villanueva', email: 'roberto@monteros.com', password: passwordHash, telefono: '990123456', rol: 'admin', dni: '01234567' },
    ]);
    console.log(`✅ Admins insertados: ${admins.length}`);

    // ════════════════════════════════════════════════════════════
    //  2. CLIENTES
    // ════════════════════════════════════════════════════════════
    const clientes = await Cliente.insertMany([
        { nombres: 'Fernando',  apellidos: 'López Díaz',      pais: 'Perú', email: 'fernando@gmail.com',  password: passwordHash, telefono: '911111111', genero: 'M', f_nacimiento: '1990-05-15', dni: '11111111' },
        { nombres: 'Gabriela',  apellidos: 'Morales Ríos',    pais: 'Perú', email: 'gabriela@gmail.com',  password: passwordHash, telefono: '922222222', genero: 'F', f_nacimiento: '1992-08-22', dni: '22222222' },
        { nombres: 'Miguel',    apellidos: 'Vargas Ortega',   pais: 'Perú', email: 'miguel@gmail.com',    password: passwordHash, telefono: '933333333', genero: 'M', f_nacimiento: '1988-03-10', dni: '33333333' },
        { nombres: 'Valentina', apellidos: 'Salinas Herrera', pais: 'Perú', email: 'valentina@gmail.com', password: passwordHash, telefono: '944444444', genero: 'F', f_nacimiento: '1995-11-30', dni: '44444444' },
        { nombres: 'Andrés',    apellidos: 'Mendoza Tello',   pais: 'Perú', email: 'andres@gmail.com',    password: passwordHash, telefono: '955555555', genero: 'M', f_nacimiento: '1993-07-18', dni: '55555555' },
        { nombres: 'Camila',    apellidos: 'Rojas Pinto',     pais: 'Perú', email: 'camila@gmail.com',    password: passwordHash, telefono: '966666666', genero: 'F', f_nacimiento: '1997-02-25', dni: '66666666' },
        { nombres: 'Ricardo',   apellidos: 'Fuentes Aguilar', pais: 'Perú', email: 'ricardo@gmail.com',   password: passwordHash, telefono: '977777777', genero: 'M', f_nacimiento: '1985-09-05', dni: '77777777' },
        { nombres: 'Paola',     apellidos: 'Gutiérrez Lara',  pais: 'Perú', email: 'paola@gmail.com',     password: passwordHash, telefono: '988888888', genero: 'F', f_nacimiento: '1991-06-14', dni: '88888888' },
        { nombres: 'Sebastián', apellidos: 'Castro Vera',     pais: 'Perú', email: 'sebastian@gmail.com', password: passwordHash, telefono: '999999999', genero: 'M', f_nacimiento: '1989-12-01', dni: '99999999' },
        { nombres: 'Diana',     apellidos: 'Reyes Montes',    pais: 'Perú', email: 'diana@gmail.com',     password: passwordHash, telefono: '900000000', genero: 'F', f_nacimiento: '1996-04-20', dni: '10101010' },
    ]);
    console.log(`✅ Clientes insertados: ${clientes.length}`);

    // ════════════════════════════════════════════════════════════
    //  3. CONFIG (solo 1 registro — configuración del sistema)
    // ════════════════════════════════════════════════════════════
    await Config.insertMany([{
        titulo: "MONTERO'S",
        logo  : 'logo.png',
        serie : '001',
        correlativo: '0001',
        categorias: [
            { _id: 'cat1', titulo: 'Ropa',        icono: 'cxi-bag' },
            { _id: 'cat2', titulo: 'Calzado',     icono: 'cxi-layouts' },
            { _id: 'cat3', titulo: 'Accesorios',  icono: 'cxi-star' },
            { _id: 'cat4', titulo: 'Deportes',    icono: 'cxi-plus' },
            { _id: 'cat5', titulo: 'Electrónica', icono: 'cxi-settings' },
        ]
    }]);
    console.log('✅ Config insertada');

    // ════════════════════════════════════════════════════════════
    //  4. PRODUCTOS
    // ════════════════════════════════════════════════════════════
    const productos = await Producto.insertMany([
        {
            titulo: "Polo Clásico MONTERO'S",       slug: 'polo-clasico-monteros',
            portada: 'polo-clasico.jpg',             precio: 59.90,
            descripcion: 'Polo de algodón premium con logo MONTERO\'S bordado.',
            contenido: '<p>Polo 100% algodón, corte regular fit, disponible en tallas S al XXL. Lavado a máquina.</p>',
            stock: 150, nventas: 45, npuntos: 45, categoria: 'Ropa', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: 'S' }, { titulo: 'M' }, { titulo: 'L' }, { titulo: 'XL' }],
        },
        {
            titulo: 'Zapatilla Urban Pro',           slug: 'zapatilla-urban-pro',
            portada: 'zapatilla-urban.jpg',          precio: 189.90,
            descripcion: 'Zapatilla urbana de alta durabilidad con suela antideslizante.',
            contenido: '<p>Zapatilla con plantilla acolchada, ideal para uso diario. Material: cuero sintético y mesh.</p>',
            stock: 80,  nventas: 32, npuntos: 32, categoria: 'Calzado', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: '38' }, { titulo: '39' }, { titulo: '40' }, { titulo: '41' }, { titulo: '42' }],
        },
        {
            titulo: 'Casaca Deportiva Elite',        slug: 'casaca-deportiva-elite',
            portada: 'casaca-elite.jpg',             precio: 149.90,
            descripcion: 'Casaca deportiva con tecnología DryFit para máximo rendimiento.',
            contenido: '<p>Casaca ligera con capucha ajustable, bolsillos laterales con cierre. Ideal para actividades outdoor.</p>',
            stock: 60,  nventas: 28, npuntos: 28, categoria: 'Deportes', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: 'S' }, { titulo: 'M' }, { titulo: 'L' }],
        },
        {
            titulo: 'Jean Slim Fit Premium',         slug: 'jean-slim-fit-premium',
            portada: 'jean-slim.jpg',                precio: 119.90,
            descripcion: 'Jean de corte slim con stretch para mayor comodidad.',
            contenido: '<p>Jean 98% algodón 2% elastano. Lavado de piedra. Disponible en azul y negro.</p>',
            stock: 120, nventas: 67, npuntos: 67, categoria: 'Ropa', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: '28' }, { titulo: '30' }, { titulo: '32' }, { titulo: '34' }],
        },
        {
            titulo: 'Mochila Traveler 30L',          slug: 'mochila-traveler-30l',
            portada: 'mochila-traveler.jpg',         precio: 89.90,
            descripcion: 'Mochila resistente al agua con compartimentos organizados.',
            contenido: '<p>Capacidad 30L, correas acolchadas, puerto USB externo. Ideal para viajes y trekking.</p>',
            stock: 45,  nventas: 19, npuntos: 19, categoria: 'Accesorios', estado: 'activo',
            titulo_variedad: 'Color',
            variedades: [{ titulo: 'Negro' }, { titulo: 'Azul' }, { titulo: 'Gris' }],
        },
        {
            titulo: 'Audífonos Bluetooth X200',      slug: 'audifonos-bluetooth-x200',
            portada: 'audifonos-x200.jpg',           precio: 199.90,
            descripcion: 'Audífonos inalámbricos con cancelación de ruido activa.',
            contenido: '<p>Autonomía 30h, carga rápida 15min = 3h de uso. Conexión multipoint. Compatible iOS y Android.</p>',
            stock: 35,  nventas: 23, npuntos: 23, categoria: 'Electrónica', estado: 'activo',
            titulo_variedad: 'Color',
            variedades: [{ titulo: 'Negro' }, { titulo: 'Blanco' }],
        },
        {
            titulo: 'Short Running Flex',            slug: 'short-running-flex',
            portada: 'short-running.jpg',            precio: 49.90,
            descripcion: 'Short deportivo con bolsillo lateral y tecnología antimicrobiana.',
            contenido: '<p>Tela ultraligera de secado rápido. Cintura elástica ajustable. Ideal para running y gym.</p>',
            stock: 200, nventas: 89, npuntos: 89, categoria: 'Deportes', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: 'S' }, { titulo: 'M' }, { titulo: 'L' }, { titulo: 'XL' }],
        },
        {
            titulo: 'Polo Oversize Collection',      slug: 'polo-oversize-collection',
            portada: 'polo-oversize.jpg',            precio: 69.90,
            descripcion: "Polo oversize de la colección especial MONTERO'S 2025.",
            contenido: '<p>Diseño exclusivo, caída holgada, cuello redondo reforzado. 100% algodón ringspun.</p>',
            stock: 90,  nventas: 41, npuntos: 41, categoria: 'Ropa', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: 'S' }, { titulo: 'M' }, { titulo: 'L' }, { titulo: 'XL' }, { titulo: 'XXL' }],
        },
        {
            titulo: 'Reloj Sport Digital Pro',       slug: 'reloj-sport-digital-pro',
            portada: 'reloj-sport.jpg',              precio: 159.90,
            descripcion: 'Reloj deportivo multifunción con monitor de frecuencia cardíaca.',
            contenido: '<p>Resistente al agua 50m, GPS integrado, monitor de sueño. Batería 7 días. Correa de silicona.</p>',
            stock: 25,  nventas: 15, npuntos: 15, categoria: 'Electrónica', estado: 'activo',
            titulo_variedad: 'Color',
            variedades: [{ titulo: 'Negro' }, { titulo: 'Rojo' }, { titulo: 'Azul' }],
        },
        {
            titulo: 'Buzo Jogging Comfort Set',      slug: 'buzo-jogging-comfort-set',
            portada: 'buzo-jogging.jpg',             precio: 179.90,
            descripcion: 'Set completo de buzo (casaca + pantalón) para máximo confort.',
            contenido: '<p>Tela polar suave interior, exterior resistente al viento. Incluye casaca con capucha y pantalón con bolsillos.</p>',
            stock: 55,  nventas: 36, npuntos: 36, categoria: 'Ropa', estado: 'activo',
            titulo_variedad: 'Talla',
            variedades: [{ titulo: 'S' }, { titulo: 'M' }, { titulo: 'L' }, { titulo: 'XL' }],
        },
    ]);
    console.log(`✅ Productos insertados: ${productos.length}`);

    // ════════════════════════════════════════════════════════════
    //  5. CUPONES
    // ════════════════════════════════════════════════════════════
    const cupones = await Cupon.insertMany([
        { codigo: 'MONTEROS10', tipo: 'Porcentaje', valor: 10, limite: 100, disponibilidad: 100 },
        { codigo: 'MONTEROS20', tipo: 'Porcentaje', valor: 20, limite:  50, disponibilidad:  50 },
        { codigo: 'BIENVENIDO', tipo: 'Porcentaje', valor: 15, limite: 200, disponibilidad: 200 },
        { codigo: 'VERANO25',   tipo: 'Porcentaje', valor: 25, limite:  30, disponibilidad:  30 },
        { codigo: 'DESCUENTO5', tipo: 'Valor Fijo', valor:  5, limite: 500, disponibilidad: 500 },
        { codigo: 'PROMO50',    tipo: 'Valor Fijo', valor: 50, limite:  20, disponibilidad:  20 },
        { codigo: 'FIDELIDAD',  tipo: 'Porcentaje', valor: 30, limite:  10, disponibilidad:  10 },
        { codigo: 'NAVIDAD15',  tipo: 'Porcentaje', valor: 15, limite: 150, disponibilidad: 150 },
        { codigo: 'FLASH30',    tipo: 'Porcentaje', valor: 30, limite:   5, disponibilidad:   5 },
        { codigo: 'REGALO10',   tipo: 'Valor Fijo', valor: 10, limite: 100, disponibilidad: 100 },
    ]);
    console.log(`✅ Cupones insertados: ${cupones.length}`);

    // ════════════════════════════════════════════════════════════
    //  6. DESCUENTOS
    // ════════════════════════════════════════════════════════════
    await Descuento.insertMany([
        { titulo: 'Campaña Verano 2025',        banner: 'banner-verano.jpg',      descuento: 20, fecha_inicio: '2025-01-01', fecha_fin: '2025-02-28' },
        { titulo: 'Sale de Invierno',           banner: 'banner-invierno.jpg',    descuento: 30, fecha_inicio: '2025-06-01', fecha_fin: '2025-07-31' },
        { titulo: 'Día de la Madre',            banner: 'banner-madre.jpg',       descuento: 15, fecha_inicio: '2025-05-01', fecha_fin: '2025-05-12' },
        { titulo: 'Black Friday MONTERO\'S',    banner: 'banner-blackfriday.jpg', descuento: 50, fecha_inicio: '2025-11-28', fecha_fin: '2025-11-30' },
        { titulo: 'Cyber Monday',               banner: 'banner-cyber.jpg',       descuento: 40, fecha_inicio: '2025-12-01', fecha_fin: '2025-12-02' },
        { titulo: 'Aniversario MONTERO\'S',     banner: 'banner-aniversario.jpg', descuento: 25, fecha_inicio: '2025-03-15', fecha_fin: '2025-03-20' },
        { titulo: 'Colección Nueva Temporada',  banner: 'banner-temporada.jpg',   descuento: 10, fecha_inicio: '2025-04-01', fecha_fin: '2025-04-30' },
        { titulo: 'Fiestas Patrias',            banner: 'banner-patrias.jpg',     descuento: 20, fecha_inicio: '2025-07-24', fecha_fin: '2025-07-29' },
        { titulo: 'Navidad y Año Nuevo',        banner: 'banner-navidad.jpg',     descuento: 35, fecha_inicio: '2025-12-20', fecha_fin: '2025-12-31' },
        { titulo: 'Liquidación Final',          banner: 'banner-liquidacion.jpg', descuento: 60, fecha_inicio: '2025-08-01', fecha_fin: '2025-08-15' },
    ]);
    console.log('✅ Descuentos insertados: 10');

    // ════════════════════════════════════════════════════════════
    //  7. DIRECCIONES (una por cliente)
    // ════════════════════════════════════════════════════════════
    const distritos  = ['Miraflores','San Isidro','Surco','La Molina','Barranco','Jesús María','Lince','San Borja','Chorrillos','Pueblo Libre'];
    const provincias = ['Lima','Lima','Lima','Lima','Lima','Lima','Lima','Lima','Lima','Lima'];
    const referencia = ['Frente al parque','Al lado del banco','Cerca a la farmacia','Frente al colegio','Esq. con Av. Arequipa','A 2 cuadras del mercado','Detrás del supermercado','Al costado de la clínica','Cerca al metro','Frente a la municipalidad'];

    const direcciones = await Direccion.insertMany(
        clientes.map((c, i) => ({
            cliente     : c._id,
            destinatario: `${c.nombres} ${c.apellidos}`,
            dni         : c.dni,
            telefono    : c.telefono,
            direccion   : `Av. Los Álamos ${(i + 1) * 100}, Dpto. ${i + 1}01`,
            referencia  : referencia[i],
            pais        : 'Perú',
            region      : 'Lima',
            provincia   : provincias[i],
            distrito    : distritos[i],
            zip         : `150${(i + 1).toString().padStart(2, '0')}`,
            principal   : true,
            status      : true,
        }))
    );
    console.log(`✅ Direcciones insertadas: ${direcciones.length}`);

    // ════════════════════════════════════════════════════════════
    //  8. VENTAS
    // ════════════════════════════════════════════════════════════
    const estadosVenta = ['Pendiente Cobro','Procesando','Enviado','Finalizado','Cancelado','Finalizado','Enviado','Finalizado','Procesando','Finalizado'];
    const envioTitulos = ['Delivery Express','Delivery Estándar','Recojo en Tienda','Delivery Express','Delivery Estándar','Delivery Express','Recojo en Tienda','Delivery Estándar','Delivery Express','Delivery Estándar'];
    const envioPrecios = [15,10,0,15,10,15,0,10,15,10];

    const ventas = await Venta.insertMany(
        clientes.map((c, i) => ({
            cliente     : c._id,
            nventa      : `V-${(1001 + i).toString()}`,
            subtotal    : parseFloat((Math.random() * 400 + 60).toFixed(2)),
            envio_titulo: envioTitulos[i],
            envio_precio: envioPrecios[i],
            transaccion : `TXN${Date.now()}${i}`,
            cupon       : i % 3 === 0 ? 'MONTEROS10' : 'SIN_CUPON',
            estado      : estadosVenta[i],
            direccion   : direcciones[i]._id,
            nota        : i % 2 === 0 ? 'Por favor entregar en horario de mañana.' : '',
        }))
    );
    console.log(`✅ Ventas insertadas: ${ventas.length}`);

    // ════════════════════════════════════════════════════════════
    //  9. DETALLE DE VENTAS (dventas)
    // ════════════════════════════════════════════════════════════
    const tallas = ['S','M','L','XL','38','39','40','Negro','Blanco','Azul'];
    await Dventa.insertMany(
        ventas.map((v, i) => ({
            producto : productos[i % productos.length]._id,
            venta    : v._id,
            cliente  : clientes[i]._id,
            subtotal : parseFloat((productos[i % productos.length].precio * (Math.floor(Math.random() * 3) + 1)).toFixed(2)),
            variedad : tallas[i],
            cantidad : Math.floor(Math.random() * 3) + 1,
        }))
    );
    console.log('✅ Dventas insertadas: 10');

    // ════════════════════════════════════════════════════════════
    //  10. INVENTARIO
    // ════════════════════════════════════════════════════════════
    const proveedores = ['Textiles Perú SAC','Import Fashion EIRL','Distribuidora Andina','Global Trend SRL','Lima Stock SA','Proveedor Norte','Sur Comercial','Centro Textil','Importaciones Pacífico','Distribuidora Lima'];
    await Inventario.insertMany(
        productos.map((p, i) => ({
            producto : p._id,
            cantidad : Math.floor(Math.random() * 200) + 50,
            admin    : admins[i % admins.length]._id,
            proveedor: proveedores[i],
        }))
    );
    console.log('✅ Inventario insertado: 10');

    // ════════════════════════════════════════════════════════════
    //  11. REVIEWS
    // ════════════════════════════════════════════════════════════
    const reviewTextos = [
        'Excelente producto, superó mis expectativas. La calidad es increíble.',
        'Muy buena calidad, llegó rápido y bien empaquetado. Lo recomiendo.',
        'El material es de primera, exactamente como en las fotos. Satisfecho.',
        'Buena compra, la talla es exacta. El color es igual al de la imagen.',
        'Producto de buena calidad pero la entrega tardó un poco más de lo esperado.',
        'Increíble relación calidad/precio. Ya hice mi segunda compra en MONTERO\'S.',
        'El producto es tal como se describe. Muy cómodo y durable.',
        'Recomiendo 100%. La atención al cliente también fue excelente.',
        'Buen producto en general, el empaque podría mejorar un poco.',
        'Perfecto para lo que necesitaba. Llegó antes del tiempo estimado.',
    ];
    await Review.insertMany(
        ventas.map((v, i) => ({
            producto     : productos[i % productos.length]._id,
            cliente      : clientes[i]._id,
            venta        : v._id,
            review       : reviewTextos[i],
            clasificacion: Math.floor(Math.random() * 2) + 4, // 4 o 5 estrellas
        }))
    );
    console.log('✅ Reviews insertadas: 10');

    // ════════════════════════════════════════════════════════════
    //  12. CONTACTOS
    // ════════════════════════════════════════════════════════════
    const asuntos  = ['Consulta sobre producto','Problema con mi pedido','Solicitud de cambio','Información de envío','Devolución de producto','Consulta de stock','Problema de pago','Consulta de garantía','Sugerencia','Felicitación al equipo'];
    const mensajes = [
        '¿El polo classic está disponible en talla XXL y color blanco?',
        'Mi pedido V-1003 no ha llegado y ya pasaron 5 días hábiles.',
        'Quisiera cambiar el polo talla M por talla L, ¿cómo procedo?',
        '¿Cuánto tiempo demora el delivery express a Arequipa?',
        'Recibí el producto con una costura defectuosa, quisiera devolverlo.',
        '¿Tienen stock de las zapatillas Urban Pro en talla 43?',
        'Mi tarjeta fue cobrada dos veces por el mismo pedido.',
        '¿Los audífonos tienen garantía de fábrica? ¿Por cuánto tiempo?',
        'Sería genial si tuvieran más colores en los polos oversize.',
        'Quiero felicitar al equipo por el excelente servicio recibido.',
    ];

    await Contacto.insertMany(
        clientes.map((c, i) => ({
            cliente  : `${c.nombres} ${c.apellidos}`,
            mensaje  : mensajes[i],
            asunto   : asuntos[i],
            telefono : c.telefono,
            correo   : c.email,
            estado   : i < 4 ? 'Abierto' : 'Cerrado',
        }))
    );
    console.log('✅ Contactos insertados: 10');

    // ════════════════════════════════════════════════════════════
    //  13. CARRITOS
    // ════════════════════════════════════════════════════════════
    await Carrito.insertMany(
        clientes.map((c, i) => ({
            producto : productos[(i + 2) % productos.length]._id,
            cliente  : c._id,
            cantidad : Math.floor(Math.random() * 3) + 1,
            variedad : tallas[i],
        }))
    );
    console.log('✅ Carritos insertados: 10');

    // ════════════════════════════════════════════════════════════
    //  RESUMEN FINAL
    // ════════════════════════════════════════════════════════════
    console.log('\n════════════════════════════════════════════');
    console.log("  ✅ SEED DATA completado — MONTERO'S");
    console.log('════════════════════════════════════════════');
    console.log('  📧 Login admin: jaime@monteros.com');
    console.log('  🔑 Password:    123456');
    console.log('════════════════════════════════════════════\n');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Error durante el seed:', err);
    mongoose.disconnect();
    process.exit(1);
});