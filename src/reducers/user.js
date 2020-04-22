import {
    USER_PAGE_LOADED,
    USER_PAGE_UNLOADED,
    ADD_USER,
    DELETE_USER,
    ADD_USER_UNLOADED,
    ASYNC_START,
    EDIT_USER_LOADED,
    EDIT_USER_UNLOADED,

} from '../globals/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case USER_PAGE_LOADED:
            return {
                ...state,
                users: action.payload.users,
            };
        case USER_PAGE_UNLOADED:
            return {};
        case ADD_USER:
            return {
                ...state,
                inProgress: false,
                users: action.error ?
                    null :
                    (state.users || []).concat([action.payload])
            };
        case ADD_USER_UNLOADED:
            return { users: state.users};
        case DELETE_USER:
            const user_id = action.user_id
            return {
                ...state,
                users: state.users.filter(c => c.user_id !== user_id)
            };
        case ASYNC_START:
            if (action.subtype === ADD_USER) {
                return { ...state, inProgress: true };
            }
            break;
        case EDIT_USER_LOADED:
            return {
                ...state,
                user: action.payload,
            };
        case EDIT_USER_UNLOADED:
            return {
                ...state,
                user: null,
            };
        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(c => c.user_id !== action.user_id)
            };
    }
    return state;
};
