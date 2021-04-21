const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require( "dotenv");
dotenv.config();
const port = process.env.SERVER_PORT;

// accept parse json from body
app.use(bodyParser.json())

// define a route handler for the default home page
app.get( "/ping", ( req, res ) => {
    res.send( "pong" );
} );

const {routes} = require( "./routes/index");
app.use(routes)

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );