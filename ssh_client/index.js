var os = require('os');
var networkInterfaces = os.networkInterfaces();
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
var path = require('path');

var publicPath = path.resolve(__dirname);

app.use(express.static(publicPath));

var pass;
var ped, resp, cam;

app.post('/conectar', function (req, res) {
	console.log('/conectar');
	conectarSSH(req,res);
});

app.post('/banner', function (req, res) { 
	console.log('/banner');
	ped = req;
	resp = res;
});

app.post('/password', function (req, res) { 
	console.log('/password');
	ped = req;
	resp = res;
});

http.listen(80, () => {
  console.log('listening on: 80');
});

io.on('connection', (socket) => {
	console.log('Conexão Aberta');
	socket.on('chat message', (msg) => {
		console.log(msg);
	});
	socket.on('conectar', (data) => {
		conectarSSH(data);
	});
	socket.on('comando', (data) => {
		passarComando(data);
	});
});

var Client = require('ssh2').Client;
var readline = require('readline')
const linealeida = require('readline-sync');
var conn = new Client();

function conectarSSH(dato){
	conn.connect({
		host: dato.host,
		port: dato.port,
		username: dato.user,
		tryKeyboard: true,
		readyTimeout: 40000
	});
	io.emit('conectar', "conectando...");
}

function passarComando(dato){
	comando = dato.comando;
	estado = dato.estado;	
	switch (estado) {
		case 'password':
			finalizar([comando]);
			break;
		case 'Doble_Factor':
			finalizar([comando]);
			break;
		default:
			mistream.write(comando + '\n');
			break;
	}
}

/* -------------	SSH    ------------------ */

conn.on('banner', function (message, language){
	console.log('Connection :: banner');
	console.log(message);		
	io.emit('banner', message);
});

var finalizar;
conn.on('keyboard-interactive',function (name, instructions, lang, prompts, finish) {
	console.log('Connection :: keyboard-interactive');
	if (prompts.length > 0 && prompts[0].prompt.toLowerCase().includes('password')) {
		mensagem = prompts[0].prompt;
		console.log(mensagem);
		io.emit('password', mensagem);
		finalizar = finish;
	} else if ( prompts.length > 0 && prompts[0].prompt.includes('Doble_Factor:')) {
		mensagem = prompts[0].prompt;
		console.log(mensagem)
		io.emit('Doble_Factor', mensagem);
		finalizar = finish;
	} else console.log(prompts);
});

conn.on('ready', function() {
	mensagem = 'Client :: ready';
	console.log(mensagem);
	shell_connection();
});

conn.on('error', function() {
	mensagem = 'Client :: error';
	console.log(mensagem);
	io.emit('error', mensagem);
});

var mistream;

function shell_connection(){
	conn.shell(function(err, stream) {
		if (err) throw err;
		var rl = readline.createInterface(process.stdin, process.stdout)
		stream.on('close', function() {
			process.stdout.write('Connection closed.\n')
			console.log('Stream :: close');
			conn.end();
			mensagem = 'exit\nConnection closed.\n'
			io.emit('exit', mensagem);
		}).on('data', function(data) {
			process.stdin.pause()
			process.stdout.write(data) 
			mensagem = data + '\n';
			io.emit('ready', mensagem);
			process.stdin.resume();
		  	mistream = stream;
		}).stderr.on('data', function(data) {
			process.stderr.write(data);
			io.emit('error', data);
		});

		rl.on('line', function (d) {
			stream.write(d.trim() + '\n');
		})

		rl.on('SIGINT', function () {
		  process.stdin.pause()
		  process.stdout.write('\nEnding session\n')
		  rl.close()
		  // close connection
		  stream.end('exit\n');
			io.emit('exit', 'exit');
		})
	});
}
/* --------------------	fim SSH ------------------------- */