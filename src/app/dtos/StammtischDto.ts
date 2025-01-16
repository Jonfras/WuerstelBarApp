import { PersonDto } from "./PersonDto";
import { RegistrationDto } from "./RegistrationDto";

export interface StammtischDto {
    id: string,
    drivers: PersonDto[],
    participants: RegistrationDto[];
    date: Date,
}