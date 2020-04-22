const dateTime2String = (dt, secondPart = true) => {
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime;
    if (secondPart) {
        let seconds = dt.getSeconds();
        seconds = seconds < 10 ? '0' + seconds : seconds;
        strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    } else {
        strTime = hours + ':' + minutes + ' ' + ampm;
    }
    //let clockTime = dt.getMonth() + 1 + '/' + dt.getDate() + '/' + dt.getFullYear() + '  ' + strTime;
    let clockTime = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate() + '  ' + strTime;
    return clockTime;
};

const parsePHPTime = phpTime => {
    let dtUTC = new Date(phpTime * 1000);

    let dtLocal = new Date();
    dtLocal.setTime(dtUTC.getTime() - dtLocal.getTimezoneOffset() * 60 * 1000);

    return dtLocal;
};
const verifyEmail = email => {
    const verifyEmailRegex =
        RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    return verifyEmailRegex.test(email);
};

export default {
    dateTime2String,
    parsePHPTime,
    verifyEmail,
};
