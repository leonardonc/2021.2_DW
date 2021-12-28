var Destino = document.getElementById('areadotexto');
var Comando = document.getElementById('comando');
var host = document.getElementById('host');
var port = document.getElementById('port');
var user = document.getElementById('user');

var estado = 'desconectado';

var socket = io();
function enviarComan2(){
	if (estado!='desconectado'){
		var data = {
			comando: Comando.value,
			estado : estado
		};
		socket.emit('comando', data);
		Comando.value = '';
	} else {
		esperandoResposta.innerHTML = '';
	}
};

socket.on('conectar', function(msg){
	Destino.textContent = msg + "\n";	
	esperandoResposta.innerHTML = '';
});

socket.on('password', function(msg){
	Destino.textContent += msg ;
	esperandoResposta.innerHTML = '';
	estado = 'password';
	Comando.setAttribute("type", "password");
	Comando.focus();
	Comando.select();	
});

socket.on('ready', function(msg){
	Destino.textContent += msg ;
	esperandoResposta.innerHTML = '';
	estado = 'ready';
	/* window.scrollTo(0, Comando.offsetTop);
	Destino.scrollTo(0, Destino.scrollHeight); */
	if (msg.match(/password/gi)) {
		Comando.style.background = "#505363";
		Comando.setAttribute("type", "password"); 
	} else {
		Comando.style.background = "black";
		Comando.setAttribute("type", "text");
	}
});

function conectar(){
	esperandoResposta.innerHTML = 'esperando resposta...';
	var url = 'conectar';
	var data = {
		user: user.value,
		host: host.value,
		port: port.value
	};
	socket.emit(url, data);
	estado = url;
}

var esperandoResposta = document.getElementById('answer');
function runScript(e) {
    if (e.keyCode == 13) {
		switch (estado) {
			case 'banner':
				Destino.textContent += Comando.value.replace(/\S/g, '*') + "\n";
				break;
			case 'password':
				Destino.textContent += Comando.value.replace(/\S/g, '*') + "\n";
				break;
			default:
				break;
		}
		esperandoResposta.innerHTML = 'esperando resposta...';
		enviarComan2();
    }
}
