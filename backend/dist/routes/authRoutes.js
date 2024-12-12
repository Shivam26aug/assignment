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
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authController_1.register)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, authController_1.login)(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// Example of a protected route
router.get('/admin-only', authMiddleware_1.requireAuth, authMiddleware_1.requireAdmin, (req, res) => {
    res.json({ message: 'Welcome, admin!' });
});
// Example of an authenticated user route
router.get('/profile', authMiddleware_1.requireAuth, (req, res) => {
    const user = req.user;
    res.json({ message: 'Protected route', userId: user.userId });
});
exports.default = router;
