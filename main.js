
const readline = require('readline');

const {log,biglog,errorlog,colortext} = require('./out');

const funs = require("./funs");


// Hello message 
biglog('CORE Quiz', 'green');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: colortext('quiz > ','blue'),
  completer: (line) => {
  	const completions = 'h help add delete edit list p play credits q quit'.split(' ');
  	const hits = completions.filter((c) => c.startsWith(line));
  	return [hits.length ? hits : completions, line];
  }
});

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
	    	funs.helpfun(rl);
			break;
	    case 'q':
	    case 'quit':
	    	funs.quitfun(rl);
	    	break;
	    case 'list' :
	    	funs.listfun(rl);
	    	break;
	    case 'show' : 
	    	funs.showfun(rl, args[1]);
	    	break;
	    case 'add':
	    	funs.addfun(rl);
	    	break;
	    case 'delete':
	    	funs.deletefun(rl, args[1]);
	    	break;
	    case 'edit':
	    	funs.editfun(rl, args[1]);
	    	break;
	    case 'test':
			funs.testfun(rl, args[1]);
			break;
		case 'p':
		case'play':
			funs.playfun(rl);
			break;
		case 'credits':
			funs.creditsfun(rl);
			break;
	    default:
			log(`Comando desconocido: '${colortext(cmd,'red')}'`);
			log(`Use ${colortext('help','green')} para ver todos los comandos disponibles.`);
			rl.prompt();
			break;
	}
})
.on('close', () => {
  log('Adios!');
  process.exit(0);
});
