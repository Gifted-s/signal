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
const dotenv_1 = __importDefault(require("dotenv"));
const database_service_1 = require("./services/database.service");
const notify_service_1 = require("./services/notify.service");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 8000;
(0, database_service_1.connectToDatabase)().then(() => {
    app.get('/', (req, res) => {
        res.send('Express + TypeScript Server');
    });
    app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            let user = req.body;
            user.createdAt = new Date();
            const userExist = (yield ((_a = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _a === void 0 ? void 0 : _a.findOne({ phone: user.phone })));
            if (!userExist) {
                const result = yield ((_b = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _b === void 0 ? void 0 : _b.insertOne(user));
                return result
                    ? res.status(200).send({ message: `Successfully created a new user with id ${result.insertedId}` })
                    : res.status(500).send({ message: "Failed to create a new user." });
            }
            return res.status(200).send({ message: `User already exist`, alreadyExist: true });
        }
        catch (error) {
            console.error(error);
            res.status(400).send({ message: error.message });
        }
    }));
    app.post('/sendNotification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _c, _d;
        try {
            let sender = req.body;
            sender.createdAt = new Date();
            yield ((_c = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.senders) === null || _c === void 0 ? void 0 : _c.insertOne(sender));
            const users = (yield ((_d = database_service_1.collections === null || database_service_1.collections === void 0 ? void 0 : database_service_1.collections.users) === null || _d === void 0 ? void 0 : _d.find({}).toArray())) || [];
            let tokens = [];
            for (let user of users) {
                tokens.push(user.deviceToken);
            }
            let response = yield (0, notify_service_1.sendPushNotification)(tokens);
            if (response.sent) {
                res.status(200).send({ status: "success" });
            }
        }
        catch (error) {
            res.status(500).send(error.message);
        }
    }));
    app.listen(port, () => {
        console.log(`[server]: Server is up and running at http://localhost:${port}`);
    });
})
    .catch(err => {
    console.log(err);
});
