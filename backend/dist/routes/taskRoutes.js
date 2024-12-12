"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// Wrapper function to handle async route handlers
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
        .catch(next);
};
// All task routes require authentication
router.post('/', authMiddleware_1.requireAuth, asyncHandler(taskController_1.createTask));
router.get('/', authMiddleware_1.requireAuth, asyncHandler(taskController_1.getTasks));
router.get('/:id', authMiddleware_1.requireAuth, asyncHandler(taskController_1.getTaskById));
router.put('/:id', authMiddleware_1.requireAuth, asyncHandler(taskController_1.updateTask));
router.delete('/:id', authMiddleware_1.requireAuth, asyncHandler(taskController_1.deleteTask));
exports.default = router;
