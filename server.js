var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , app = express.createServer(express.logger())
  , io = require('socket.io').listen(app)
  , _und = require('underscore')
  , mongoose = require('mongoose')
  , hedgehog = require('./server/lib/hedgehog')
  , fs = require('fs')
  , dipresolve = require('./server/lib/dipresolve')

var 
    MODEL_PATH  = './server/model/'
  , db_uri      = process.env.MONGOLAB_URI || 'mongodb://localhost/diplomacy-dev';

var users={};

app.configure(function(){
  app.set('views', __dirname + '/server/views');
  app.set('view options', {layout: false});
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: function (str, path){
      return stylus(str)
        .set('filename', path)
        .set('compress', true)
        .use(nib());
    }
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

io.configure("development", function () { 
  io.set("log level", 1); 
});

io.configure("production", function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.configure("test", function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

app.dynamicHelpers({
  env: function(req, res){
    return app.settings.env;
  }
});

// Mongoose

mongoose.connect(db_uri, function(err) {
 if (err) console.log(err);
});

// Load and instantiate models

var model = [];

fs.readdir('./server/model',function(err,files){
  if (err){
    //error
    callback(error);
  }
  files.forEach(function(file){
    //filter and trim .js
    var filename = file
    if (file.substr(-3) == '.js'){
      filename = file.replace('.js', '');
      model[filename] = require(MODEL_PATH + file).create(mongoose);
    }
  })
});

// Template Compiler

var h = new hedgehog({
  'input_path': './public/scripts/client/template',
  'output_file': './public/scripts/client/templates.js',
  'extension': '.m'
});

// ROUTES

require('./server/controller/users.js').controller(io,_und);

app.get('/', function(req, res) {
  res.render('app.jade', {title: 'Diplomacy'});
});

app.get('/test', function(req, res) {
  res.render('test.jade', {title: 'Diplomacy'});
});

io.sockets.on('connection', function (socket) {

  // socket.on('chat:message', function (data) {
  //   delete data.id //mongoose requires specific userid type. removed for now.
  //   ch.messages.push(data);
  //   ch.save();
  //   // broadcast the message
  //   console.log('message received');
  //   socket.broadcast.emit('chat:message', data);
  // });

  // socket.on('chat:connect', function(user){
  //   console.log('welcome '+user.name);
  //   socket.user_id = user.id;
  //   users[user.id] = user;
  //   //TODO: send updates, based on when last online
  //   //socket.emit('game:updates',data)
  //   socket.emit('chat:users',users);
  //   socket.broadcast.emit('chat:users',users);
  // });

  // socket.on('chat:getAll',function(callback){
  //   callback(ch.messages);
  // });

  // socket.on('game:create', function(data){
  //   newGame = new Game(data);
  //   newGame.save();
  // })

  // //socket.on('game:getAll', function(callback){
  // //  Game.find({}, function(err, docs){callback(docs);});
  // //})

  // socket.on('disconnect', function(){
  //   console.log('bye bye '+socket.user_id);
  //   delete users[socket.user_id];
  //   console.log(users);
  //   socket.emit('chat:users',users);
  //   socket.broadcast.emit('chat:users',users);
  // });

  socket.on('game:submit', function(game,player,orders,cb){
    //one person has pressed submit, queue their moves
    console.log(game)
    console.log(player)
    console.log(orders)

    var _model = model["order_set"];
    _model.findOne({'_id':game}, function(err, doc){ 
      if (doc==undefined)
      {
        newEntry = new _model({
          _id: mongoose.Types.ObjectId.fromString(game),
          orders: [{
            player: player,
            orders: orders
          }]
        });
        newEntry.save();
      }
      else {
        _model.update(
          { '_id': mongoose.Types.ObjectId.fromString(game)}, 
          { $addToSet : { orders : {player: player, orders: orders} } }, 
          {}, 
          function(e,num){}
        );

      }
    });
  });

  socket.on('game:resolve', function(args, cb){
    var blah = dipresolve(args);

    cb(null, blah);
  });

  socket.on('user:login', function(args, cb){
    var _model = model['user'];

    _model.findOne({email: args.email}, function(err, doc){ 

      // if username exists
      if(doc){
        // if passphrase correct
        if(args.passphrase == doc.passphrase){
          // return user id 
          cb(null, doc);
        }
        // else (passphrase incorrect)
        else {
          // return error
          // TODO
        }
      } 
      // else (username does not exist)
      else {
        // create user
        doc = new _model(args);
        doc.save();

        // return user id
        cb(null, doc);
      }

    });
    
  });


  socket.on('db', function(args, callback){

    /* 
      args = {
          action: "",
          collection: "",
          data: {}
      }
    */
    
    //load schema based on collection specified

    //TODO:
    //  Error Handling (record not found, collectio not found, args data not found)
    //  Automated schema loading from models folder
    //  Unit tests

    var _model = model[args.collection];

    switch(args.action){
      case 'GET':
        if (!args.data){
          //Getall
          _model.find({}, function(err, docs){callback(err,docs);});
        }
        else {
          //Get one
          //do we use findById instead? Not sure if using mongo ids or our own.
          _model.findOne({'_id':args.data}, function(err, docs){callback(err,docs);});
        }
        break;
      
      case 'PUT':
        break;
      
      case 'POST':
        if (args.data){
          //create new post in collection
          args.data._id =  mongoose.Types.ObjectId.fromString(args.data._id);
          newEntry = new _model(args.data);
          newEntry.save();
        }
        break;

      case 'update':
        if(args.data){
          id = mongoose.Types.ObjectId.fromString(args.data._id);
          delete args.data["_id"];
          _model.update({_id: id}, args.data, {}, function(e,num){console.log(num)})
        }

        break;
      
      case 'DELETE':
        if (args.data){
          console.log(args);
          _model.remove({_id:args.data}, function(err, docs){callback(err,docs);});
        }
        break;
    }
    
  })

});

// RUN

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});
