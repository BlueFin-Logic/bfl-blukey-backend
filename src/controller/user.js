const UserService = require('../services/userService')
const { Utilities } = require('../common/utilities')
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, STATUS_FORBIDDEN } = require('../common/statusResponse')

// Get All Users
module.exports.userListController = async (req, res) => {
    try {
        const page = Utilities.parseInt(req.query.page,1);
        const limit = Utilities.parseInt(req.query.limit,10);

        // Only admin can get all
        const is_admin = req.currentUserRole;
        if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

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
        const id = Utilities.parseInt(req.params.id,1);

        let userService = new UserService();

        // Only user can get data yourseft or oly admin
        const currentUserId = req.currentUserId;
        const is_admin = req.currentUserRole;
        if (currentUserId !== id && !is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

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

        // Only admin can create
        const is_admin = req.currentUserRole;
        if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

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
        const id = Utilities.parseInt(req.params.id,1);

        // Only user can edit data yourseft
        const currentUserId = req.currentUserId;
        if (currentUserId !== id) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

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

        // Only admin can delete
        const is_admin = req.currentUserRole;
        if (!is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

        let userService = new UserService();
        let result = await userService.deleteItem(id)
        console.log(result);
        return res.status(STATUS_OK).json(result)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}

// Ping user
module.exports.userPingController = async (req, res) => {
    try {
        let check = {
            id: req.currentUserId,
            role: req.currentUserRole
        }
        console.log(check);
        return res.status(STATUS_OK).json(check)
    } catch (err) {
        console.log(err);
        return res.status(STATUS_BAD_REQUEST).json(err)
    }
}