import React, {Component} from 'react';
import {Grid, Typography, withStyles} from '@material-ui/core';
import VacationApprovalInfo from '../component/MainPageChart/VacationApprovalInfo';
import VacationRequestedInfo from '../component/MainPageChart/VacationRequestedInfo';
import VacationRejectedInfo from '../component/MainPageChart/VacationRejectedInfo';
import VacationMineEChart from '../component/MainPageChart/VacationMineEChart';
import UnApprovalAttendance from "../component/MainPageChart/UnApprovalAttendance";
import ApprovalAttendance from "../component/MainPageChart/ApprovalAttendance";
import ApprovalRequestedAttendance from "../component/MainPageChart/ApprovalRequestedAttendance";


const styles = theme => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height:'240px'
  
    },
    paper: {
        padding: theme.spacing(2),

    },
    combinedInfoSection: {
       height:"230px"
    },
    chartSection: {
        height: '230px',
    },
    verticalDivider: {
        height: '100%',
        width: '1px',
        backgroundColor: theme.palette.divider,
    },
    divider: {

        margin: theme.spacing(2, 0),
    },
    titleContainer: {
        display: 'flex',
        justifyContent: 'space-between', // 컨테이너 내용을 양 끝에 정렬합니다.
        alignItems: 'center', // 세로축 중앙 정렬
        width: '100%', // 부모 컨테이너의 전체 너비를 사용합니다.
    },
    title: {
        // '연차사용현황' 제목에 적용할 스타일
        flex: 1, // 남는 공간을 차지하도록 flex-grow 값 설정
        textAlign: 'center', // 텍스트를 왼쪽 정렬
        fontFamily:'IBM Plex Sans KR',
        fontWeight:'bold',
        color:"#2568ac",
        fontSize:"23px",

    },
    titleRight: {
        // '근태현황' 제목에 적용할 스타일
        flex: 1, // 남는 공간을 차지하도록 flex-grow 값 설정
        textAlign: 'center', // 텍스트를 오른쪽 정렬
        paddingLeft: theme.spacing(1), // 왼쪽 패딩 추가
        fontFamily:'IBM Plex Sans KR',
        fontWeight:'bold',
        color:"#2568ac",
        fontSize:"23px"
    },
});

class VacationDashboard extends Component {
    render() {
        const {classes} = this.props;
        const {currentYear,currentMonth} = this.props
        return (
            <div className={classes.root}>
                <Grid container style={{height:'240px'}} >
                    {/* 승인/요청/거절된 연차 정보와 출석 정보 섹션 */}
                    <Grid item xs={12} md={7} className={classes.combinedInfoSection}>
                            <Grid container spacing={1} className={classes.titleContainer}>

                                <Typography variant="h5" className={classes.title}>

                                    &nbsp;연차 사용 현황
                                </Typography>
                                {/*<Icon style={{color:"#2568ac"}} /> &nbsp;*/}
                                <Typography variant="h5" className={classes.titleRight}>

                                    &nbsp; 근태 현황
                                </Typography>
                            </Grid>
                            <Grid container spacing={1} style={{height:'200px'}}>
                                <Grid item xs={6}>
                                    <Grid container style={{justifyContent:"center",marginTop:"10px"}}>
                                        <Grid item>
                                            <VacationApprovalInfo year={currentYear} month={currentMonth}/>
                                        </Grid>
                                        <Grid item>
                                            <VacationRejectedInfo year={currentYear} month={currentMonth}/>
                                        </Grid>
                                        <Grid item>
                                            <VacationRequestedInfo year={currentYear} month={currentMonth}/>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={6}>
                                    <Grid container style={{justifyContent:"center",marginTop:"10px"}}>
                                        <Grid item>
                                            <ApprovalAttendance year={currentYear} month={currentMonth}/>
                                        </Grid>
                                        <Grid item>
                                            <UnApprovalAttendance year={currentYear} month={currentMonth}/>
                                        </Grid>
                                        <Grid item>
                                            <ApprovalRequestedAttendance year={currentYear} month={currentMonth}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                    </Grid>

                    {/* 차트 섹션 */}
                    <Grid item xs={2} md={5} className={classes.chartSection}>

                            <VacationMineEChart/>

                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(VacationDashboard);