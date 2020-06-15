export function setChat(id: string) {
    return (dispath: any) => {
        dispath({
            type: 'SET_CHAT',
            payload: id
        });
    }
}

export function clearChat() {
    return (dispath: any) => {
        dispath({
            type: 'CLEAR_CHAT',
            payload: ``
        });
    };
}