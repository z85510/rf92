"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(id, email, passwordHash) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
    }
    static create(id, email, hash) {
        return new User(id, email, hash);
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map