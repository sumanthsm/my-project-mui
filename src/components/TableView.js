import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Zoom from '@material-ui/core/Zoom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import axios from 'axios';
import Swal from 'sweetalert2';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);
  
const styles = theme => ({
    root: {
        width: '100%',
        margin: '20px 50px',
        overflow: 'auto',
      },
      table: {
        minWidth: 700,
        overflow: 'auto'
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
    }
});

class TableView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appData: []
        }
    }

    componentDidMount() {
        this.getAppData();
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

    handleEditApp = (appId) => {
        console.log("handleEditApp");
        window.scrollTo(0,0);
        this.props.onEditClick(appId);
      }
    
    render() {
        const { classes, isTableView } = this.props;
        const { appData } = this.state;
        return (
            <div>
                <h3 style={{ marginLeft: '50px' }}>My Apps</h3>
                <Zoom in={isTableView}>
                    <div style={{ display: 'flex' }}>
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell style={{width: '8%'}}>APP ID</StyledTableCell>
                                        <StyledTableCell style={{width: '8%'}}>MARKER</StyledTableCell>
                                        <StyledTableCell style={{width: '20%'}}>NAME</StyledTableCell>
                                        <StyledTableCell style={{width: '25%'}}>URL</StyledTableCell>
                                        <StyledTableCell style={{width: '25%'}}>DESCRIPTION</StyledTableCell>
                                        <StyledTableCell align="right">ACTIONS</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody style={{fontSize : '12px'}}>
                                    {
                                        appData.map((app, i) => {
                                            return (
                                                <StyledTableRow key={app.appId}>
                                            <StyledTableCell component="th" scope="row" style={{width: '8%'}}>
                                                {app.appId}
                                            </StyledTableCell>
                                            <StyledTableCell style={{width: '8%'}}>{app.appAbrv}</StyledTableCell>
                                            <StyledTableCell style={{width: '20%'}}>{app.appName}</StyledTableCell>
                                            <StyledTableCell style={{width: '25%'}}>{app.appUrl}</StyledTableCell>
                                            <StyledTableCell style={{width: '25%'}}>{app.appDesc}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                <div style={{display: 'inline'}}>
                                                    <EditIcon style={{ padding: '5px 0px', cursor: 'pointer' }} onClick={() =>this.handleEditApp(app.appId)}/>
                                                    <ClearIcon style={{ padding: '5px 0px', cursor: 'pointer', color: '#e6005c' }} onClick={() =>this.handleDeleteApp(app.appId)}/>
                                                </div>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>
                </Zoom>
            </div>
        );
    }
}

export default withStyles(styles)(TableView);