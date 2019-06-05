import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Fab from '@material-ui/core/Fab';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import ErrorIcon from '@material-ui/icons/Error';
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Swal from 'sweetalert2';
import Zoom from '@material-ui/core/Zoom';
import Dashboard from './Dashboard';
import AddNewApp from './AddNewApp';
import EditApp from './EditApp';
import TableView from './TableView';
import Login from './Login';
import ImageLogo from '../logo.jpg';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1,
    },
    appBar: {
        width: `calc(100% - 60px)`,
        marginLeft: '60px',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
        color: 'black',
    },
    search: {
        position: 'relative',
        borderRadius: '30px',
        color: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        width: '45px',
        height: '100%',
        position: 'absolute',
        right: '0',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'grey'
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 2),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 250,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: '60px',
        flexShrink: 0,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
    },
    drawerPaper: {
        backgroundColor: '#666666',
        width: '60px',
        overflow: 'hidden',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        backgroundImage: 'linear-gradient(#b3e0ff, #004d80)',
        height: '100%',
        minHeight: '-webkit-fill-available',
    },
    fab: {
        backgroundColor: 'white',
        color: 'black',
        position: 'absolute',
        top: '75px',
        right: theme.spacing(2),
    },
    contactUsButton: {
        textDecoration: 'none',
        color: 'black',
        margin: '8px auto'
    }
});

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            appData: [],
            shortcutsData: [],
            typingTimeout: 0,
            isAddApp: false,
            isEditApp: false,
            isTableView: false,
            isLogin: localStorage.getItem('login') || false,
            isGuestUser: false,
            appId: null
        }
    }

    componentDidMount() {
        this.getAppData();
        this.getShortcutsData();
    }

    getAppData = () => {
        axios.get('http://localhost:5000/api/appdata')
            .then((response) => {
                let data = response.data;
                this.setState({ appData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getShortcutsData = () => {
        axios.get('http://localhost:5000/api/shortcutsdata')
            .then((response) => {
                let data = response.data;
                this.setState({ shortcutsData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleChange = (e) => {
        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
        }

        this.setState({
            searchTerm: e.target.value,
            typingTimeout: setTimeout(() => {
                this.onDataChange();
            }, 1000)
        });
    }

    onDataChange = () => {
        const { searchTerm } = this.state;
        if (searchTerm === '') {
            this.getAppData();
        } else {
            axios.get('http://localhost:5000/api/appdata' + searchTerm)
                .then((response) => {
                    let data = response.data;
                    console.log(data);
                    this.setState({ appData: data });
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }

    handleShortcutDelete = (appId) => {
        console.log("handleShortcutDelete");

        axios.post('http://localhost:5000/api/deleteshortcut', { appId: appId })
            .then((response) => {
                if (response.data.status === 'success') {
                    this.getShortcutsData();
                    Swal.fire({
                        type: 'success',
                        title: 'Shortcut Deleted Successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onAddButtonClick = () => {
        this.setState(({ isAddApp: true, isEditApp: false }));
    };

    onEditClick = (appId) => {
        console.log(appId, "appId");
        this.setState({
            appId: appId,
            isEditApp: true,
            isAddApp: false
        })
    }

    onHomeButtonClick = () => {
        this.getAppData();
        this.setState({
            appId: null,
            isEditApp: false,
            isAddApp: false,
            isTableView: false,
            isGuestUser: true
        })
    }

    onCalcelButtonClick = () => {
        this.setState({
            appId: null,
            isEditApp: false,
            isAddApp: false,
        })
    }

    onTableViewButtonClick = () => {
        this.setState({
            isTableView: true,
            isEditApp: false,
            isAddApp: false
        })
    }

    onLogin = () => {
        this.setState({ isLogin: true });
    }

    render() {
        const { classes } = this.props;
        const { isAddApp, isEditApp, isTableView, appId, shortcutsData, searchTerm, isGuestUser } = this.state;
        const isLogin = localStorage.getItem('login');
        const fullName = localStorage.getItem('fullName');
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed"
                    className={classes.appBar}
                    style={{ backgroundColor: 'white' }}>
                    <Toolbar>
                        <Typography
                            className={classes.title}
                            variant="h6"
                            onClick={this.onHomeButtonClick}
                            style={{ cursor: 'pointer' }}
                            noWrap>
                            Enterprise App Launchpad
                            </Typography>
                        <div className={classes.grow} />
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                variant="outlined"
                                value={searchTerm}
                                onChange={this.handleChange}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />
                        </div>
                        <div className={classes.sectionDesktop}>
                            <div style={{ borderLeft: '0.1em solid rgba(0, 0, 0, 0.12)', padding: '0.5em' }}>
                                <IconButton color="black" >
                                    <Badge badgeContent={2} color="secondary">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </div>
                            <div style={{ borderLeft: '0.1em solid rgba(0, 0, 0, 0.12)', padding: '0.5em' }}>
                                <IconButton
                                    edge="end"
                                    aria-haspopup="true"
                                    onClick=""
                                    color="black"
                                >
                                    <AccountCircle />
                                </IconButton>
                            </div>
                            <Typography style={{ color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }} variant="span" noWrap>
                                <span>Hello,</span>
                                {
                                    isLogin ? <span>{fullName}</span> : <span>User</span>
                                }
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div onClick={this.onHomeButtonClick} style={{ cursor: 'pointer' }}>
                        <img src={ImageLogo} style={{ width: '64px', height: '64px' }} alt="logo"></img>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button >
                            <ListItemIcon>
                                <HomeIcon style={{ color: 'white' }} onClick={this.onHomeButtonClick} />
                            </ListItemIcon>
                        </ListItem>
                    </List>
                    <Divider />
                    {
                        isLogin && <List>
                            {
                                shortcutsData && shortcutsData.map((shortcut, i) => {
                                    return (
                                        <ListItem button key={i}>
                                            <ListItemText style={{ color: 'white' }}>
                                                <a href={shortcut.appUrl} target="_blank" style={{ textDecoration: 'none', color: 'white' }}>
                                                    {shortcut.appAbrv}
                                                </a>
                                            </ListItemText>
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    }
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    {isLogin || isGuestUser ?
                        <div>
                            {isLogin && <div style={{ marginTop: '60px' }}>
                                <Fab size="small" className={classes.fab} color="primary">
                                    <AddIcon onClick={this.onAddButtonClick} />
                                </Fab>
                            </div>}
                            <div>
                                <Tooltip title="Contact us" placement="left">
                                    <Fab size="small" className={classes.fab} style={{ top: '150px', right: '0px', borderRadius: '20%' }}>
                                        <a className={classes.contactUsButton} href="mailto:"><ErrorIcon /></a>
                                    </Fab>
                                </Tooltip>
                            </div>
                            {
                                isAddApp && <AddNewApp isAddApp={isAddApp} getAppData={this.getAppData} onCalcelButtonClick={this.onCalcelButtonClick} />
                            }

                            {
                                isEditApp && <EditApp isEditApp={isEditApp} getAppData={this.getAppData} appId={appId} onCalcelButtonClick={this.onCalcelButtonClick} />
                            }
                            <div style={{ borderTop: '1px solid white' }}>
                                <Zoom in={true}>
                                    {
                                        isTableView ? <TableView isLogin={isLogin} isTableView={isTableView} onEditClick={this.onEditClick} isGuestUser={isGuestUser} /> : <Dashboard
                                            appId={appId}
                                            appData={this.state.appData}
                                            isLogin={isLogin}
                                            getShortcutsData={this.getShortcutsData}
                                            handleShortcutDelete={this.handleShortcutDelete}
                                            onEditClick={this.onEditClick}
                                            onTableViewButtonClick={this.onTableViewButtonClick} />
                                    }
                                </Zoom>
                            </div>
                        </div> : <Login onLogin={this.onLogin} />
                    }
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);
