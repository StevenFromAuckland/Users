//import ListErrors from './ListErrors';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import CloseIcon from '@material-ui/icons/Close';
import PersonPin from '@material-ui/icons/PersonPin';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Link as LinkRouter, withRouter } from 'react-router-dom';
import agent from '../../agent';
import myTool from '../../globals/myTool';
import {
    LOGIN,
    LOGIN_PAGE_UNLOADED,
    UPDATE_REDIRECT_TO,
} from '../../globals/actionTypes';
import ListErrors from '../ListErrors';





const styles = theme => ({
    form: {
        textAlign: 'center',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(3, 1, 1, 1),
    },
    link: {
        textDecoration: 'none',
        color: 'inherit',
    },
    signUp: {
        margin: theme.spacing(0, 0, 1, 0),
    },
    contentDiv: {
        margin: theme.spacing(1),
    },
    fabButtonIcon: {
        marginRight: theme.spacing(0.5),
    },
});

const mapStateToProps = state => ({
    LoginUsername: state.login.LoginUsername,
    LoginPassword: state.login.LoginPassword,
    resultCode: state.login.resultCode,
    inProgress: state.login.inProgress,

});

const mapDispatchToProps = dispatch => ({

    onSubmit: loginData => {
        const payload = agent.Login.login(loginData);
        dispatch({ type: LOGIN, payload })
    },
    onUnload: () =>
        dispatch({ type: LOGIN_PAGE_UNLOADED }),
    gotoComponent: component =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: component }),
});

class Login extends React.Component {
    constructor() {
        super();

        this.state = {
            LoginUsername: '',
            LoginPassword: '',
            errors: {
                LoginUsername: '',
                LoginPassword: '',
            }
        };




        const reportError = (field, message) => {
            this.setState(preState => ({ ...preState, errors: { ...preState.errors, [field]: message, } }));
            //alert(JSON.stringify(this.state));
        };

        const reportErrorUsername = (value) => {
            let bInValid = !value || value.length === 0 || !myTool.verifyEmail(value);
            let message = bInValid ? 'The Email is blank or invalid' : '';
            reportError('LoginUsername', message);
            return bInValid;
        };

        const reportErrorPassword = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The password cannot be blank' : '';
            reportError('LoginPassword', message);
            return bInValid;
        };

        this.blurUsername = ev => {
            reportErrorUsername(ev.target.value.trim());
        };
        this.blurPassword = ev => {
            reportErrorPassword(ev.target.value);
        };

        const updateFieldValueEvent =
            key => ev => {
                let value = ev.target.value; //must be set the value here, ev.target become null in setState
                this.setState(preState => ({
                    ...preState,
                    [key]: value,
                }));
            };

        this.changeUsername = updateFieldValueEvent('LoginUsername');
        this.changePassword = updateFieldValueEvent('LoginPassword');


        this.submitForm = () => ev => {
            ev.preventDefault();


            const {
                LoginUsername,
                LoginPassword,
            } = this.state;

            let bInValid = reportErrorUsername(LoginUsername)
                || reportErrorPassword(LoginPassword);


            if (bInValid) {
                return false;
            }

            const loginData = {
                email: LoginUsername,
                password: LoginPassword,
            };

            //alert('start to submit form');
            this.props.onSubmit(loginData);
        }

        this.onGotoComponent = this.onGotoComponent.bind(this);
};

    onGotoComponent = component => ev => {
        ev.preventDefault();
        this.props.gotoComponent(component);
    };



    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {

        const { classes } = this.props;

        let resultMessage = "";
        switch (this.props.resultCode) {
            //case 1:
            //    resultMessage = 'Login successfully';
            //    break;
            case -1:
                resultMessage = 'Failed to sign in.\nPlease check if the entered information are correct';
                break;
        }

        return (

            <Fragment>
                <Grid container direction="column"
                    justify="center"
                    alignItems="center"
                    alignContent="center"
                >
                    <Grid item>
                        <h1>Sign In</h1>
                    </Grid>
                    <Grid item>
                        <Link href="#" onClick={this.onGotoComponent('CreateUser')} color="inherit">
                            <div className={classes.signUp}>Not signed up yet? Sign up now</div>
                        </Link>

                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2">
                            Please try the embedded user, Email: a@a.com, Password: a
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ListErrors errors={this.state.errors} />
                    </Grid>
                    {resultMessage ?
                        <Grid item>
                            <ListErrors errors={{ resultMessage }} />
                        </Grid>
                        : null
                    }

                    <Grid item>

                        <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm()}>

                            <TextField
                                required
                                id="LoginUsername"
                                value={this.state.LoginUsername}
                                label="Email, Required"
                                placeholder="Email"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontWeight: 'bold' },
                                }}
                                onChange={this.changeUsername}
                                onBlur={this.blurUsername}
                                error={this.state.errors.LoginUsername.length === 0 ? false : true}
                                helperText={this.state.errors.LoginUsername}
                            />

                            <TextField
                                required
                                id="LoginPassword"
                                value={this.state.LoginPassword}
                                type="password"
                                autoComplete="new-LoginPassword"
                                label="Password, Required"
                                placeholder="Password"
                                fullWidth
                                margin="normal"
                                variant="outlined"
                                InputLabelProps={{
                                    shrink: true,
                                    style: { fontWeight: 'bold' },
                                }}
                                onChange={this.changePassword}
                                onBlur={this.blurPassword}
                                error={this.state.errors.LoginPassword.length === 0 ? false : true}
                                helperText={this.state.errors.LoginPassword}
                            />


                            <Fab
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="sign-in"
                                className={classes.button}
                                type="submit"
                                disabled={this.props.inProgress}
                            >
                                <AccountCircle className={classes.fabButtonIcon} />
                                Sign In
                            </Fab>

                        </form>
                    </Grid>
                </Grid>

            </Fragment>
        );
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Login)));
