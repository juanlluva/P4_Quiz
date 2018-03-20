

const readline = require('readline');

const {log,biglog,errorlog,colortext} = require('./out');

const funs = require("./funs");

const net = require('net');

const server = net.createServer(socket => {

	console.log(`Se ha conectado un cliente desde ${socket.remoteAdress}`);

	// Hello message 
	biglog(socket, 'CORE Quiz', 'green');

	const rl = readline.createInterface({
	  input: socket,
	  output: socket,
	  prompt: colortext('quiz > ','blue'),
	  completer: (line) => {
	  	const completions = 'h help add delete edit list p play credits q quit'.split(' ');
	  	const hits = completions.filter((c) => c.startsWith(line));
	  	return [hits.length ? hits : completions, line];
	  }
	});

	socket
	.on("end", () => {rl.close();})
	.on("error", () => {rl.close();});

	rl.prompt();

	rl.on('line', (line) => {

		let args = line.split(" ");
		let cmd = args[0].toLowerCase().trim();

		switch (cmd) {
		  	case '': 
		  		rl.prompt(rl);
		  		break;
		    case 'h':
		    case 'help':
		    	funs.helpfun(rl, socket);
				break;
		    case 'q':
		    case 'quit':
		    	funs.quitfun(rl, socket);
		    	break;
		    case 'list' :
		    	funs.listfun(rl, socket);
		    	break;
		    case 'show' : 
		    	funs.showfun(rl, args[1], socket);
		    	break;
		    case 'add':
		    	funs.addfun(rl, socket);
		    	break;
		    case 'delete':
		    	funs.deletefun(rl, args[1], socket);
		    	break;
		    case 'edit':
		    	funs.editfun(rl, args[1], socket);
		    	break;
		    case 'test':
				funs.testfun(rl, args[1], socket);
				break;
			case 'p':
			case'play':
				funs.playfun(rl, socket);
				break;
			case 'credits':
				funs.creditsfun(rl, socket);
				break;
		    default:
				log(socket,`Comando desconocido: '${colortext(cmd,'red')}'`);
				log(socket,`Use ${colortext('help','green')} para ver todos los comandos disponibles.`);
				rl.prompt();
				break;
		}
	})
	.on('close', () => {
	  log(socket,'Adios!');
	  //process.exit(0);
	});


});

server.listen(3030);