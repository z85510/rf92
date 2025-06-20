"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonLogger = void 0;
const common_1 = require("@nestjs/common");
let JsonLogger = class JsonLogger {
    log(level, message, context) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...(context && { context }),
        };
        console.log(JSON.stringify(logEntry));
    }
    debug(message, context) {
        this.log('debug', message, context);
    }
    info(message, context) {
        this.log('info', message, context);
    }
    warn(message, context) {
        this.log('warn', message, context);
    }
    error(message, context) {
        this.log('error', message, context);
    }
};
exports.JsonLogger = JsonLogger;
exports.JsonLogger = JsonLogger = __decorate([
    (0, common_1.Injectable)()
], JsonLogger);
//# sourceMappingURL=json-logger.service.js.map