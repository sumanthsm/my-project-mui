import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import Swal from 'sweetalert2';
import userData from '../userdata.json';

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
});

class EditApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            racf: '',
            fullName: ''
        }
    }

    handleChange = (e) => {
        console.log(e.target.id);
        
        if (e.target.id === 'racf') {
            this.setState({ racf: e.target.value });
        } else if (e.target.id === 'fullName') {
            this.setState({ fullName: e.target.value });
        } 
    }

    handleSubmmit = () => {
        const { racf, fullName } = this.state;
        if(racf !== '' && fullName !== ''){
            const data = userData.data;
            let flag = false;
            for(let i=0;i<data.length;i++){
                if(data[i].racf === racf && data[i].fullName === fullName){
                    localStorage.setItem('racf', racf);
                    localStorage.setItem('fullName', fullName);
                    localStorage.setItem('login', true);
                    flag = true;
                    this.props.onLogin();
                    break;
                }
            }
            if(flag){
                Swal.fire({
                    type: 'success',
                    title: 'Login Successful!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else{
                Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: 'Please enter valid RACF and Full Name',
                })
            }
        }else {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'Please enter RACF and Full Name',
            })
        }
    }

    onCancelButtonClick = () => {
        this.props.onButtonClick();
    }

    handleGuestLogin = (e) => {
        e.preventDefault();
        this.props.guestUser();
    }

    render() {
        const { classes } = this.props;
        const { racf, fullName } = this.state;
        return (
            <div style={{ marginTop: '30px' }}>
                <h2 style={{ marginLeft: '50px', color: 'white' }}>Launchpad Login</h2>
                    <div style={{ display: 'flex' }}>
                        <Paper elevation={4} style={{ width: '310px', margin: '0 auto' }}>
                            <form className={classes.container} noValidate autoComplete="off">
                                <div style={{ display: 'inline' }}>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="racf" style={{ textAlign: 'left' }}>RACF</label>
                                        </div>
                                        <InputBase
                                            id="racf"
                                            value={racf}
                                            variant="outlined"
                                            style={{
                                                backgroundColor: 'lightgrey',
                                                borderRadius: '5px',
                                                width: '250px',
                                                alignItems: 'left',
                                                padding: '0 10px'

                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                    <div style={{margin: '20px 30px'}}>
                                        <div>
                                            <label htmlFor="racf" style={{ textAlign: 'left' }}>Full Name</label>
                                        </div>
                                        <InputBase
                                            id="fullName"
                                            value={fullName}
                                            variant="outlined"
                                            style={{
                                                backgroundColor: 'lightgrey',
                                                borderRadius: '5px',
                                                width: '250px',
                                                alignItems: 'left',
                                                padding: '0 10px'
                                            }}
                                            onChange={this.handleChange}
                                        />
                                    </div>
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div style={{margin: '30px 10px 30px 0px', float: 'right'}}>
                                        <Button 
                                            variant="outlined" 
                                            style={{margin: '0px 20px', backgroundColor: '#00b3b3', color: 'white'}}
                                            onClick={this.handleSubmmit}
                                        >
                                        <span style={{padding: '3px 12px'}}>SIGN IN</span>    
                                        </Button>
                                    </div>
                                </div>
                                <div style={{ width: '100%', textAlign: 'center', marginBottom: '15px'}}>
                                    <a href="#" style={{color: 'black'}} onClick={this.handleGuestLogin}>Login as a Guest user</a>
                                </div>
                            </form>
                        </Paper>
                    </div>
            </div>
        );
    }
}

export default withStyles(styles)(EditApp);