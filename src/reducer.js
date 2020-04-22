import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import home from './reducers/home';
import user from './reducers/user';
import login from './reducers/login';



export default (history) => combineReducers({
    home,
    user,
    login,
    router: connectRouter(history),
});
