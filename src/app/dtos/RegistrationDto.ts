import { PersonDto } from "./PersonDto";

export interface RegistrationDto {
    person: PersonDto;
    registratedAt: Date;
}