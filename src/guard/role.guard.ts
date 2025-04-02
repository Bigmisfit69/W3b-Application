import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { userRole } from "src/enum/role.enum";
import { forbiddenRoleExeption } from "src/exception/role.exception";
import { UsersService } from "../users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private userService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<userRole[]>('roles', context.getHandler());
        // console.log('roles', roles);

        const request = context.switchToHttp().getRequest();
        if(request?.user){
            const headers:Headers = request.headers;
            let user = this.userService.users(headers);

            if (!roles.includes((await user).role)) {
                throw new forbiddenRoleExeption(roles.join(' or '));
            } 
            return true;
            }
            return false;
        }
        
    }