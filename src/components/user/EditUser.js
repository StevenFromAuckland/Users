import { Grid } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import Link from '@material-ui/core/Link';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import agent from '../../agent';
import myTool from '../../globals/myTool';
import {
    EDIT_USER,
    EDIT_USER_LOADED,
    EDIT_USER_UNLOADED,
    UPDATE_REDIRECT_TO
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
    checkbox: {
        margin: 0,
        width: "100%", //make it align left
    },
    button: {
        margin: theme.spacing(3, 1, 1, 1),
    },
    captcha: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    captchaAgain: {
        margin: theme.spacing(0, 1),
    },
    img: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '3px',
        margin: theme.spacing(0, 1),
    },
    contentDiv: {
        margin: theme.spacing(1),
    },
    fabButtonIcon: {
        marginRight: theme.spacing(0.5),
    },
    rootDialogActions: {
        justifyContent: 'center',
    }

});

const mapStateToProps = state => ({
    inProgress: state.user.inProgress,
    user: state.user.user,
    home: state.home,
    currentUser: state.home.currentUser,
});

const mapDispatchToProps = dispatch => ({
    onLoad: payload =>
        dispatch({ type: EDIT_USER_LOADED, payload }),

    onSubmit: user => {
        const payload = agent.User.update(user);
        dispatch({ type: EDIT_USER, payload })
    },
    onUnload: () =>
        dispatch({ type: EDIT_USER_UNLOADED }),
    gotoComponent: component =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: component }),
});

class EditUser extends React.Component {
    constructor() {
        super();

        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            is_admin: false,
            errors: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
            }
        };






        const reportError = (field, message) => {
            this.setState(preState => ({ ...preState, errors: { ...preState.errors, [field]: message, } }));
        };

        const reportErrorEmail = (value) => {
            let bInValid = !value || value.length === 0 || !myTool.verifyEmail(value);
            let message = bInValid ? 'The Email is blank or invalid' : '';
            reportError('email', message);
            return bInValid;
        };

        this.blurEmail = ev => {
            reportErrorEmail(ev.target.value.trim());
        };

        const reportErrorFirstName = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The firstName cannot be blank' : '';
            reportError('firstName', message);
            return bInValid;
        };

        this.blurFirstName = ev => {
            reportErrorFirstName(ev.target.value.trim());
        };

        const reportErrorLastName = (value) => {
            let bInValid = !value || value.length === 0;
            let message = bInValid ? 'The lastName cannot be blank' : '';
            reportError('lastName', message);
            return bInValid;
        };

        this.blurLastName = ev => {
            reportErrorLastName(ev.target.value.trim());
        };


        //const reportErrorPassword = (value) => {
        //    let bInValid = !value || value.length === 0;
        //    let message = bInValid ? 'The password cannot be blank' : '';
        //    reportError('password', message);
        //    return bInValid;
        //};

        //this.blurPassword = ev => {
        //    reportErrorPassword(ev.target.value.trim());
        //};


        const updateFieldValueEvent =
            key => ev => {
                let value = ev.target.value; //must be set the value here, ev.target become null in setState
                this.setState(preState => ({
                    ...preState,
                    [key]: value,
                }));
            };

        const updateFieldCheckedEvent =
            key => ev => {
                let checked = ev.target.checked; //must be set the value here, ev.target become null in setState
                this.setState(preState => ({
                    ...preState,
                    [key]: checked,
                }));
            };

        this.changeEmail = updateFieldValueEvent('email');
        this.changeFirstName = updateFieldValueEvent('firstName');
        this.changeLastName = updateFieldValueEvent('lastName');
        this.changePassword = updateFieldValueEvent('password');
        this.changeIsAdmin = updateFieldCheckedEvent('is_admin');

        this.submitForm = () => ev => {
            ev.preventDefault();

            const {
                email,
                firstName,
                lastName,
                password,
                is_admin,
            } = this.state;

            let bInValid = reportErrorEmail(email)
                || reportErrorFirstName(firstName)
                || reportErrorLastName(lastName);
            //|| reportErrorPassword(password);


            if (bInValid) {
                return false;
            }

            const user = {
                user_id: this.props.home.entityId,
                email,
                firstName,
                lastName,
                password,
                is_admin,
            };

            this.props.onSubmit(user);
        }
    };



    componentDidMount() {

        if (!this.props.currentUser) {
            this.props.gotoComponent("Login");
            return;
        }

        if (this.props.home
            && this.props.home.renderComponent
            && this.props.home.renderComponent === "EditUser"
            && this.props.home.entityId > 0) {
            this.props.onLoad(agent.User.getById(this.props.home.entityId));
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.user && this.props.user && this.props.user.user_id > 0
        ) {
            this.setState(preState => ({
                ...preState,
                email: this.props.user.email,
                firstName: this.props.user.firstName,
                lastName: this.props.user.lastName,
                password: this.props.user.password,
                is_admin: this.props.user.is_admin,
            }));
        }
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {

        const { classes } = this.props;

        return (

            <Grid container direction="column"
                justify="center"
                alignItems="center"
                alignContent="center"
            >
                <Grid item>
                    <h1>Edit</h1>
                </Grid>
                <Grid item>
                    <ListErrors errors={this.state.errors} />
                </Grid>

                <Grid item>

                    <form className={classes.form} noValidate autoComplete="off" onSubmit={this.submitForm()}>
                        <TextField
                            required
                            id="email"
                            value={this.state.email}
                            label="Email, Required"
                            style={{ margin: 8 }}
                            placeholder="Email"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeEmail}
                            autoFocus
                            onBlur={this.blurEmail}
                            error={this.state.errors.email.length === 0 ? false : true}
                            helperText={this.state.errors.email}
                        />
                        <TextField
                            required
                            id="firstName"
                            value={this.state.firstName}
                            label="Firstname, Required"
                            style={{ margin: 8 }}
                            placeholder="Firstname"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeFirstName}
                            onBlur={this.blurFirstName}
                            error={this.state.errors.firstName.length === 0 ? false : true}
                            helperText={this.state.errors.firstName}
                        />
                        <TextField
                            required
                            id="lastName"
                            value={this.state.lastName}
                            label="Lastname, Required"
                            style={{ margin: 8 }}
                            placeholder="Lastname"
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            InputLabelProps={{
                                shrink: true,
                                style: { fontWeight: 'bold' },
                            }}
                            onChange={this.changeLastName}
                            onBlur={this.blurLastName}
                            error={this.state.errors.lastName.length === 0 ? false : true}
                            helperText={this.state.errors.lastName}
                        />

                        <TextField
                            id="password"
                            value={this.state.password}
                            label="Password"
                            style={{ margin: 8 }}
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
                            helperText="Please let the password blank if it is unchanged"
                        />

                        <FormControlLabel className={classes.checkbox}
                            control={
                                <Checkbox
                                    checked={this.state.is_admin}
                                    onChange={this.changeIsAdmin}
                                    value="is_admin"
                                    color="primary"
                                />
                            }
                            label="Is Admin"
                        />


                        <Fab
                            variant="extended"
                            size="small"
                            color="primary"
                            aria-label="send-application"
                            className={classes.button}
                            type="submit"
                            disabled={this.props.inProgress}
                        >
                            <SaveIcon className={classes.fabButtonIcon} />
                                Save
                            </Fab>

                    </form>
                </Grid>
            </Grid>

        );
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditUser)));
