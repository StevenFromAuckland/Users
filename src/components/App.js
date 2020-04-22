import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import MenuBar from './MenuBar';
import UsersList from './user/UsersList';
import CreateUser from './user/CreateUser';
import EditUser from './user/EditUser';
import Login from './login/Login';

const styles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    tileArea: {
        margin: '16px',
    },
}));

const mapStateToProps = state => ({
    renderComponent: state.home.renderComponent,
});


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderComponent: '',
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.renderComponent !== this.props.renderComponent ) {
            this.setState({
                renderComponent: this.props.renderComponent,
            });
        }
    }

    render() {
        const { classes } = this.props;

        let renderComponent = <Login />;
        switch (this.props.renderComponent) {
            case 'Login':
                renderComponent = <Login />;
                break;
            case 'UsersList':
                renderComponent = <UsersList />;
                break;
            case 'CreateUser':
                renderComponent = <CreateUser />;
                break;
            case 'EditUser':
                renderComponent = <EditUser />;
                break;
        }

        return (
            <div className={classes.root}>
                <MenuBar />
                <div className={classes.tileArea}>
                    {renderComponent}
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps, () => ({}))(App)));
