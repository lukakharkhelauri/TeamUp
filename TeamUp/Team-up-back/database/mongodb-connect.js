const mongoose = require('mongoose');

const connectMongoDatabase = async () => {
	mongoose.set('strictQuery', true);

	const connected = await mongoose.connect(
		'mongodb+srv://lukakharkhelaur:ia39SNgGRzOzw9aG@team-up.vjuyw.mongodb.net/'
	);

	console.log((`Mongo Connected: ${connected.connection.host}`));
};

module.exports = connectMongoDatabase;