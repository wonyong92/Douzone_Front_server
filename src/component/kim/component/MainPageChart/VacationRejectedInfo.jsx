import React, {Component} from 'react';
import axios from 'axios';
import {Paper, Typography, withStyles} from "@material-ui/core";
import Icon from '@material-ui/icons/EventBusy';

const styles = theme => ({
    paper: {
        padding: theme.spacing(2),
        backgroundColor: 'white', // Set the background color to white
        borderRadius: 15,
        borderStyle: 'none',
        margin: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'flex-start', // 아이템을 왼쪽 정렬로 변경
    },
    title: {
        fontWeight: 'bold',
        color: 'red', // Ensure the title text is blue
        flexGrow: 1,
        fontFamily:'Noto Sans KR,sans-serif',
        fontSize:"18px"
    },
    infoText: {
        paddingTop: theme.spacing(1),
        fontFamily:'Noto Sans KR,sans-serif',
        fontSize:"18px"
    },
    monthTitle:{
        fontWeight: 'bold',
        fontFamily:'Noto Sans KR,sans-serif',
        verticalAlign: 'middle', // 수직 가운데 정렬
        fontSize:"18px"

    },
    countMonthTitle:{
        fontWeight: 'bold',
        fontFamily:'Noto Sans KR,sans-serif',
        color:'#2568ac'

    }
    // If you had other styles, make sure they are included here
});


class VacationRejectedInfo extends Component {
    state = {
        rejectedVacationCount: null,
    };

    componentDidMount() {
        this.loadRejectedMonthVacationData();
    }
    loopStop=false;
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.loopStop){
            this.loadRejectedMonthVacationData();
        }
    }

    loadRejectedMonthVacationData = () => {
        const {year, month} = this.props;
        //TODO: 로그인 기능 삭제

        axios.get(`http://localhost:8080/chart/rejectedmonthvacation?year=${year}&month=${month}`)
            .then(response => {
                this.setState({rejectedVacationCount: response.data});
                if (this.props.onDataLoaded) {
                    this.props.onDataLoaded(response.data);
                }
            })
            .catch(error => {
                console.error("Error fetching rejected vacation data: ", error);
            });
    }

    render() {
        this.loopStop=!this.loopStop;
        const {rejectedVacationCount} = this.state;
        const {classes, month} = this.props;

        const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
        const monthName = monthNames[month - 1];

        return (
            <Paper className={classes.paper}>

                <Typography variant="h6" gutterBottom className={classes.countMonthTitle}>
                    {monthName}
                </Typography>
                <Typography variant="h6" gutterBottom className={classes.monthTitle}>
                    &nbsp;연차&nbsp;
                </Typography>
                <Typography variant="h6" gutterBottom className={classes.title}>
                     반려
                </Typography>
                <Typography variant="h5" className={classes.infoText}>
                    {rejectedVacationCount !== null ? rejectedVacationCount : 'Loading...'}
                </Typography>
            </Paper>
        );
    }
}

export default withStyles(styles)(VacationRejectedInfo);
