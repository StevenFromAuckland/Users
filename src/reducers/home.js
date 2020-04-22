import {
    UPDATE_REDIRECT_TO,
    ADD_USER,
    EDIT_USER,
    LOGIN,
    LOGOUT,
} from '../globals/actionTypes';

export default (state = { renderComponent: ''}, action) => {
    switch (action.type) {
        case UPDATE_REDIRECT_TO:
            return {
                ...state,
                renderComponent: action.renderComponent,
                entityId: action.entityId
            };
        case ADD_USER:
        case EDIT_USER:
            return {
                ...state,
                renderComponent: !action.error ? 'UsersList' : state.renderComponent,
                entityId: 0
            };
        case LOGIN:
            return {
                ...state,
                currentUser: action.payload ? action.payload.currentUser : null,
                renderComponent: action.payload && action.payload.resultCode && parseInt(action.payload.resultCode) == 1 ? 'UsersList' : state.renderComponent,
            };
        case LOGOUT:
            return {
                ...state,
                currentUser: null,
                renderComponent: 'Login',
                entityId: 0
           };
    }
    return state;
};
