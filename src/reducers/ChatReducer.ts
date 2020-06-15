export interface chatState{
    ChatId: string
}
const initialChatState={
    ChatId: ''
}

const chatReducer = (
    state : chatState = initialChatState,
    action : any) => {
    switch (action.type) {
        case 'SET_CHAT':
            state = { ...state, ChatId: action.payload};
            break;
        case 'CLEAR_CHAT':
            state = { ...state, ChatId: ''};
            break;
        default:
            break;
    };
    return state;
};

export default chatReducer;