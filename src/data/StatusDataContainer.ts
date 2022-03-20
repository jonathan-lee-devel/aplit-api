/**
 * Data object used to represent data
 * which contains data as well as an HTTP status.
 */
export interface StatusDataContainer<InnerDataType> {
    status: number;
    data: InnerDataType;
}
