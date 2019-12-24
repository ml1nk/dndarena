const path = require('path');
const clone = require('clone-deep');
const ytdl = require("ytdl-core");
const requireIfExists = require('node-require-fallback');
const config = requireIfExists(path.resolve(__dirname,'config.json'), path.resolve(__dirname, 'config.sample.json'));
const eso = require('event-shared-object');
const def = require('./default.json');

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: {
    level: config.logger
  }
})

const io = require('socket.io')(fastify.server,{path: '/ws'});

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/',
  maxAge: 60000*60000
});

// 2l7ixRE3OCw
// 5aZI-jukT5E
// ximgPmJ9A5s

fastify.get('/', (req, res) => {
  res.res.setHeader('Cache-Control', 'max-age=0');
  res.sendFile('index.html');
});

// Run the server!
fastify.listen(config.port, config.interface, (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

let state = {};

io.on('connection', function (socket) {
  let room = socket.handshake.query.room ? socket.handshake.query.room : "";
  if(!state[room]) {
    state[room] = eso.master("state", io.to(room).emit.bind(io.to(room)), clone(def));
  }

  socket.join(room);

  socket.on('audio',async (v,cb)=>{
    try {
      let info = await ytdl.getInfo(v);
      let format = ytdl.chooseFormat(info.formats, { 
        filter: "audioonly",
        quality: "highestaudio"
      });
      if (!format) cb(false);
      cb({ url : format.url, title : info.title, duration: parseInt(info.length_seconds), thumbnail : info.player_response.videoDetails.thumbnail.thumbnails[0].url});
    } catch(e) {
      cb(false);
    }
  })
  socket.on("message",obj=>socket.to(room).emit("message",obj));
  socket.on("emitter",obj=>socket.to(room).emit("emitter",obj));

  state[room].register(socket);
  socket.on('disconnect', () => {
    state[room].unregister(socket);
  });
  
});