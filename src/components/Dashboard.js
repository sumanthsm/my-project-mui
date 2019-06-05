import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EditIcon from '@material-ui/icons/Edit';
import TableChartIcon from '@material-ui/icons/TableChart';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ErrorIcon from '@material-ui/icons/Error';
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
  editIcon: {
    padding: '5px 0px',
    cursor: 'pointer',
    "&:hover": {
      color: 'black'
    }
  },
  tableIcon: {
    padding: '5px 0px',
    cursor: 'pointer',
    "&:hover": {
      color: 'black'
    }
  },
  rocketIcon: {
    color: 'white',
    fontSize: '15px',
    textDecoration: 'none',
    "&:hover": {
      color: 'black'
    }
  },
  emailIcon: {
    color: 'white',
    textDecoration: 'none',
    "&:hover": {
      color: 'black'
    }
  }
});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shortcutsData: null
    }
  }

  componentDidMount() {
    this.getShortcutsData();
  }

  handleEditApp = (appId) => {
    console.log("handleEditApp");
    window.scrollTo(0, 0);
    this.props.onEditClick(appId);
  }

  handleShortcut = (appId) => {
    axios.post('http://localhost:5000/api/shortcutsdata', { appId: appId })
      .then((response) => {
        if (response.data.status === 'success') {
          this.getShortcutsData();
          setTimeout(() => {
            this.props.getShortcutsData();
          }, 500);
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

  getShortcutsData = () => {
    axios.get('http://localhost:5000/api/shortcutsdata')
      .then((response) => {
        let data = response.data;
        console.log(data, "shortcuts data");
        setTimeout(() => {
          this.setState({ shortcutsData: data });
        }, 1000);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleShortcutDelete = (appId) => {
    this.props.handleShortcutDelete(appId);
    setTimeout(() => {
      this.getShortcutsData();
    }, 500);

    // console.log("handleShortcutDelete");
    // console.log(this.props.shortcutsData, "this.props.shortcutsData");
    // setTimeout(() => {
    //   console.log(this.props.shortcutsData, "this.props.shortcutsData");
    //   this.setState({shortcutsData: this.props.shortcutsData})
    // }, 2000);
  }

  onFavButtonClick = (appId) => {
    const { shortcutsData } = this.state;
    let flag = false;
    for (let i = 0; i < shortcutsData.length; i++) {
      if (appId === shortcutsData[i].appId) {
        flag = true;
        break;
      }
    }
    if (flag) {
      this.handleShortcutDelete(appId);
    } else {
      this.handleShortcut(appId);
    }
  }

  onTableViewClick = () => {
    this.props.onTableViewButtonClick();
  }

  render() {
    const { classes, appId, appData, isLogin } = this.props;
    const { shortcutsData } = this.state;
    console.log(shortcutsData, "dash board");

    return (
      <div>
        <div className={classes.toolbar} />
        <Grid container className={classes.root} style={{ margin: '0px 0px 30px 0px', overflow: 'hidden' }}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={10} style={{ marginBottom: '10px' }}>
              {appData.map((app, i) => (
                <Grid key={i} item>
                  <Paper
                    elevation={4}
                    className={classes.paper}
                    style={{
                      marginTop: '10px',
                      backgroundImage: (() => {
                        if (appId === app.appId) {
                          return 'radial-gradient(circle, white, #ebebe0, #ebebe0)';
                        } else {
                          return 'radial-gradient(circle, white, #4ddbff, #00ccff)';
                        }
                      })()
                    }}>
                    <div style={{ display: 'block', paddingTop: '20px', textAlign: 'center' }}>
                      <h2 style={{ color: 'white' }}>{app.appAbrv}</h2>
                      <p>{app.appName}</p>
                      <div style={{ display: 'inline-flex', color: 'white' }}>
                        {isLogin && <div style={{ width: '30px' }}>
                          <EditIcon className={classes.editIcon} onClick={() => this.handleEditApp(app.appId)} />
                        </div>
                        }
                        <div style={{ width: '30px' }}>
                          <TableChartIcon className={classes.tableIcon} onClick={this.onTableViewClick} />
                        </div>
                        {isLogin && <div style={{ width: '30px' }}>
                          <a href={app.appUrl} target="_blank" className={classes.rocketIcon}>
                            <i className="fa fa-rocket"></i>
                          </a>
                        </div>}
                        {isLogin && <div style={{ width: '30px' }} >
                          <a href={`mailto:${app.appContactEmail}`} target="_blank" className={classes.emailIcon}>
                            <ErrorIcon style={{fontSize: '20px'}}/>
                          </a>
                        </div>}
                      </div>
                      {isLogin && <div>
                        <FavoriteIcon
                          style={{
                            cursor: 'pointer',
                            color: (() => {
                              let color = 'white';
                              if (shortcutsData) {
                                for (let i = 0; i < shortcutsData.length; i++) {
                                  if (shortcutsData[i].appId === app.appId) {
                                    color = '#f50057';
                                    break;
                                  } else {
                                    color = 'white'
                                  }
                                }
                              }
                              return color;
                            })()
                          }}
                          onClick={() => this.onFavButtonClick(app.appId)} />
                      </div>}

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