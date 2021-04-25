const UserService = require('../services/userService')
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST } = require('../common/statusResponse')

// Get All Users
module.exports.userListController = async (req, res) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        let userService = new UserService();
        
        let result = await userService.getAll(page, limit)
        console.log(result);
        return res.status(STATUS_OK).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}

// Get User By ID
module.exports.userGetByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        let userService = new UserService();
        
        let result = await userService.getById(id)
        console.log(result);
        return res.status(STATUS_OK).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}

// Create user
module.exports.userCreateController = async (req, res) => {
    try {
        const body = req.body;
        let userService = new UserService();
        
        let result = await userService.addItem(body)
        console.log(result);
        return res.status(STATUS_CREATED).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}

// Update user
module.exports.userUpdateController = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        let userService = new UserService();
        
        let result = await userService.updateItem(id, body)
        console.log(result);
        return res.status(STATUS_CREATED).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}

// Delete user
module.exports.userDeleteController = async (req, res) => {
    try {
        const id = req.params.id;
        let userService = new UserService();
        
        let result = await userService.deleteItem(id)
        console.log(result);
        return res.status(STATUS_OK).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}