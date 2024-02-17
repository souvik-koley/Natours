const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log("UNCAUGHT EXCEPTION! Shutting down....");
    console.log(err.name, err.message);
    process.exit(1);
});


dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
}).then(() => {
    // console.log(con.connections);
    console.log("Database connected successfully");
});


// const testTour = new Tour({
//     name: "The Park Camper",
//     rating: 4.7,
//     price: 100
// });

// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log("ERROR : ", err);
// })


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
    console.log("UNHANDLER REJECTION ! Shutting down....");
    console.log(err.name, err.message);
    // console.log(err);

    server.close(() => {
        process.exit(1);
    });
})

