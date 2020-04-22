import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost/tenancy/api';

const responseBody = res => res.body;


const requests = {
    del: url =>
        superagent.del(`${API_ROOT}${url}`).then(responseBody),
    get: url =>
        superagent.get(`${API_ROOT}${url}`).then(responseBody),
    put: (url, body) =>
        superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
    post: (url, body) =>
        superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};


const User = {
    getAll: () =>
        requests.get('/user/getall.php'),
    getById: user_id =>
        requests.get(`/user/getbyid.php?user_id=${user_id}`),
    create: userData =>
        requests.post('/user/create.php', userData),
    update: userData =>
        requests.put('/user/update.php', userData),
    delete: user_id =>
        requests.del(`/user/delete.php?user_id=${user_id}`),
};


const Login = {
    login: loginData =>
        requests.post('/login/login.php', loginData),
    logout: () =>
        requests.post('/login/logout.php'),
};
export default {
    Login,
    User,

};
