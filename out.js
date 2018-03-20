
const figlet = require('figlet');
const chalk = require('chalk');


const colortext = (msg,color) => {
	if (typeof color !== "undefined") {
		msg = chalk[color].bold(msg);
	}
	return msg;
};

const log = (socket, msg, color) => {
	socket.write(colortext(msg,color) + "\n" );
};

const biglog = (socket, msg, color) => {
	log(socket,figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};

const errorlog = (socket, errmsg) => {
	socket.write(`${colortext("Error",'red')}: ${colortext(colortext(errmsg,'red'), "bgYellowBright")} \n`);
};


exports = module.exports = {
	colortext,
	log,
	biglog,
	errorlog
};