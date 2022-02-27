/**
 * Data-transfer-object used to represent data
 * which contains data as well as an HTTP status.
 */
export interface StatusContainerDto<InnerDto> {
    status: number;
    data: InnerDto;
}
