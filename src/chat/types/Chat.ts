import ChatUser from "./ChatUser";
import Message from "./Message";

export default interface ChatModel {
    id: string,
    buyer: ChatUser,
    seller: ChatUser,
    message: Message,
    unread: number
}
