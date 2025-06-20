"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        this.value = value;
    }
    static of(raw) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw))
            throw new Error('Invalid email');
        return new Email(raw.toLowerCase());
    }
}
exports.Email = Email;
//# sourceMappingURL=email.vo.js.map