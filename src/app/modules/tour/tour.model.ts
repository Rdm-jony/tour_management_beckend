import { model, Schema } from "mongoose";
import { ITour, ITourType } from "./tour.interface";

const tourTypeSchema = new Schema<ITourType>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true }
}, {
    timestamps: true
})
tourTypeSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        let baseSlug = this.name.toLowerCase().split(" ").join("-")

        let counter = 0;
        while (await TourType.exists({ slug: baseSlug })) {
            baseSlug = `${baseSlug}-${counter++}`
        }

        this.slug = baseSlug;
        console.log(this.slug)
    }
    next()
})
tourTypeSchema.pre("findOneAndUpdate", async function (next) {
    const tourType = this.getUpdate() as Partial<ITourType>
    if (tourType.name) {
        let baseSlug = tourType.name.toLowerCase().split(" ").join("-")

        let counter = 0;
        while (await TourType.exists({ slug: baseSlug })) {
            baseSlug = `${baseSlug}-${counter++}`
        }

        tourType.slug = baseSlug;
    }
    this.setUpdate(tourType)

    next()
})
export const TourType = model("TourType", tourTypeSchema)

const tourSchema = new Schema<ITour>({
    title: { type: String, required: true },
    slug: { type: String,  unique: true },
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
    division: { type: Schema.Types.ObjectId, ref: "Division", required: true },
    tourType: { type: Schema.Types.ObjectId, ref: "TourType", required: true }
}, {
    timestamps: true
})

//tour pre hook

tourSchema.pre("save", async function (next) {
    if (this.isModified("title")) {
        let baseSlug = this.title.toLowerCase().split(" ").join("-")

        let counter = 0;
        while (await Tour.exists({ slug: baseSlug })) {
            baseSlug = `${baseSlug}-${counter++}`
        }

        this.slug = baseSlug;
    }
    next()
})
tourSchema.pre("findOneAndUpdate", async function (next) {
    const tour = this.getUpdate() as Partial<ITour>
    if (tour.title) {
        let baseSlug = tour.title.toLowerCase().split(" ").join("-")

        let counter = 0;
        while (await Tour.exists({ slug: baseSlug })) {
            baseSlug = `${baseSlug}-${counter++}`
        }

        tour.slug = baseSlug;
    }
    this.setUpdate(tour)

    next()
})


export const Tour = model<ITour>("Tour", tourSchema)