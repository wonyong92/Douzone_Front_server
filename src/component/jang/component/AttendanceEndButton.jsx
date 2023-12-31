import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import {Dialog, DialogActions, DialogContent, DialogTitle, Snackbar,} from '@material-ui/core';
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import {Alert} from "@material-ui/lab";

class AttendanceEndButton extends Component {
    state = {dialogOn :false ,dialogOff:true,endTime:null,snackbarOpen:false,
        snackbarMessage:""}
    dialogOn=false
    dialogOff=true
    dialogShowToggle = () => {
        this.dialogOn=!this.dialogOn
        this.dialogOff=!this.dialogOff
        this.setState({dialogOn :false})
    }

    attendanceEnded = async () => {
        this.dialogOn=!this.dialogOn
        this.dialogOff=!this.dialogOff

        try{
            let response = await axios.post('http://localhost:8080/employee/leave')
            this.setState({
                snackbarOpen:true , snackbarMessage:"업무를 종료합니다!"
            })
            axios.defaults.withCredentials=true;
            let responseOfTodayInfo = await axios.get('http://localhost:8080/employee/attendance/today')
            let {endTime} = responseOfTodayInfo.data;
            if(endTime!=="null")
                this.setState({endTime:endTime,dialogOn :false ,dialogOff:true})

        }catch(error) {
            this.setState({
                snackbarOpen:true , snackbarMessage:"퇴근 요청 도중 문제 발생"
            })
            axios.defaults.withCredentials=true;
            let response = await axios.get('http://localhost:8080/employee/attendance/today')
            let {endTime} = response.data;
            if(endTime!=="null")
                this.setState({endTime:endTime,dialogOn :false ,dialogOff:true})
        }
    }
    handleSnackbarClose = (event , reason) =>{
        if(reason ==='clickawy'){
            return;
        }
        this.setState({snackbarOpen : false});
    }

    async componentDidMount() {
        axios.defaults.withCredentials=true;
        let response = await axios.get('http://localhost:8080/employee/attendance/today')
        let {endTime} = response.data;
        if(endTime!=="null")
            this.setState({endTime:endTime})
        // else{
        //     alert("퇴근 정보 없음")
        // }
    }

    render() {
        let endTime=null;
        if(this.state.endTime!==null){
            let currentDate = new Date(this.state.endTime);
            let hours = currentDate.getHours().toString().padStart(2,'0');
            let minutes = currentDate.getMinutes().toString().padStart(2,'0');
            let seconds = currentDate.getSeconds().toString().padStart(2,'0');
            endTime =hours + ':' + minutes + ':' + seconds;
        }

        return (<div>
            {endTime===null?<Button variant="outlined" onClick={this.dialogShowToggle} style={{color:"black",border:"1px solid #FF9933",width:'110px',height:'40px',fontFamily:'IBM Plex Sans KR',fontSize:'17px',borderRadius:'20px',fontWeight:'bold'}} >
                퇴근 입력
            </Button>:<Typography style={{
                fontFamily:'IBM Plex Sans KR',fontSize:'17px',fontWeight:'bold',textAlign:'center'
            }}>
                퇴근 <br/> {endTime}
            </Typography>}
            <Snackbar
                open={this.state.snackbarOpen}
                autoHideDuration={6000}
                onClose={this.handleSnackbarClose}
                anchorOrigin={{ vertical:'top', horizontal: 'center' }}
            >
                <Alert onClose={this.handleSnackbarClose} severity="warning">
                    {this.state.snackbarMessage}
                </Alert>
            </Snackbar>
            <Dialog open={this.dialogOn} onClose={this.dialogShowToggle} aria-labelledby="update-modal-title">
                <DialogTitle id="update-modal-title">업무 종료</DialogTitle>
                <DialogContent>
                    <p>업무를 종료하시겠습니까??</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.attendanceEnded} color="primary">
                        확인
                    </Button>
                    <Button onClick={this.dialogShowToggle} color="primary">
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </div>);
    }
}

export default AttendanceEndButton;