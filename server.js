const path = require('path');
const streamCache = require('stream-cache');
const cache = new (require('node-cache'))( { stdTTL: 600, checkperiod: 120, useClones: false } );
const ytdl = require("ytdl-core");

// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
})

const io = require('socket.io')(fastify.server);

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'dist'),
  prefix: '/dist/'
});

// 2l7ixRE3OCw
// 5aZI-jukT5E
// ximgPmJ9A5s

fastify.get('/', (req, reply) => reply.sendFile('index.html'));

// Run the server!
fastify.listen(3000, "0.0.0.0", (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})


let def = {
  field : {
    "0:0:0" : "transparent"
  },
  audio : {
    play : false,
    id : "",
    data : false,
    time : 0
  }
};

let state = {};

io.on('connection', function (socket) {
  let room = socket.handshake.query.room ? socket.handshake.query.room : "";
  if(!state[room]) {
    state[room] = JSON.parse(JSON.stringify(def));;
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
      cb({ url : format.url, title : info.title, duration: parseInt(info.length_seconds), thumbnail : info.thumbnail_url});
    } catch(e) {
      cb(false);
    }
  })

  socket.emit("state", ["",state[room]]);
  socket.on("message",obj=>socket.to(room).emit("message",obj));
  socket.on("state",obj => {
    if(obj[0] === "") {
      state[room] = obj[1];
    } else {
      let parts = obj[0].split('.');
      let pre = parts.slice(0, -1).reduce((o, i) => o[i], state[room]);
      if(obj[1]===null) {
          delete pre[parts.slice(-1)[0]];
      } else {
          pre[parts.slice(-1)[0]] = obj[1];
      }
    }
    io.to(room).emit("state",obj);
  });
});
