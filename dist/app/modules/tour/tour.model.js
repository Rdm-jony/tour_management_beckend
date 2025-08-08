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
exports.Tour = exports.TourType = void 0;
const mongoose_1 = require("mongoose");
const tourTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }
}, {
    timestamps: true
});
tourTypeSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) {
            let baseSlug = this.name.toLowerCase().split(" ").join("-");
            let counter = 0;
            while (yield exports.TourType.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            this.slug = baseSlug;
            console.log(this.slug);
        }
        next();
    });
});
tourTypeSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tourType = this.getUpdate();
        if (tourType.name) {
            let baseSlug = tourType.name.toLowerCase().split(" ").join("-");
            let counter = 0;
            while (yield exports.TourType.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            tourType.slug = baseSlug;
        }
        this.setUpdate(tourType);
        next();
    });
});
exports.TourType = (0, mongoose_1.model)("TourType", tourTypeSchema);
const tourSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    included: { type: [String], default: [] },
    excluded: { type: [String], default: [] },
    tourPlan: { type: [String], default: [] },
    costForm: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String },
    maxGuest: { type: Number },
    minAge: { type: Number },
    division: { type: mongoose_1.Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: mongoose_1.Schema.Types.ObjectId, ref: "TourType", required: true }
}, {
    timestamps: true
});
//tour pre hook
tourSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("title")) {
            let baseSlug = this.title.toLowerCase().split(" ").join("-");
            let counter = 0;
            while (yield exports.Tour.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            this.slug = baseSlug;
        }
        next();
    });
});
tourSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tour = this.getUpdate();
        if (tour.title) {
            let baseSlug = tour.title.toLowerCase().split(" ").join("-");
            let counter = 0;
            while (yield exports.Tour.exists({ slug: baseSlug })) {
                baseSlug = `${baseSlug}-${counter++}`;
            }
            tour.slug = baseSlug;
        }
        this.setUpdate(tour);
        next();
    });
});
exports.Tour = (0, mongoose_1.model)("Tour", tourSchema);
