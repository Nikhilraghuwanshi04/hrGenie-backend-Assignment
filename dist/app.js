"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const docRoutes_1 = __importDefault(require("./routes/docRoutes"));
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(limiter);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/documents', docRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Collaborative Editor API is running...');
});
exports.default = app;
