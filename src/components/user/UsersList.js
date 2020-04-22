import { Grid, Typography } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Fab from '@material-ui/core/Fab';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import agent from '../../agent';
import myTool from '../../globals/myTool';
import {
    USER_PAGE_LOADED,
    USER_PAGE_UNLOADED,
    UPDATE_REDIRECT_TO,
    DELETE_USER
} from '../../globals/actionTypes';





const columns = [
    {
        id: 'user_id',
        label: 'ID',
        align: 'left',
    },
    {
        id: 'email',
        label: 'Email',
        align: 'center',
    },
    {
        id: 'firstName',
        label: 'Firstname',
        align: 'center',
    },
    {
        id: 'lastName',
        label: 'Lastname',
        align: 'center',
    },
    {
        id: 'created_at',
        label: 'Created At',
        align: 'center',
        format: v => myTool.dateTime2String(myTool.parsePHPTime(v), false),
    },
    {
        id: 'updated_at',
        label: 'Updated At',
        align: 'center',
        format: v => myTool.dateTime2String(myTool.parsePHPTime(v), false),
    },
    {
        id: 'is_admin',
        label: 'Is Admin',
        align: 'center',
        format: v => v ? 'Y' : 'N',
    },
    {
        id: 'Edit',
        label: '',
        align: 'center',
        width: '100px'
    },
    {
        id: 'Delete',
        label: '',
        align: 'right',
        width: '100px'
    },

];


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const NoBorderTableCell = withStyles(theme => ({
    root: {
        borderBottom: "none",
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            //backgroundColor: theme.palette.background.default,
            backgroundColor: '#EEE',
        },
    },
    hover: {
        '&:hover': {
            backgroundColor: 'orange !important',
        },
    },
}))(TableRow);


const styles = theme => ({
    root: {
        width: '100%',
    },
    pagingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(2),
    },
    button: {
        margin: theme.spacing(0.5),
    },
    fabButtonIconLeft: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
    },
    fabButtonIcon: {
        marginRight: theme.spacing(1),
    },
    rootDialogActions: {
        justifyContent: 'center',
    },
    contentDiv: {
        margin: theme.spacing(1),
    },
    centerLoading: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignContent: 'center',
        width: "100%",
    },
    fieldName: {
        fontWeight: 'bold',
    },
});

const mapStateToProps = state => ({
    users: state.user.users,
    currentUser: state.home.currentUser,
});

const mapDispatchToProps = dispatch => ({
    onLoad: (payload) =>
        dispatch({ type: USER_PAGE_LOADED, payload }),
    onUnload: () =>
        dispatch({ type: USER_PAGE_UNLOADED }),
    gotoEditUser: (entityId) =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: 'EditUser', entityId }),
    deleteUser: (user_id) => {
        const payload = agent.User.delete(user_id);
        dispatch({ type: DELETE_USER, payload, user_id })
    },
    gotoComponent: component =>
        dispatch({ type: UPDATE_REDIRECT_TO, renderComponent: component }),
});

class UsersList extends React.Component {
    constructor() {
        super();


        this.onGotoCreateUser = this.onGotoCreateUser.bind(this);
        this.onGotoEditUser = this.onGotoEditUser.bind(this);

    }


    onGotoCreateUser = ev => {
        ev.preventDefault();
        this.props.gotoComponent('CreateUser');

    };
    onGotoEditUser = user_id => ev => {
        ev.preventDefault();
        this.props.gotoEditUser(user_id);

    };
    onDeleteUser = user_id => ev => {
        ev.preventDefault();
        if (!this.props.currentUser.is_admin)
            alert("Only administrator can delete the user");
        else if (window.confirm('Are you sure to delete the user?') == true)
            this.props.deleteUser(user_id);

    };

    componentDidMount() {

        if (!this.props.currentUser) {
            this.props.gotoComponent("Login");
            return;
        }

        this.props.onLoad(agent.User.getAll());
    }

    componentWillUnmount() {
        this.props.onUnload();
    }

    render() {

        const { classes } = this.props;

        if (!this.props.users) {
            return (
                <div className={classes.centerLoading}>
                    <Typography variant="h6">Loading...</Typography>
                    <CircularProgress size={64} color="secondary" />
                </div>
            );
        }
        else if (this.props.users.length === 0) {
            return (
                <Typography variant="h6" className={classes.centerLoading}>No User</Typography>
            );
        }
        else {
            return (
                <Fragment>

                    <Grid container spacing={3} justify='center' alignContent='center' alignItems='center'>
                        <Grid item xs={10} className={classes.leftFlex}>
                            <Typography variant="h4" component="div">
                                Users
                                </Typography>
                        </Grid>
                        <Grid item xs={10} className={classes.leftFlex}>
                            <Fab
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="view-details"
                                className={classes.button}
                                type="button"
                                onClick={this.onGotoCreateUser}
                            >
                                <AddIcon className={classes.fabButtonIconLeft} />
                                                                        Create
                                                                </Fab>
                        </Grid>
                        <Grid item xs={10}>
                            <Paper className={classes.root}>
                                <TableContainer component={Paper}>
                                    <Table stickyHeader aria-label="user list table" size='small'>
                                        <TableHead>
                                            <StyledTableRow>
                                                {columns.slice(0, this.props.currentUser && this.props.currentUser.is_admin ? columns.length : columns.length - 2).map(column => (
                                                    <StyledTableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={column.width ? { width: column.width } : {}}
                                                    >
                                                        {column.label}
                                                    </StyledTableCell>
                                                ))}
                                            </StyledTableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                this.props.users.map(row => {
                                                    return (
                                                        <StyledTableRow hover tabIndex={-1} key={row.user_id}>
                                                            {columns.slice(0, columns.length - 2).map(column => {
                                                                const value = row[column.id];
                                                                return (
                                                                    <StyledTableCell key={column.id} align={column.align}>
                                                                        {column.format ? column.format(value) : value}
                                                                    </StyledTableCell>
                                                                );
                                                            })}
                                                            {this.props.currentUser && this.props.currentUser.is_admin ?
                                                                <StyledTableCell key={columns[columns.length - 2].id} align={columns[columns.length - 2].align}>
                                                                    <Fab
                                                                        variant="extended"
                                                                        size="small"
                                                                        color="primary"
                                                                        aria-label="view-details"
                                                                        className={classes.button}
                                                                        type="button"
                                                                        onClick={this.onGotoEditUser(row.user_id)}
                                                                    >
                                                                        <EditIcon className={classes.fabButtonIconLeft} />
                                                                        Edit
                                                                </Fab>
                                                                </StyledTableCell>
                                                                : null
                                                            }
                                                            {this.props.currentUser && this.props.currentUser.is_admin ?
                                                                <StyledTableCell key={columns[columns.length - 1].id} align={columns[columns.length - 1].align}>
                                                                    <Fab
                                                                        variant="extended"
                                                                        size="small"
                                                                        color="primary"
                                                                        aria-label="view-details"
                                                                        className={classes.button}
                                                                        type="button"
                                                                        onClick={this.onDeleteUser(row.user_id)}
                                                                    >
                                                                        <DeleteIcon className={classes.fabButtonIconLeft} />
                                                                        Delete
                                                                </Fab>
                                                                </StyledTableCell>
                                                                : null
                                                            }
                                                        </StyledTableRow>
                                                    );
                                                })
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid>
                    </Grid>



                </Fragment>

            );
        }
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UsersList)));

