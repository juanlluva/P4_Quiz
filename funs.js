
const {models} = require('./model');

const {log,biglog,errorlog,colortext} = require('./out');

const Sequelize = require('sequelize');


exports.helpfun = (rl, socket) => {
	log(socket, "Comandos: ");
	log(socket, "  h|help - Muestra esta ayuda.");
	log(socket, "  list - Listar los quizzes existentes.");
	log(socket, "  show <id> - Muestra la pregunta y la respuesta el quiz indicado.");
	log(socket, "  add - Añadir un nuevo quiz interactivamente.");
	log(socket, "  delete <id> - Borrar el quiz indicado.");
	log(socket, "  edit <id> - Editar el quiz indicado.");
	log(socket, "  test <id> - Probar el quiz indicado. ");
	log(socket, "  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
	log(socket, "  credits - Créditos. ");
	log(socket, "  q|quit - Salir del programa.");
	rl.prompt();
};

exports.quitfun = (rl, socket) => {
	rl.close();
	socket.end();
};

// Devuelve una Promesa que valida que el id es correcto
const validateId = (id, socket) => {
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
exports.showfun = (rl,id, socket) => {
	validateId(id)
		.then(id => models.quiz.findById(id))
		.then(quiz => {
			if(!quiz) {
				throw new Error(`No existe un quiz asociado al id = ${id}.`)
			}
            log(socket, `[${colortext(id, 'magenta')}]: ${quiz.question} ${colortext("=>",'magenta')} ${quiz.answer}`);
        })
		.catch(error => {
			errorlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
};
// Nueva funcion para hacer pregunta con promesas
const makeQuestion = (rl,text, socket) => {
	return new Sequelize.Promise((resolve, reject) => {
		rl.question(colortext(text,'red'), answer => {
			resolve(answer.trim());
		});
	});
};


exports.addfun = (rl, socket) => {
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
            log(socket, `${colortext('Se ha añadido', 'magenta')}: ${quiz.question}  ${colortext("=>",'magenta')} ${quiz.answer}`)
        })
		.catch(Sequelize.ValidationError, error => {
			errorlog(socket, 'El quiz es erroneo: ');
			error.errors.forEach(({message}) => errorlog(message));
		})
		.catch(error => {
			errorlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.deletefun = (rl, id, socket) => {
	validateId(id)
		.then(id => models.quiz.destroy({where: {id}}))
		.catch(error => {
			errorlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.editfun = (rl, id, socket) => {
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
            log(socket, `Se ha cambiado el quiz ${colortext(id,'magenta')} por: ${quiz.question} ${colortext("=>",'magenta')} ${quiz.answer}`);
		})
		.catch(Sequelize.ValidationError, error => {
			errorlog(socket, 'El quiz es erroneo: ');
			error.errors.forEach(({message}) => errorlog(message));
		})
		.catch(error => {
			errorlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
};

exports.testfun = (rl, id, socket) => {
    validateId(id)
		.then(id => models.quiz.findById(id))
		.then(quiz => {
            if (!quiz) {
                throw new Error (`No existe un quiz asociado al id = ${id}.`);
            }
            return makeQuestion(rl, `${quiz.question} ?  `)
				.then(a => {
					if (a.toLowerCase().trim() === quiz.answer.toLowerCase().trim()){
						log(socket, 'Correcta', 'green');
					} else {
						log(socket, 'Incorrecta', 'green');
					}
				});
		})
		.catch(Sequelize.ValidationError, error => {
            errorlog(socket, 'El quiz es erroneo: ');
            error.errors.forEach(({message}) => errorlog(message));
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });

};

exports.creditsfun = (rl, socket) => {
	log(socket, "Autores de la practica:");
	log(socket, "Juan Lluva","green");
	rl.prompt();
};



exports.playfun = (rl, socket) => {

    let score = 0;

    let toBePlayed = [];

    models.quiz.findAll()
        .each(quiz => {
            toBePlayed.push(quiz);
        })

        .then(() => {
            playOne();
        })


    const playOne = () => {

        if(toBePlayed.length <= 0) {
            log(socket, 'No hay mas preguntas.');
            log(socket, `Fin del juego. Aciertos: ${score}`);
            return;
        } else{
            let pos = Math.floor(Math.random()*toBePlayed.length);
            let quiz = toBePlayed[pos];
            toBePlayed.splice(pos,1);

            return makeQuestion(rl, `${quiz.question} ? `)
                .then(answer => {
                    if(answer.toLowerCase().trim() == quiz.answer.toLowerCase().trim()) {
                        log(`socket, CORRECTO - Lleva ${++score} aciertos`,'yellow');
                        playOne();
                    } else {
                        log(socket, 'INCORRECTO.', 'yellow');
                        log(`Fin del juego. Aciertos: ${score}`,'yellow');
                    }
                })

                .catch(error => {
                    errorlog(socket, error.message);
                })
                .then(() => {

                    rl.prompt();
                });
        }
    };

};

exports.listfun = (rl, socket) => {
	models.quiz.findAll()
		.each(quiz => {
			log(socket, `[${colortext(quiz.id, 'magenta')}]: ${quiz.question}`);
		})
		.catch(error => {
			errorlog(socket, error.message);
		})
		.then(() => {
			rl.prompt();
		});
};


