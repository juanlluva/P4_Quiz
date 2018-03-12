
const {models} = require('./model');

const {log,biglog,errorlog,colortext} = require('./out');

const Sequelize = require('sequelize');


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
// Devuelve una Promesa que valida que el id es correcto
const validateId = id => {
	return new Sequelize.Promise((resolve, reject) => {
        if(typeof id === "undefined") {
            reject(new Error(`Falta el parametro <id>.`));
        } else{
        	id = parseInt(id);
        	if(Number.isNaN(id)) {
        		reject(new Error(`El valor del parámetro <id> no es un numero.`));
			} else {
        		resolve(id);
			}
		}
	});
};
exports.showfun = (rl,id) => {
	validateId(id)
		.then(id => models.quiz.findById(id))
		.then(quiz => {
			if(!quiz) {
				throw new Error(`No existe un quiz asociado al id = ${id}.`)
			}
            log(`[${colortext(id, 'magenta')}]: ${quiz.question} ${colortext("=>",'magenta')} ${quiz.answer}`);
        })
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
};
// Nueva funcion para hacer pregunta con promesas
const makeQuestion = (rl,text) => {
	return new Sequelize.Promise((resolve, reject) => {
		rl.question(colortext(text,'red'), answer => {
			resolve(answer.trim());
		});
	});
};


exports.addfun = rl => {
	makeQuestion(rl, 'Introduzca una pregunta: ')
		.then (q => {
			return makeQuestion(rl, 'Introduzca una respuesta: ')
				.then (a => { //Este then esta anidado para poder acceder a q
					return {question: q, answer: a};
				});
		})
		.then(quiz => {
			return models.quiz.create(quiz);
		})
		.then((quiz) => {
            log(`${colortext('Se ha añadido', 'magenta')}: ${quiz.question}  ${colortext("=>",'magenta')} ${quiz.answer}`)
        })
		.catch(Sequelize.ValidationError, error => {
			errorlog('El quiz es erroneo: ');
			error.errors.forEach(({message}) => errorlog(message));
		})
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.deletefun = (rl, id) => {
	validateId(id)
		.then(id => models.quiz.destroy({where: {id}}))
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.editfun = (rl, id) => {
	validateId(id)
		.then(id => models.quiz.findById(id))
		.then (quiz => {
			if (!quiz) {
				throw new Error (`No existe un quiz asociado al id = ${id}.`);
			}
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			return makeQuestion(rl, 'Introduzca la pregunta: ')
				.then (q => {
					process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
					return makeQuestion(rl, 'Introduzca la respuesta: ')
						.then(a => {
							quiz.question = q;
							quiz.answer = a;
							return quiz;
						});
				});
		})
		.then(quiz => {
			return quiz.save();
		})
		.then(quiz => {
            log(`Se ha cambiado el quiz ${colortext(id,'magenta')} por: ${quiz.question} ${colortext("=>",'magenta')} ${quiz.answer}`);
		})
		.catch(Sequelize.ValidationError, error => {
			errorlog('El quiz es erroneo: ');
			error.errors.forEach(({message}) => errorlog(message));
		})
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.testfun = (rl, id) => {
    validateId(id)
		.then(id => models.quiz.findById(id))
		.then(quiz => {
            if (!quiz) {
                throw new Error (`No existe un quiz asociado al id = ${id}.`);
            }
            return makeQuestion(rl, `${quiz.question} ?  `)
				.then(a => {
					if (a.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
						log('Correcta', 'green');
					} else {
						log('Incorrecta', 'green');
					}
				});
		})
		.catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erroneo: ');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });

};

exports.creditsfun = rl => {
	log("Autores de la practica:");
	log("Juan Lluva","green");
	rl.prompt();
};

exports.playfun = rl => {
	let score = 0;
	let alreadyAsked = [];
	const playloop = () => {
		const whereOpt = {'id' : {[Sequelize.Op.notIn]: alreadyAsked}};
		return models.quiz.count({where: whereOpt})
			.then(function (count) {
				return models.quiz.findAll({
					where: whereOpt,
					offset: Math.floor(Math.random() * count),
					limit: 1
				});
            })
			.then(quizzes => quizzes[0])
			.then(quiz => {
				if(!quiz) {
					log('No hay nada más que preguntar. ');
                    log(`Fin del juego.`);
                    rl.prompt();
					return;
				}

				alreadyAsked.push(quiz.id);

				return makeQuestion(rl, `${quiz.question} ? `)
                    .then(a => {
                        if (a.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
                            log(`CORRECTO - Lleva ${++score} aciertos`);
                            playloop();
                        } else {
                            log('INCORRECTO.');
                            log(`Fin del juego. Aciertos: ${score}`);
                            rl.prompt();
                        }
                    });
			})
            .catch(error => {
                errorlog(error.message);
            });
		/*
            .then(() => {
                rl.prompt();
            });
            */
    };
    playloop();
};


exports.listfun = rl => {
	models.quiz.findAll()
		.each(quiz => {
			log(`[${colortext(quiz.id, 'magenta')}]: ${quiz.question}`);
		})
		.catch(error => {
			errorlog(error.message);
		})
		.then(() => {
            log(`Aciertos: ${score}`);
			rl.prompt();
		});
};


