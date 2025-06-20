"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User email address',
        example: 'john.doe@example.com',
        format: 'email',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Please provide a valid email address' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'StrongPassword123!',
        minLength: 6,
    }),
    (0, class_validator_1.IsString)({ message: 'Password must be a string' }),
    (0, class_validator_1.MinLength)(6, { message: 'Password must be at least 6 characters long' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password is required' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User first name',
        example: 'John',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'First name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User last name',
        example: 'Doe',
        required: false,
    }),
    (0, class_validator_1.IsString)({ message: 'Last name must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User roles',
        example: ['user'],
        default: ['user'],
        isArray: true,
        required: false,
    }),
    (0, class_validator_1.IsArray)({ message: 'Roles must be an array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least one role is required' }),
    (0, class_validator_1.IsString)({ each: true, message: 'Each role must be a string' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "roles", void 0);
//# sourceMappingURL=create-user.dto.js.map