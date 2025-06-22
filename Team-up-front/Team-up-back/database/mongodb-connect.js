const mongoose = require('mongoose');

const connectMongoDatabase = async () => {
	mongoose.set('strictQuery', true);

	const connected = await mongoose.connect(
		'mongodb+srv://lukakharkhelaur:luka@team-up.jhu5p.mongodb.net/'
	);

	console.log((`Mongo Connected: ${connected.connection.host}`));
};

module.exports = connectMongoDatabase;