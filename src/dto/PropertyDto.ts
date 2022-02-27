import {User} from '../models/User';

/**
 * Data-transfer-object used to represent a single property.
 */
export interface PropertyDto {
    id: string;
    title: string;
    tenants: string[];
    createdBy: User;
    admin: User;
}
