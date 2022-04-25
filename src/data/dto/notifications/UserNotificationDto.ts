export interface UserNotificationDto {
    id: string;
    user: string;
    subject: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}
