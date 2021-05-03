const UserService = require('../services/userService')
const { Utilities } = require('../common/utilities')
const { STATUS_OK, STATUS_CREATED, STATUS_BAD_REQUEST, STATUS_FORBIDDEN } = require('../common/statusResponse')

class UserController {
    // Get All Users
    async list(req, res, next) {
        try {
            const page = Utilities.parseInt(req.query.page, 1);
            const limit = Utilities.parseInt(req.query.limit, 10);

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
    async getByID(req, res, next) {
        try {
            const id = Utilities.parseInt(req.params.id, 1);

            let userService = new UserService();

            // Only user can get data yourseft or admin
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
    async create(req, res, next) {
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
    async update(req, res, next) {
        try {
            const body = req.body;
            const id = Utilities.parseInt(req.params.id, 1);

            // Only user can edit data yourseft or admin
            const currentUserId = req.currentUserId;
            const is_admin = req.currentUserRole;
            if (currentUserId !== id && !is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

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
    async delete(req, res, next) {
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

    // Register user
    async register(req, res, next) {
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

    // Ping user
    async ping(req, res, next) {
        try {
            let userService = new UserService();
            let result = await userService.ping()
            console.log(result);
            return res.status(STATUS_OK).json(result)
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}
module.exports = new UserController();