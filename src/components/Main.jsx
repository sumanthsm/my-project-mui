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
import AddIcon from '@material-ui/icons/Add';
import axios from 'axios';
import Zoom from '@material-ui/core/Zoom';
import Dashboard from './Dashboard';
import AddNewApp from './AddNewApp';
import EditApp from './EditApp';
import TableView from './TableView';

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
        console.log("getShortcutsData");

        axios.get('http://localhost:5000/api/shortcutsdata')
            .then((response) => {
                let data = response.data;
                this.setState({ shortcutsData: data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onChange = (e) => {
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

    handleDelete = (appId) => {
        axios.post('http://localhost:5000/api/deleteshortcut', { appId: appId })
            .then((response) => {
                if (response.data.status === 'success') {
                    this.getShortcutsData();
                    // Swal.fire({
                    //     type: 'success',
                    //     title: 'Shortcut added Successfully.',
                    //     showConfirmButton: false,
                    //     timer: 1500
                    // })
                }
                // else {
                //     Swal.fire({
                //         type: 'error',
                //         title: 'Oops...',
                //         text: 'Shortcut already exists.',
                //     })
                // }
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
        })
    }

    onTableViewButtonClick = () => {
        this.setState({
            isTableView: true,
            isEditApp: false,
            isAddApp: false
        })
    }

    render() {
        const { classes } = this.props;
        const { isAddApp, isEditApp, isTableView, appId, shortcutsData } = this.state;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed"
                    className={classes.appBar}
                    style={{ backgroundColor: 'white' }}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
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
                                Hello, User
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
                    <div className={classes.toolbar}>

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
                    <List>
                        {
                            shortcutsData.map((shortcut, i) => {
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
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    <div style={{ marginTop: '60px', borderBottom: '2px solid white' }}>
                        <Fab size="small" className={classes.fab} color="primary">
                            <AddIcon onClick={this.onAddButtonClick} />
                        </Fab>
                    </div>
                    {
                        isAddApp && <AddNewApp isAddApp={isAddApp} getAppData={this.getAppData} onButtonClick={this.onHomeButtonClick} />
                    }

                    {
                        isEditApp && <EditApp isEditApp={isEditApp} getAppData={this.getAppData} appId={appId} onButtonClick={this.onHomeButtonClick} />
                    }

                    <Zoom in={true}>
                        {
                            isTableView ? <TableView isTableView={isTableView} onEditClick={this.onEditClick}/> : <Dashboard
                                appData={this.state.appData}
                                shortcutsData={this.getShortcutsData}
                                onEditClick={this.onEditClick}
                                onTableViewButtonClick={this.onTableViewButtonClick} />
                        }

                    </Zoom>
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Main);
