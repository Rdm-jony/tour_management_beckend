import { IDivision } from "./division.interface";
import { Division } from "./division.model";

const createDivision = async (payload: Partial<IDivision>) => {
    payload.slug = payload.name?.split(" ").join("-").toLowerCase()
    const division = await Division.create(payload)
    return {
        division
    }
}


export const divisionServices = { createDivision }