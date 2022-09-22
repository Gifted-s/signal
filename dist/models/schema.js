"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sender = exports.User = void 0;
// Class Implementation
class User {
    constructor(phone, deviceToken, createdAt, id) {
        this.phone = phone;
        this.deviceToken = deviceToken;
        this.createdAt = createdAt;
        this.id = id;
    }
}
exports.User = User;
class Sender {
    constructor(phone, createdAt, id) {
        this.phone = phone;
        this.createdAt = createdAt;
        this.id = id;
    }
}
exports.Sender = Sender;
