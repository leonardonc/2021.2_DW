var Destino = document.getElementById('areadotexto');
var Comando = document.getElementById('comando');
var host = document.getElementById('host');
var port = document.getElementById('port');
var user = document.getElementById('user');

var estado = 'desconectado';

var socket = io();
function enviarComan2(){
	console.log('estado '+ estado);
	if (estado!='desconectado'){
		var data = {
			comando: Comando.value,
			estado : estado
		};
		socket.emit('comando', data);
		Comando.value = '';
	} else {
		esperandoResposta.innerHTML = '';
		alert('Faça o login');
	}
};

socket.on('conectar', function(msg){
	Destino.textContent = msg + "\n";	
	esperandoResposta.innerHTML = '';
});

socket.on('banner', function(msg){
	Destino.textContent = msg ;
	esperandoResposta.innerHTML = '';
	estado = 'banner';
});

socket.on('password', function(msg){
	Destino.textContent += msg ;
	esperandoResposta.innerHTML = '';
	estado = 'password'; 
	Comando.style.background = "#505363";
	Comando.setAttribute("type", "password");
	Comando.focus();
	Comando.select();	
});

socket.on('Doble_Factor', function(msg){
	Destino.textContent += msg + "\n";
	esperandoResposta.innerHTML = '';
	estado = 'Doble_Factor';
	Comando.style.background = "#505363";
	Comando.setAttribute("type", "password");
	Comando.focus();
	Comando.select();	
});

socket.on('ready', function(msg){
	Destino.textContent += msg ;
	esperandoResposta.innerHTML = '';
	estado = 'ready'; 
	Destino.scrollTo(0, Destino.scrollHeight);
	if (msg.match(/password/gi)) {
		Comando.style.background = "#505363";
		Comando.setAttribute("type", "password"); 
	} else {
		Comando.style.background = "black";
		Comando.setAttribute("type", "text");
	}
});

socket.on('error', function(msg){
	Destino.textContent += msg ;
	esperandoResposta.innerHTML = '';
	estado = 'error'; 
});

socket.on('exit', function(msg){
	Destino.textContent += msg ;	
	esperandoResposta.innerHTML = '';
	estado = 'exit'; 
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

function enviarComando(){
	var url = 'comando';
	var data = {comando: Comando.value};
	switch (estado) {
		case 'banner':
			estado = 'password';
			break;
		case 'password':
			estado = 'Doble_Factor';
			break;
		case 'Doble_Factor':
			estado = 'ready';
			break;
		default:
			break;
	}

	data.estado = estado;
	console.log(url + ' - estado ' + estado);
	fetch(url, {
	  method: 'POST',
	  body: JSON.stringify(data),
	  headers:{
		'Content-Type': 'application/json'
	  }
	})
	.then(function(response) {
		esperandoResposta.innerHTML = '';
		return response.json();
		})
	.then(function(myJson) {
		switch (myJson.evento) {
			case 'Doble_Factor':
				Destino.textContent += myJson.mensaje ;
				break;
			case 'ready':
				Destino.textContent += myJson.mensaje ;
				
				if (!String(myJson.mensaje).match(/\$/g)) {
					enviarURL('ouvir'); 
				} 
				break;
			case 'exit':
				Destino.textContent += myJson.mensaje ;
				break;
			default:
				Destino.textContent += myJson.mensaje + "\n";
				console.log(myJson.evento + ' Resposta = ' + myJson.mensaje);
				break;
		}
	});
	Comando.value = '';
}

function enviarURL(url){
	esperandoResposta.innerHTML = 'esperando Resposta...';
	estado = url;
	console.log(url);
	fetch(url)
	.then(function(response) {
		esperandoResposta.innerHTML = '';
		return response.json();
		})
	.then(function(myJson) {
		Destino.textContent += myJson.mensaje ;
		if (!String(myJson.mensaje).match(/\$/g)) {
			enviarURL('ouvir'); 
		} 
	}).catch(function(error) {
	  console.log('Hubo un problema con la petición Fetch:' + error.message);
	});		
}

function enviarApretado(){
	var url = Origen.value;
	console.log(url);
	fetch(url).then(function(response) {
		response.text().then(function(text) {
			Destino.textContent += text + "\n";
		});
	});	
}

function ouvir(){
	var salir = false;
	var url = '';
	switch (estado) {
		case 'ready':
			url = 'listo';
			break;
		default :
			url = 'ouvir';
			break;
	}
	
	console.log(url);
	fetch(url)
		.then(function(response) {
			return response.json();
		})
		.then(function(myJson) {
			console.log('Resposta = ' + myJson.mensaje);
			switch (myJson.evento) {
				case 'banner':
					Destino.textContent = myJson.mensaje ;
					ouvir();
					break;
				case 'keyboard-interactive':
					Destino.textContent += myJson.mensaje ;
					Comando.style.display = "block";
					estado = 'myJson.mensaje';
					break;
				case 'ready':
					Destino.textContent += myJson.mensaje + "\n" ;
					estado = 'ready';
					if (myJson.mensaje.match(/close/g)){
						estado = 'fin';
						console.log('estado = fin');
					} else if (!myJson.mensaje.match(/\$/g)) { 
						ready();
					}
					break;
				case 'error':
					Destino.textContent += myJson.mensaje + "\n";
					break;
				default :
					alert(myJson.evento);
					salir = true;
					break;
			}
		});
}

function ready(){
	console.log('listo');
	fetch('listo').then(function(response) { 
		response.text().then(function(text) {
			console.log('Resposta = ' + text);
			Destino.textContent += text ;
			if (text.match(/close/g)){
				estado = 'fin';
				console.log('estado = fin');
			} else if (!text.match(/\$/g)) { 
				ready();
			}	
		});
	});
}