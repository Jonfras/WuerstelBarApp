import { Regions } from "./Regions";

export interface PersonDto {
    id: string ,
    name: string | null,
    region: Regions | null,
    email: string,
}