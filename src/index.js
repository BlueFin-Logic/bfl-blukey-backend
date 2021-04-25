const express = require("express");
const app = express();
const routes = require( "./routes/index");
const dotenv = require( "dotenv");
dotenv.config();
const port = process.env.SERVER_PORT;

// body parse
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// check connection
app.get( "/ping", ( req, res ) => {
    res.send( "pong" );
} );

// user routes index
app.use(routes)

// start the Express server
app.listen( port, () => {
    console.log( `server started at http://localhost:${ port }` );
} );