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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryBuilder = void 0;
const constant_1 = require("../constant");
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        for (const field of constant_1.excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter);
        return this;
    }
    search(searChQueryFields) {
        const searchText = this.query.searchText || "";
        const searChQuery = {
            $or: searChQueryFields.map(field => ({ [field]: { $regex: searchText, $options: "i" } }))
        };
        this.modelQuery = this.modelQuery.find(searChQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fields() {
        var _a;
        const fieldFilter = ((_a = this.query.fieldFilter) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || "";
        this.modelQuery = this.modelQuery.select(fieldFilter);
        return this;
    }
    paginate() {
        var _a, _b;
        const limit = parseInt((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) || 5;
        const page = parseInt((_b = this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalDocumnet = yield this.modelQuery.model.countDocuments();
            const limit = parseInt((_a = this.query) === null || _a === void 0 ? void 0 : _a.limit) || 5;
            const page = parseInt((_b = this.query) === null || _b === void 0 ? void 0 : _b.page) || 1;
            const totalPage = Math.ceil(totalDocumnet / limit);
            return { total: totalDocumnet, totalPage, limit, page };
        });
    }
    build() {
        return this.modelQuery;
    }
}
exports.QueryBuilder = QueryBuilder;
