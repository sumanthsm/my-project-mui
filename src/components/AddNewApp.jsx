import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Swal from 'sweetalert2';
import axios from 'axios';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 200,
        width: 200,
        borderRadius: '50%',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: '50px',
        marginRight: '50px',
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
    inputBase: {
        backgroundColor: 'lightgrey',
        borderRadius: '5px',
        alignItems: 'left',
        padding: '0 10px'
    },
});

class AddNewApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            appId: '',
            appAbrv: '',
            appName: '',
            appDesc: '',
            appUrl: '',
        }
    }

    handleChange = (e) => {
        if (e.target.id === 'appId') {
            this.setState({ appId: e.target.value });
        } else if (e.target.id === 'appAbrv') {
            this.setState({ appAbrv: e.target.value });
        } else if (e.target.id === 'appName') {
            this.setState({ appName: e.target.value });
        } else if (e.target.id === 'appDesc') {
            this.setState({ appDesc: e.target.value });
        } else if (e.target.id === 'appUrl') {
            this.setState({ appUrl: e.target.value });
        }
    }

    setAppData = (data) => {
        axios.post('http://localhost:5000/api/createapp', { data: data })
            .then((response) => {
                console.log(response, "res");
                
                if (response.data.status === 'success') {
                    Swal.fire({
                        type: 'success',
                        title: 'App created successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.setState({
                        appId: '',
                        appAbrev: '',
                        appName: '',
                        appDesc: '',
                        appUrl: '',
                    })
                } else if (response.data.status === 'fail') {
                    Swal.fire({
                        type: 'error',
                        title: 'Oops...',
                        text: 'App Id is already exist.',
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleSubmmit = () => {
        let appObj = {};
        appObj['appId'] = this.state.appId;
        appObj['appAbrv'] = this.state.appAbrv;
        appObj['appName'] = this.state.appName;
        appObj['appDesc'] = this.state.appDesc;
        appObj['appUrl'] = this.state.appUrl;
        
        this.setAppData(appObj);
        setTimeout(() => {
            this.props.getAppData();
        }, 2000);
    }

    onCancelButtonClick = () => {
        this.props.onButtonClick();
    }

    render() {
        const { classes, isAddApp } = this.props;
        const { appId, appName, appAbrv, appUrl, appDesc} = this.state;
        return (
            <div style={{ marginTop: '-40px' }}>
                <h3 style={{ marginLeft: '50px' }}>App Application</h3>
                <Zoom in={isAddApp}>
                    <div style={{ display: 'flex' }}>
                        <Paper elevation={4} style={{ width: '100%', margin: '0px 70px 30px 50px' }}>
                            <form className={classes.container} noValidate autoComplete="off">
                                <div style={{ display: 'flex' }}>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="racf" style={{ textAlign: 'left' }}>RACF</label>
                                        </div>
                                        <InputBase
                                            id="racf"
                                            defaultValue=""
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '250px'
                                            }}
                                        />
                                    </div>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="racf" style={{ textAlign: 'left' }}>Full Name</label>
                                        </div>
                                        <InputBase
                                            id="fullName"
                                            defaultValue=""
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '250px'
                                            }}
                                        />
                                    </div>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="appId" style={{ textAlign: 'left' }}>App Id</label>
                                        </div>
                                        <InputBase
                                            id="appId"
                                            value={appId}
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '250px'
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="appName" style={{ textAlign: 'left' }}>App Name</label>
                                        </div>
                                        <InputBase
                                            id="appName"
                                            value={appName}
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '250px'
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="appAbrv" style={{ textAlign: 'left' }}>Marker(Name Abbreviation)</label>
                                        </div>
                                        <InputBase
                                            id="appAbrv"
                                            value={appAbrv}
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '250px'
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="appUrl" style={{ textAlign: 'left' }}>App URL</label>
                                        </div>
                                        <InputBase
                                            id="appUrl"
                                            value={appUrl}
                                            variant="outlined"
                                            className={classes.inputBase}
                                            style={{
                                                width: '500px'
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{margin: '20px 30px', width: '100%'}}>
                                        <div>
                                            <label htmlFor="appDesc" style={{ textAlign: 'left' }}>App Description</label>
                                        </div>
                                        <InputBase
                                            id="appDesc"
                                            value={appDesc}
                                            variant="outlined"
                                            className={classes.inputBase}
                                            onChange={this.handleChange}
                                            fullWidth={true}
                                        />
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{margin: '10px 30px 30px 30px', float: 'right'}}>
                                        <Button variant="outlined" onClick={this.onCancelButtonClick}>
                                        <span style={{padding: '0 15px'}}>CANCEL</span>    
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            style={{margin: '0px 20px', backgroundColor: '#00b3b3', color: 'white'}}
                                            onClick={this.handleSubmmit}
                                            >
                                        <span style={{padding: '0 15px'}}>ADD TO LAUNCHPAD</span>    
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Paper>
                    </div>
                </Zoom>
            </div>
        );
    }
}

export default withStyles(styles)(AddNewApp);