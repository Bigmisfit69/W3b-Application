import { ForbiddenException } from "@nestjs/common";

export class forbiddenRoleExeption extends ForbiddenException {
    constructor(role: string){
        super(`Sorry you don't have the required role for this endpoint ${role}`)
    }
}
