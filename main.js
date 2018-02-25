
const readline = require('readline');

console.log("CORE Quiz");


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'quiz> '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
  	case '': 
  		break;
    case 'h':
    case 'help':
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
    	break;

    case 'q':
    case 'quit':
    	rl.close();
    	break;
    case 'list' :
    	console.log("Listar los quizzes existentes.");
    	break;
    case 'show' : 
    	console.log("Muestra la pregunta y la respuesta el quiz indicado.");
    	break;
    case 'add':
    	console.log("Añadir un nuevo quiz interactivamente.");
    	break;
    case 'delete':
    	console.log("  delete <id> - Borrar el quiz indicado.");
    	break;
    case 'edit':
    	console.log("  edit <id> - Editar el quiz indicado.");
    	break;
    case 'test':
		console.log("  test <id> - Probar el quiz indicado. ");
		break;
	case 'p':
	case'play':
		console.log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
		break;
	case 'credits':
		console.log("Autores de la practica:");
		console.log("Juan Lluva");
		break;
    default:
		console.log(`Comando desconocido: '${line.trim()}'`);
		console.log("Use help para ver todos los comandos disponibles.");
		break;
  }
  rl.prompt();
})
.on('close', () => {
  console.log('Adios!');
  process.exit(0);
});