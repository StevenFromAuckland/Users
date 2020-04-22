import {
    LOGIN,
    LOGIN_PAGE_UNLOADED,
    ASYNC_START,
} from '../globals/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                inProgress: false,
                resultCode: action.payload ? action.payload.resultCode : undefined,
            };
        case LOGIN_PAGE_UNLOADED:
            return {};
        case ASYNC_START:
            if (action.subtype === LOGIN) {
                return { ...state, inProgress: true };
            }
            break;
        default:
            return state;
    }

    return state;
};
