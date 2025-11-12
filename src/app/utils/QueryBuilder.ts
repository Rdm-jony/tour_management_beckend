/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from "mongoose";
import { excludeField } from "../constant";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    readonly query: Record<string, string>

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query
    }

    filter(): this {
        const filter = { ...this.query };

        // remove excluded fields
        for (const field of excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }

        // Build dynamic filter
        const andConditions: any[] = [];

        // Handle price range filtering
        if (filter.minPrice || filter.maxPrice) {
            const priceRange: Record<string, number> = {};

            if (filter.minPrice) priceRange.$gte = Number(filter.minPrice);
            if (filter.maxPrice) priceRange.$lte = Number(filter.maxPrice);

            andConditions.push({ costForm: priceRange });

            delete filter.minPrice;
            delete filter.maxPrice;
        }

        // Add remaining filters (like category, division, etc.)
        if (Object.keys(filter).length > 0) {
            andConditions.push(filter);
        }

        if (andConditions.length > 0) {
            this.modelQuery = this.modelQuery.find({ $and: andConditions });
        }

        return this;
    }


    search(searChQueryFields: string[]): this {
        const searchText = this.query.searchText || ""
        const searChQuery = {
            $or: searChQueryFields.map(field => ({ [field]: { $regex: searchText, $options: "i" } }))

        }
        this.modelQuery = this.modelQuery.find(searChQuery)
        return this;
    }

    sort(): this {
        const sort = this.query.sort || "createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }

    fields(): this {
        const fieldFilter = this.query.fieldFilter?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fieldFilter)
        return this
    }

    paginate(): this {
        const limit = parseInt(this.query?.limit) || 100
        const page = parseInt(this.query?.page) || 1
        const skip = (page - 1) * limit
        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this
    }



    build() {
        return this.modelQuery
    }
    async getMeta() {
        const totalDocumnet = await this.modelQuery.model.countDocuments()
        const limit = parseInt(this.query?.limit) || 5
        const page = parseInt(this.query?.page) || 1
        const totalPage = Math.ceil(totalDocumnet / limit)

        return { total: totalDocumnet, totalPage, limit, page }

    }

}