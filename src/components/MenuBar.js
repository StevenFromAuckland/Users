import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import {
    UPDATE_REDIRECT_TO,
    LOGOUT,
} from '../globals/actionTypes';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuRoot: {
        '& > * + *': {
            marginLeft: theme.spacing(5),
        },
        flexGrow: 1,
    },
});

const mapStateToProps = state => ({
    userName: state.user.userName,
    inProgress: state.user.inProgress,
    users: state.user.users,
    currentUser: state.home.currentUser,
});

const mapDispatchToProps = dispatch => ({
    gotoEditUser: (entityId) =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'EditUser', entityId }),
    gotoComponent: component =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: component }),
    logout: () =>
        dispatch({ type: LOGOUT }),
});

class MenuBar extends React.Component {
    constructor() {
        super();

        this.onGotoComponent = this.onGotoComponent.bind(this);
        this.onGotoEditUser = this.onGotoEditUser.bind(this);
    }
    onGotoComponent = component => ev => {
        ev.preventDefault();
        this.props.gotoComponent(component);
    };
    onGotoEditUser =  ev => {
        ev.preventDefault();
        this.props.gotoEditUser(this.props.currentUser.user_id);

    };

    onLogout = ev => {
        ev.preventDefault();
        this.props.logout();
    };

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar variant="dense">
                        <Typography className={classes.menuRoot}>
                            {this.props.currentUser ?
                                <Link href="#" onClick={this.onGotoComponent('UsersList')} color="inherit">
                                    List Users
                            </Link>
                                : null
                            }
                            <Link href="#" onClick={this.onGotoComponent('CreateUser')} color="inherit">
                                Sign Up
                            </Link>
                            {this.props.currentUser ?
                                <Link href="#" onClick={this.onGotoEditUser} color="inherit">
                                    Edit My Profile
                            </Link>
                                : null
                            }
                            {this.props.currentUser ?
                                <Link href="#" onClick={this.onLogout} color="inherit">
                                    Sign Out
                            </Link>
                                :
                                <Link href="#" onClick={this.onGotoComponent('Login')} color="inherit">
                                    Sign In
                            </Link>
                            }
                        </Typography>
                        {this.props.currentUser && (this.props.currentUser.firstName || this.props.currentUser.lastName) ?
                            <Typography>
                                Hello{`, ${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
                            </Typography>
                            : null
                        }
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}
export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MenuBar)));
