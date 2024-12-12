"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.getTasks = exports.createTask = void 0;
const database_1 = __importDefault(require("../config/database"));
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.userId;
    const task = yield database_1.default.task.create({
        data: {
            title,
            description,
            status: status || 'TODO',
            priority: priority || 1,
            dueDate,
            userId
        }
    });
    return res.status(201).json({
        message: 'Task created successfully',
        task
    });
});
exports.createTask = createTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { status, priority } = req.query;
    const tasks = yield database_1.default.task.findMany({
        where: Object.assign(Object.assign({ userId }, (status && { status: status })), (priority && { priority: Number(priority) })),
        orderBy: { createdAt: 'desc' }
    });
    return res.json({
        message: 'Tasks retrieved successfully',
        tasks
    });
});
exports.getTasks = getTasks;
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    const task = yield database_1.default.task.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({
        message: 'Task retrieved successfully',
        task
    });
});
exports.getTaskById = getTaskById;
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;
    const userId = req.user.userId;
    // First, verify the task belongs to the user
    const existingTask = yield database_1.default.task.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
    }
    const updatedTask = yield database_1.default.task.update({
        where: { id },
        data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (title && { title })), (description && { description })), (status && { status })), (priority && { priority })), (dueDate && { dueDate }))
    });
    return res.json({
        message: 'Task updated successfully',
        task: updatedTask
    });
});
exports.updateTask = updateTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.user.userId;
    // First, verify the task belongs to the user
    const existingTask = yield database_1.default.task.findFirst({
        where: {
            id,
            userId
        }
    });
    if (!existingTask) {
        return res.status(404).json({ message: 'Task not found' });
    }
    yield database_1.default.task.delete({
        where: { id }
    });
    return res.json({
        message: 'Task deleted successfully'
    });
});
exports.deleteTask = deleteTask;
// Add global error handling middleware in index.ts
