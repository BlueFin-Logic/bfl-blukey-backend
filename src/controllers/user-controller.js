const UserHandler = require('../handlers/user-handler')
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

            let userHandler = new UserHandler();
            let result = await userHandler.getAll(page, limit)
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

            let userHandler = new UserHandler();

            // Only user can get data yourseft or admin
            const currentUserId = req.currentUserId;
            const is_admin = req.currentUserRole;
            if (currentUserId !== id && !is_admin) return res.status(STATUS_FORBIDDEN).json(Utilities.responseSimple('You do not permission to access!'));

            let result = await userHandler.getById(id)
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

            let userHandler = new UserHandler();
            let result = await userHandler.addItem(body)
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

            let userHandler = new UserHandler();
            let result = await userHandler.updateItem(id, body)
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

            let userHandler = new UserHandler();
            let result = await userHandler.deleteItem(id)
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

            let userHandler = new UserHandler();
            let result = await userHandler.addItem(body)
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
            let userHandler = new UserHandler();
            let result = await userHandler.ping()
            console.log(result);
            return res.status(STATUS_OK).json(result)
        } catch (err) {
            console.log(err);
            return res.status(STATUS_BAD_REQUEST).json(err)
        }
    }
}
module.exports = new UserController();