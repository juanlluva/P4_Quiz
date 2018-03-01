
const figlet = require('figlet');
const chalk = require('chalk');

const colortext = (msg,color) => {
	if (typeof color !== "undefined") {
		msg = chalk[color].bold(msg);
	}
	return msg;
};

const log = (msg, color) => {
	console.log(colortext(msg,color));
};

const biglog = (msg, color) => {
	log(figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};

const errorlog = (errmsg) => {
	console.log(`${colortext("Error",'red')}: ${colortext(colortext(errmsg,'red'), "bgYellowBright")}`);
};


exports = module.exports = {
	colortext,
	log,
	biglog,
	errorlog
};