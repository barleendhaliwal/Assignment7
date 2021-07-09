"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
var cors = require('cors');
app.use(cors());
//Body Parser Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
const PORT = 3000;
// define a route handler for the default home page
app.use('/api', require('./routes/api.js'));
// start the Express server
app.listen(PORT, () => {
    console.log(`${PORT}`);
});
//# sourceMappingURL=index.js.map