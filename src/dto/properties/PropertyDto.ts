/**
 * Data-transfer-object used to represent a single property.
 */
export interface PropertyDto {
    id: string;
    title: string;
    tenantEmails: string[];
    createdBy: string;
    admin: string;
}
