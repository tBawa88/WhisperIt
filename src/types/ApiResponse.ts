import { Message } from '@/model/User'

export interface ApiResponse {
    successs: boolean;
    message: String;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
}