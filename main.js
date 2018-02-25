
const readline = require('readline');

console.log("CORE Quiz");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> '
});

rl.prompt();

rl.on('line', (line) => {

	let args = line.split(" ");
	let cmd = args[0].toLowerCase().trim();

	switch (cmd) {
	  	case '': 
	  		rl.prompt();
	  		break;
	    case 'h':
	    case 'help':
	    	helpfun();
			break;
	    case 'q':
	    case 'quit':
	    	quitfun();
	    	break;
	    case 'list' :
	    	listfun();
	    	break;
	    case 'show' : 
	    	showfun(args[1]);
	    	break;
	    case 'add':
	    	addfun();
	    	break;
	    case 'delete':
	    	deletefun(args[1]);
	    	break;
	    case 'edit':
	    	editfun(args[1]);
	    	break;
	    case 'test':
			testfun(args[1]);
			break;
		case 'p':
		case'play':
			playfun();
			break;
		case 'credits':
			creditsfun();
			break;
	    default:
			console.log(`Comando desconocido: '${cmd}'`);
			console.log("Use help para ver todos los comandos disponibles.");
			rl.prompt();
			break;
	}
})
.on('close', () => {
  console.log('Adios!');
  process.exit(0);
});


const helpfun = () => {
	console.log("Comandos: ");
	console.log("  h|help - Muestra esta ayuda.");
	console.log("  list - Listar los quizzes existentes.");
	console.log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	console.log("  add - Añadir un nuevo quiz interactivamente.");
	console.log("  delete <id> - Borrar el quiz indicado.");
	console.log("  edit <id> - Editar el quiz indicado.");
	console.log("  test <id> - Probar el quiz indicado. ");
	console.log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	console.log("  credits - Créditos. ");
	console.log("  q|quit - Salir del programa.");
	rl.prompt();
}

const quitfun = () => {
	rl.close();
	rl.prompt();
}

const showfun = () => {
	console.log("Muestra la pregunta y la respuesta el quiz indicado.");
	rl.prompt();
}

const addfun = () => {
	console.log("Añadir un nuevo quiz interactivamente.");
	rl.prompt();
}

const deletefun = id => {
	console.log("  delete <id> - Borrar el quiz indicado.");
	rl.prompt();
}

const editfun = id => {
	console.log("  edit <id> - Editar el quiz indicado.");
	rl.prompt();
}

const testfun = id => {
	console.log("  test <id> - Probar el quiz indicado. ");
	rl.prompt();
}

const creditsfun = () => {
	console.log("Autores de la practica:");
	console.log("Juan Lluva");
	rl.prompt();
}

const playfun = () => {
	console.log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	rl.prompt();
}

const listfun = () => {
	console.log("Listar los quizzes existentes.");
	rl.prompt();
}