import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import TableChartIcon from '@material-ui/icons/TableChart';
import LaunchIcon from '@material-ui/icons/Launch';
import FavoriteIcon from '@material-ui/icons/Favorite';
import axios from 'axios';
import Swal from 'sweetalert2';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 200,
      width: 200,
      borderRadius: '50%',
      backgroundImage: 'radial-gradient(circle, white, #4ddbff, #00ccff)',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
  });

class Dashboard extends React.Component {

    componentDidMount(){

    } 

    handleEditApp = (appId) => {
      console.log("handleEditApp");
      window.scrollTo(0,0);
      this.props.onEditClick(appId);
    }

    handleShortcut = (appId) => {
      axios.post('http://localhost:5000/api/shortcutsdata', { appId: appId })
          .then((response) => {
              if (response.data.status === 'success') {
                  Swal.fire({
                      type: 'success',
                      title: 'Shortcut added Successfully.',
                      showConfirmButton: false,
                      timer: 1500
                  })
              } else {
                  Swal.fire({
                      type: 'error',
                      title: 'Oops...',
                      text: 'Shortcut already exists.',
                  })
              }
          })
          .catch(function (error) {
              console.log(error);
          });
    }

    onFavButtonClick = (appId) => {
      this.handleShortcut(appId);
      setTimeout(() => {
        this.props.shortcutsData();
    }, 2000);
    }

    onTableViewClick = () => {
      this.props.onTableViewButtonClick();
    }

    render(){
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.toolbar} />
        <Grid container className={classes.root} style={{margin: '0px 0px 30px 0px', overflow: 'hidden'}}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={10} style={{marginBottom: '10px'}}>
            {this.props.appData.map((app, i) => (
              <Grid key={i} item>
                <Paper elevation={4} className={classes.paper} >
                    <div style={{display: 'block', paddingTop: '20px', textAlign: 'center'}}>
                        <h2 style={{color: 'white'}}>{app.appAbrv}</h2>
                        <p>{app.appName}</p>
                        <div style={{ display: 'inline', color: 'white' }}>
                            <EditIcon style={{ padding: '5px 0px', cursor: 'pointer' }} onClick={() =>this.handleEditApp(app.appId)}/>
                            <TableChartIcon style={{ padding: '5px 0px', cursor: 'pointer' }} onClick={this.onTableViewClick}/>
                            <a href={app.appUrl} target="_blank" style={{color: 'white', textDecoration: 'none'}}>
                              <LaunchIcon style={{ padding: '5px 0px' }} />
                            </a>
                        </div>
                        <div>
                        <FavoriteIcon style={{color: 'white', cursor: 'pointer' }} onClick={() => this.onFavButtonClick(app.appId)}/>
                        </div>
                    </div>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      </div>
        );
    }
}

export default withStyles(styles)(Dashboard);