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
        const filter = { ...this.query }
        for (const field of excludeField) {
            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter)
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
        const fieldFilter = this.query.fieldFilter.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fieldFilter)
        return this
    }

    paginate(): this {
        const limit = parseInt(this.query?.limit) || 5
        const page = parseInt(this.query?.page) || 1
        const skip = (page - 1) * limit
        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        return this
    }

    async getMeta() {
        const totalDocumnet = await this.modelQuery.model.countDocuments()

        const limit = parseInt(this.query?.limit) || 5
        const page = parseInt(this.query?.page) || 1
        const totalPage = Math.ceil(totalDocumnet / limit)

        return { total: totalDocumnet, totalPage, limit, page }

    }

    build() {
        return this.modelQuery
    }


}