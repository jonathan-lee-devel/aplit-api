import {User} from '../models/User';

export interface PropertyDto {
    id: string;
    title: string;
    tenants: string[];
    createdBy: User;
    admin: User;
}
