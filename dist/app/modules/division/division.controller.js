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
exports.divisionControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const division_service_1 = require("./division.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path });
    const division = yield division_service_1.divisionServices.createDivision(payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: division.newDivision,
        message: "division create successFully",
        statusCode: http_status_codes_1.default.CREATED,
        success: true
    });
}));
const getDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const division = yield division_service_1.divisionServices.getDivision();
    (0, sendResponse_1.sendResponse)(res, {
        data: division,
        message: "division retrived successFully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const updateDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const divisionId = req.params.id;
    const payload = Object.assign(Object.assign({}, req.body), { thumbnail: (_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.path });
    const division = yield division_service_1.divisionServices.updateDivision(divisionId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        data: division.updatedDivision,
        message: "division updated successFully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
const deleteDivision = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const divisionId = req.params.id;
    const division = yield division_service_1.divisionServices.deleteDivision(divisionId);
    (0, sendResponse_1.sendResponse)(res, {
        data: division,
        message: "division deleted successFully",
        statusCode: http_status_codes_1.default.OK,
        success: true
    });
}));
exports.divisionControllers = {
    createDivision,
    getDivision,
    updateDivision,
    deleteDivision
};
