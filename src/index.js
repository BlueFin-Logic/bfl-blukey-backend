const AppContext = require("./common/appContext");
const setupConnection = require("./middleware/setup-connection");

let appContext = new AppContext();

appContext = setupConnection(appContext);