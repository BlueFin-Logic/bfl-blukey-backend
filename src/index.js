const AppContext = require("./common/appContext");
const setupConnection = require("./config/setup-connection");

const appContext = new AppContext();

setupConnection(appContext)