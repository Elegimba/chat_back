const http = require('node:http') // Librería básica que viene integrada en node
const socketIO = require('socket.io');
const ChatMessage = require('./models/chatmessage.model');
const app = require('./app')

// Config .env && config BD
require('dotenv').config();
require('./config/db');

/* const server = http.createServer((req, res) => {
    res.end('Funsiona');
}); */                          //substituímos para que se encarge express
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT);

// Config Socket.io
const io = socketIO(server, {
    cors: { origin: '*' }
});

io.on('connection', async (socket) => {
    /* console.log('Nueva conexión'); */
    socket.broadcast.emit('chat_message_server', {
        name: 'INFO',
        message: 'Se ha conectado un nuevo usuario'
    });

    // Emitimos el número de clientes conectados
    io.emit('clients_count', io.engine.clientsCount);
    
    // Me subscribo para recibir los mensajes del chat
    socket.on('chat_message', (data) => {
        ChatMessage.create(data);
        /* console.log(data); */
        io.emit('chat_message_server', data);
    });

    // Me subscribo para detectar las desconexiones
    socket.on('disconnect', () => {
        socket.broadcast.emit('chat_message_server', {
            name: 'INFO',
            message: 'Se ha desconectado un usuario'
        });
    });

    // Recupero los 5 últimos mensages
    const messages = await ChatMessage.find().sort('-createdAt').limit(5);
    console.log(messages);

    // Emito el evento chat_init
    socket.emit('chat_init', { socket_id: socket.id, arrMessages: messages })

});