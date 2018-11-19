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
  root: path.join(__dirname, '..', '..', 'frontend', 'dist'),
  prefix: '/dist/'
})
// 2l7ixRE3OCw
// 5aZI-jukT5E
function getStream(v) {
  let res = cache.get(v);
  if(!res) {
    let error = false;
    ori = ytdl('http://youtube.com/watch?v='+v, {filter: 'audioonly', quality: 'highestaudio'});
    ori.on("error",(e)=>{
      res.emit("error",e);
      res.error = e;
    });
    res = new streamCache();
    ori.pipe(res);
    cache.set(v, res);
  }
  return res;
}

function h404(e,res) {
  console.warn(e);
  res.status(404).send("Not Found");
}

fastify.get('/audio/:v', (req, res) => {
  try {
    let st = getStream(req.params.v);
    if(st.error) h404(st.error, res); else st.on("error",(e)=>h404(e,res)).pipe(res.res);
  } catch(e) {
    h404(e,res);
  }
});

fastify.get('/', (req, reply) => reply.sendFile('index.html'));

// Run the server!
fastify.listen(3000, "0.0.0.0", (err, address) => {
  if (err) throw err
  fastify.log.info(`server listening on ${address}`)
})

let data = { 
  field : {
    "0:0:0" : "transparent"
  },
  audio : {
    play : true
  }
};


io.on('connection', function (socket) {
  
  socket.emit("load", data);

  socket.on("load",obj=> {
    data = obj;
    socket.broadcast.emit("load",obj);
  });

  socket.on("message",obj=>socket.broadcast.emit("message",obj));

  socket.on("field/add",obj=> {
    data.field[obj.x+":"+obj.y+":"+obj.z] = obj.name;
    socket.broadcast.emit("field/add",obj);
  });

  socket.on("field/del",obj=> {
    delete data.field[obj.x+":"+obj.y+":"+obj.z];
    socket.broadcast.emit("field/del",obj);
  });

  socket.on("audio/play",obj=> {
    data.audio.play = obj;
    socket.broadcast.emit("audio/play",obj);
  });

  socket.on('disconnect', function () { });
});