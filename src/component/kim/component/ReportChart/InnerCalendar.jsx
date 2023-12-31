// import React, {Component} from 'react';
// import axios from "axios";
// import {withStyles} from "@material-ui/core/styles";
// import Calendar from "react-calendar";
// import moment from 'moment';
//
// const styles = (theme) => ({
//     dot: {
//     height: "4px",
//     width: "4px",
//     backgroundColor: "#63A1FF",
//     borderRadius: "50%",
//     display: "flex",
//     marginLeft: "1px",
// }
// });
//
// class InnerCalendar extends Component {
//     year
//     month
//     mark
//
//     constructor(props) {
//         super(props);
//         this.month = props.month
//         this.mark = []
//         this.year = props.year
//     }
//
//     async componentDidMount() {
//         axios.defaults.withCredentials = true;
//         let attendanceInfo = await axios.get(`http://localhost:8080/employee/attendance_info/?year=${this.year}&month=${this.month}&page=1&size=32`)
//         alert(`attendanceInfo ${JSON.stringify(attendanceInfo.data.data)}`)
//         let mapped = attendanceInfo.data.data.map(data =>
//             new Date(moment(data.startTime).format("YYYY-MM-DD")))
//         alert(`map attendanceInfo ${JSON.stringify(mapped)}`)
//
//         this.mark = [...mapped]
//     }
//
//     render() {
//         let mark = this.mark
//         let month = this.month
//         let year = this.year
//         let {classes}=this.props;
//         return (<div>
//                 <Calendar
//                     value={new Date(year + '-' + month + '-' + '01')}
//                     formatDay={(locale, date) => moment(date).format("DD")} // 날'일' 제외하고 숫자만 보이도록 설정
//                     minDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
//                     maxDetail="month" // 상단 네비게이션에서 '월' 단위만 보이게 설정
//                     navigationLabel={null}
//                     showNeighboringMonth={false} //  이전, 이후 달의 날짜는 보이지 않도록 설정
//                     className="mx-auto w-full text-sm border-b"
//                     tileContent={({ date, view }) => {
//                         // 날짜 타일에 컨텐츠 추가하기 (html 태그)
//                         // 추가할 html 태그를 변수 초기화
//                         const html = [];
//                         // 현재 날짜가 post 작성한 날짜 배열(mark)에 있다면, dot div 추가
//                         if (mark.find((x) => x === moment(date).format('YYYY-MM-DD'))) {
//                             html.push(<div className="dot"></div>);
//                         }
//                         // 다른 조건을 주어서 html.push 에 추가적인 html 태그를 적용할 수 있음.
//                         return (
//                             <>
//                                 <div className="flex justify-center items-center absoluteDiv">
//                                     {html}
//                                 </div>
//                             </>
//                         );
//                     }}
//                 />)
//             </div>);
//     }
// }
//
// export default withStyles(styles)(InnerCalendar);

import React, {Component} from 'react';
import axios from 'axios';
import {withStyles} from '@material-ui/core/styles';
import Calendar from 'react-calendar';
import moment from 'moment';
import 'react-calendar/dist/Calendar.css';

const styles = (theme) => ({

    normal_attendance: {
        height: '10px',
        width: '10px',
        backgroundColor: '#1B46C6',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    abnormal_attendance: {
        height: '10px',
        width: '10px',
        backgroundColor: '#D643B7',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    undefined_attendance: {
        height: '10px',
        width: '10px',
        backgroundColor: '#33CC4C',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    approved_abnormal_attendance: {
        height: '10px',
        width: '10px',
        backgroundColor: '#54040f',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    permitted_vacation: {
        height: '10px',
        width: '10px',
        backgroundColor: '#4F5DF8',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    request_vacation: {
        height: '10px',
        width: '10px',
        backgroundColor: '#B3A62C',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    rejected_vacation: {
        height: '10px',
        width: '10px',
        backgroundColor: '#F74F4F',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    undefined_vacation: {
        height: '10px',
        width: '10px',
        backgroundColor: '#fdda00',
        borderRadius: '50%',
        display: 'flex',
        marginLeft: '1px',
    },
    calendar: {
        width: '100%', // 캘린더 전체 너비
        maxWidth: '800px', // 최대 너비 설정
        fontSize: '30px', // 캘린더 내 텍스트 기본 폰트 크기
        height: '100%',
        maxHeight: '1900px',
        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // 그림자 효과 추가
        border: '1px solid #d3d3d3', // 테두리 색상 변경
        borderRadius: '10px', // 테두리 둥글게
        padding: '20px', // 내부 여백
    },
    calendarTile: {
        height: '150px',
        width: '100px',
        fontSize: '30px',
        lineHeight: '120px',
        margin: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.1)',
        borderRadius: '5px',
        backgroundColor: 'white', // 타일 배경색
    },


    // 각 날짜 타일의 크기 조절을 위한 스타일


});

class InnerCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mark: [],
        };
        this.month = props.month;
        this.year = props.year;
    }

    async componentDidMount() {
        const {classes} = this.props;
        axios.defaults.withCredentials = true;
        try {
            const attendanceInfo = await axios.get(
                `http://localhost:8080/employee/attendance_info/?year=${this.year}&month=${this.month}&page=1&size=32`
            );
            let mappedAttendance = []

            if (attendanceInfo.status !== 204) {
                mappedAttendance = attendanceInfo.data.data.map((data) => {
                        switch (data.attendanceStatusCategory) {
                            case '정상 근태':
                                return {
                                    date: moment(data.attendanceDate).format('YYYY-MM-DD'),
                                    category: classes.normal_attendance
                                }
                            case "이상 근태(결근)":
                            case "이상 근태(조기 퇴근)":
                            case "이상 근태(지각, 조기 퇴근)":
                            case "이상 근태(지각)":
                            case "이상 근태(퇴근 정보 없음)":
                                return {
                                    date: moment(data.attendanceDate).format('YYYY-MM-DD'),
                                    category: classes.abnormal_attendance
                                }
                            case "승인|이상 근태(조기 퇴근)":
                            case "승인|이상 근태(결근)":
                            case "승인|이상 근태(지각, 조기 퇴근)":
                            case "승인|이상 근태(지각)":
                            case "승인|이상 근태(지각, 퇴근 정보 없음)":
                                return {
                                    date: moment(data.attendanceDate).format('YYYY-MM-DD'),
                                    category: classes.approved_abnormal_attendance
                                }

                            case "조정 요청 중":
                                break;
                            default:
                                return {
                                    date: moment(data.attendanceDate).format('YYYY-MM-DD'),
                                    category: classes.undefined_attendance
                                }

                        }
                    }
                );
            }


            const vacationInfo = await axios.get(
                `http://localhost:8080/system/calendar/vacation_info?year=${this.year}&month=${this.month}`
            );


            const mappedVacation = vacationInfo.data.map((data) => {
                    switch (data.extendedProps.status) {
                        case "연차 요청 승인":

                            return {
                                date: moment(data.date).format('YYYY-MM-DD'),
                                category: classes.permitted_vacation
                            }

                        case "연차 요청 중":
                            return {
                                date: moment(data.date).format('YYYY-MM-DD'),
                                category: classes.request_vacation
                            }

                        case "연차 요청 반려":
                            return {
                                date: moment(data.date).format('YYYY-MM-DD'),
                                category: classes.rejected_vacation
                            }

                        default:
                            return {
                                date: moment(data.date).format('YYYY-MM-DD'),
                                category: classes.undefined_vacation
                            }

                    }
                }
            );
            // alert(`mappedVacation ${JSON.stringify(mappedVacation)}`)
            this.setState({mark: mappedAttendance.concat(mappedVacation)});


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    render() {
        const {classes} = this.props;
        const {mark} = this.state;
        const month = this.month;
        const year = this.year;
        return (
            <div>
                <Calendar
                    value={new Date(year + '-' + month + '-' + '01')}
                    formatDay={(locale, date) => moment(date).format('DD')}
                    minDetail="month"
                    maxDetail="month"
                    navigationLabel={null}
                    showNeighboringMonth={false}
                    className={`mx-auto w-full text-sm border-b ${classes.calendar}`}
                    tileContent={({ date }) => {
                        const dateString = moment(date).format('YYYY-MM-DD');
                        let find = mark.find((x) => x && x.date === dateString);
                        const html = find ? <div key={dateString} className={find.category}></div> : null;
                        return (
                            <div className="justify-center items-center absoluteDiv" style={{display: "flex"}}>
                                {html}
                            </div>
                        );
                    }}
                />
            </div>
        );
    }
}

export default withStyles(styles)(InnerCalendar);
