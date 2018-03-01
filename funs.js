
const model = require('./model');

const {log,biglog,errorlog,colortext} = require('./out');

exports.helpfun = rl => {
	log("Comandos: ");
	log("  h|help - Muestra esta ayuda.");
	log("  list - Listar los quizzes existentes.");
	log("  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	log("  add - Añadir un nuevo quiz interactivamente.");
	log("  delete <id> - Borrar el quiz indicado.");
	log("  edit <id> - Editar el quiz indicado.");
	log("  test <id> - Probar el quiz indicado. ");
	log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	log("  credits - Créditos. ");
	log("  q|quit - Salir del programa.");
	rl.prompt();
};

exports.quitfun = rl => {
	rl.close();
};

exports.showfun = (rl,id) => {
	if(typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
	} else {
		try{
			const quiz = model.getByIndex(id);
			log(`[${colortext(id, 'magenta')}]: ${quiz.question} ${colortext("=>",'magenta')} ${quiz.answer}`);

		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.addfun = rl => {
	rl.question(colortext(' Introduzca una pregunta: ', 'red'), question => {
		rl.question(colortext('Introduzca la respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(`${colortext('Se ha añadido', 'magenta')}: ${question}  ${colortext("=>",'magenta')} ${answer}`);
			rl.prompt();
		});
	});
} ;

exports.deletefun = (rl, id) => {
	if(typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
	} else {
		try{
			model.deleteByIndex(id);
		} catch(error) {
			errorlog(error.message);
		}
	}

	rl.prompt();
};

exports.editfun = (rl, id) => {
	if(typeof id === "undefined"){
		errorlog(`Falta el parametro id.`);
		rl.prompt();
	} else {
		try{
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);

			rl.question(colortext ('Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);
				rl.question(colortext('Introduzca la respuesta: ', 'red'), answer => {
					model.update(id, question, answer);
					log(`Se ha cambiado el quiz ${colortext(id,'magenta')} por: ${question} ${colortext("=>",'magenta')} ${answer}`);
					rl.prompt();
				});	
			});
		} catch (error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
};

exports.testfun = (rl, id) => {
    if(typeof id === "undefined"){
        errorlog(`Falta el parametro id.`);
        rl.prompt();
    } else {
    	try{
            const quiz = model.getByIndex(id);
            rl.question(colortext(`${quiz.question} ? `, 'red'), answer => {
                //let args = answer.split(" ");
                //let answer1 = args[0].toLowerCase().trim();
            	if( answer.toLowerCase().trim() === (quiz.answer).toLowerCase().trim()){
                    log('Su respuesta es correcta');
            		biglog('Correcta','green');
				} else {
            		log('Su respuesta es incorrecta');
					biglog('Incorrecta','green');
				}
				rl.prompt();
			});
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
		}
    }
};

exports.creditsfun = rl => {
	log("Autores de la practica:");
	log("Juan Lluva","green");
	rl.prompt();
};

exports.playfun = rl => {
	let score = 0;
	let toBeAsked = [];
    model.getAll().forEach((quiz,id) => {
        toBeAsked[id] = quiz;
    });
	const playloop = () => {
        if (toBeAsked.length === 0) {
            log('No hay nada más que preguntar.');
            log(`Fin del juego. Aciertos: ${score}`);
        	biglog(score,'magenta');
            rl.prompt();
        } else {
            let id = Math.floor(Math.random() * toBeAsked.length);
            let quiz = toBeAsked[id];
            rl.question(colortext(`${quiz.question} ? `, 'red'), answer => {
                if( answer.toLowerCase().trim() === (quiz.answer).toLowerCase().trim()){
                	log(`CORRECTO - Lleva ${++score} aciertos`);
                	playloop();
                } else {
                    log('INCORRECTO.');
                    log(`Fin del juego. Aciertos: ${score}`);
                    biglog(score,'magenta');
                    rl.prompt();
                }
            });
            toBeAsked.splice(id, 1);
        }
    };
    playloop();
};

exports.listfun = rl => {
	model.getAll().forEach((quiz,id) => {
		log(`[${colortext(id, 'magenta')}]: ${quiz.question} `);
	});
	rl.prompt();
};
