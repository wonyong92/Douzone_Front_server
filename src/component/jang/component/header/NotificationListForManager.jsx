// import React, {Component} from 'react';
// import {
//     ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Button, Popover
// } from '@material-ui/core';
// import DeleteIcon from '@material-ui/icons/Delete';
// import AssignmentIcon from '@material-ui/icons/Assignment';
// import Paper from "@material-ui/core/Paper";
// import List from "@material-ui/core/List";
// import axios from "axios";
// import Badge from "@material-ui/core/Badge";
// import CheckIcon from "@material-ui/icons/Check";
// import Grid from "@material-ui/core/Grid";
//
// class NotificationListForManager extends Component {
//     employeeNumber
//     userType
//     requests = [{id: 1, content: 'dummy'}]
//     eventSource
//     anchorEl
//     messageEventHandler
//
//     constructor(props, context) {
//         super(props, context);
//         console.log('constructor Notification')
//         // TODO : 하드코딩 없애기
//         this.userType = sessionStorage.getItem('userType')
//         this.employeeNumber = JSON.parse(sessionStorage.getItem('userData')).loginId
//         this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`);
//         this.state = {
//             anchorEl: null, requests: [{id: 1, content: 'dummy'}],page:1
//         };
//
//         this.messageEventHandler = async function (event) {
//             alert(`sse recv! ${JSON.stringify({id: event.id, content: JSON.stringify(event.data)})}`)
//             let getTotalCount = (await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=1`)).data.totalElement
//             this.setState({
//                 anchorEl: this.state.anchorEl, requests: this.state.requests, totalCount: getTotalCount
//             })
//         }.bind(this);
//
//         this.eventSource.onmessage = this.messageEventHandler;
//
//         this.eventSource.onerror = function (event) {
//             this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`) // 화살표 함수로 외부 this를 가져오면 경고가 없어진다
//             this.eventSource.onmessage = this.messageEventHandler;
//         }.bind(this);
//
//         this.registerAgain = this.registerAgain.bind(this)
//         this.handleToggleList = this.handleToggleList.bind(this)
//     }
//
//     async componentDidMount() {
//         let requests = await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=1`)
//         alert(`unread msg from server ${JSON.stringify(requests.data.data)}`)
//         let unreadMsg = requests.data.data// dto를 담은 배열
//         let mappedUnreadMsg = unreadMsg.map((request) => (({
//             id: request.messageId, content: request.message, unread: request.readTime === null
//         })))//dto에서 필요한 message 데이터를 새로운 id를 부여하여 requests에 담기
//         alert(`setState ${JSON.stringify(mappedUnreadMsg)}`)
//         let getTotalCount = requests.data.totalElement
//         this.setState({
//             anchorEl: null, requests: mappedUnreadMsg,//state에 담아서 유지
//             totalCount: getTotalCount,
//             hasNext : requests.data.hasNext
//         });
//     }
//
//     registerAgain = function () {
//         this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`)
//         this.eventSource.onmessage = async function (event) {
//             alert(`sse recv! ${JSON.stringify({id: event.id, content: JSON.stringify(event.data)})}`)
//             let getTotalCount = (await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=1`)).data.totalElement
//             this.setState({
//                 anchorEl: this.state.anchorEl, requests: this.state.requests, totalCount: getTotalCount
//             })
//         } // 새로운 eventSource로 변경 발생하면 다시 onMessage에 대한 처리 등록 필요 -> 다른 코드 없을까?
//     }.bind(this);
//
//
//     handleToggleList = (handleEvent) => {
//         console.log(`handleToggleList`)
//         this.registerAgain()
//         this.anchorEl = handleEvent.currentTarget
//         this.setState({anchorEl: this.anchorEl, requests: this.state.requests, totalCount: this.state.totalCount});
//     };
//
//     handleCloseList = () => {
//         console.log(`handleCloseList`)
//         this.registerAgain()
//         this.setState({anchorEl: null, requests: this.state.requests, totalCount: this.state.totalCount});
//     };
//
//     handleDeleteRequest = (id) => {
//         // 요청 삭제 로직 구현
//         // 예: this.setState({ requests: updatedRequests });
//     };
//
//     readMore = async function (){
//         let response = (await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=${this.state.hasNext?this.state.page+1:this.state.page}`))
//         alert(`more message! ${JSON.stringify({newMessageLength: response.data.data.length, content: JSON.stringify(response.data.data)})}`)
//         alert(`old message! ${JSON.stringify(this.state.requests.map((saved) => saved.id))}`)
//
//         let unreadMsg = response.data.data// dto를 담은 배열
//         let mappedUnreadMsg = unreadMsg.map((request) => (
//             ({id: request.messageId, content: request.message, unread: request.readTime === null})
//         ))//dto에서 필요한 message 데이터를 새로운 id를 부여하여 requests에 담기
//         alert(`mappedUnreadNewMsg ${JSON.stringify(mappedUnreadMsg)}`)
//         mappedUnreadMsg = mappedUnreadMsg.filter((newPageMessage) =>
//             !this.state.requests.map((saved) => saved.id).includes(newPageMessage.id)
//         )
//         alert(`mappedUnreadNewMsg ${JSON.stringify(mappedUnreadMsg)}`)
//         let getTotalCount = response.data.totalElement
//         let hasNext = response.data.hasNext
//         alert(`totalcount : ${getTotalCount}`)
//         if(mappedUnreadMsg.length>0){
//             this.setState({
//                 anchorEl: this.state.anchorEl,
//                 requests: this.state.requests.concat(mappedUnreadMsg),
//                 totalCount: getTotalCount,
//                 hasNext : hasNext,
//                 page:this.state.hasNext?this.state.page+1:this.state.page
//             })
//         }
//     }.bind(this)
//
//
//     render() {
//         const {anchorEl, requests, totalCount} = this.state;
//         const isOpen = Boolean(anchorEl);
//         console.log(`SSE 실행!!!!! requests ${JSON.stringify(requests)} ${anchorEl}`)
//         console.log('SSE 실행 끝!!!!!')
//         return (<div>
//             <Badge badgeContent={totalCount} color="secondary">
//                 <AssignmentIcon variant="contained" color="white" onClick={this.handleToggleList}
//                                 fontSize={"large"}>
//                 </AssignmentIcon>
//             </Badge>
//             <Popover
//                 open={isOpen}
//                 anchorEl={anchorEl}
//                 onClose={this.handleCloseList}
//                 anchorOrigin={{
//                     vertical: 'bottom', horizontal: 'left',
//                 }}
//                 transformOrigin={{
//                     vertical: 'top', horizontal: 'left',
//                 }}
//             >
//                 <Paper elevation={3} style={{padding: '16px', width: '300px'}}>
//
//                     <List>
//                         <Grid
//                             container
//                             direction="row"
//                             justifyContent="space-evenly"
//                             alignItems="center"
//                         >
//                             {requests.map((request) => (<ListItem key={request.id} spacing={2}>
//                                 <Grid item xs={10} sm={10} md={10}>
//                                     <ListItemText primary={request.content}/>
//                                 </Grid>
//                                 <Grid item>
//                                     {/*<ListItemSecondaryAction>*/}
//                                         <IconButton edge="end" aria-label="check"
//                                                     onClick={() => this.handleDeleteRequest(request.id)}>
//                                             <CheckIcon color={request.unread ? "primary" : "secondary"}/>
//                                         </IconButton>
//                                 </Grid>
//                                 <Grid item>
//                                         <IconButton edge="end" aria-label="delete"
//                                                     onClick={() => this.handleDeleteRequest(request.id)}>
//                                             <DeleteIcon/>
//                                         </IconButton>
//                                     {/*</ListItemSecondaryAction>*/}
//                                 </Grid>
//                             </ListItem>))}
//                         </Grid>
//                     </List>
//                     <div onClick={this. readMore}>
//                     <Typography variant="body2" color="primary"
//                                 style={{textDecoration: 'underline', marginTop: '10px'}}>
//                         더 많은 요청 보기
//                     </Typography>
//                     </div>
//                 </Paper>
//             </Popover>
//         </div>);
//     }
// }
//
// export default NotificationListForManager;

import React, {Component} from 'react';
import {
    Paper, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Button, Popover
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import NotificationsIcon from "@material-ui/icons/Notifications";
import Badge from "@material-ui/core/Badge";
import axios from "axios";
import AssignmentIcon from "@material-ui/icons/Assignment";
import CheckIcon from '@material-ui/icons/Check';
import Grid from "@material-ui/core/Grid";

class NotificationListForManager extends Component {
    employeeNumber
    userType
    requests = [{id: 1, content: 'dummy'}]
    eventSource
    anchorEl
    messageEventHandler

    constructor(props, context) {
        super(props, context);
        console.log('constructor Notification')
        // TODO : 하드코딩 없애기
        this.userType = sessionStorage.getItem('userType')
        this.employeeNumber = JSON.parse(sessionStorage.getItem('userData')).loginId

        this.state = {
            anchorEl: null, requests: [{id: 1, content: 'dummy'}], totalCount: 0, page: 1
        };
        this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`);

        this.messageEventHandler = async function (event) {
            let requests = await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=${this.state.page}`)
            let id = this.state.requests.length + 1
            alert(`sse recv! ${JSON.stringify({id: JSON.stringify(event.id), content: JSON.stringify(event.data)})}`)
            let getTotalCount = requests.data.totalElement
            let hasNext = requests.data.hasNext
            this.setState({
                anchorEl: this.state.anchorEl, requests: this.state.requests.concat({
                    id: event.id,
                    content: event.data,
                    unread: event.data.readTime == null,
                    forManager: event.data.forManager
                }), totalCount: getTotalCount, hasNext: hasNext
            })
        }.bind(this);

        this.eventSource.onmessage = this.messageEventHandler

        this.eventSource.onerror = this.onErrorHandler.bind(this,this.onErrorHandler.bind(this));

        this.registerAgain = this.registerAgain.bind(this)
        this.handleToggleList = this.handleToggleList.bind(this)
    }

    onErrorHandler = async function(callback) {

        alert('manager registerAgain!')
        this.eventSource.close()
        this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`) // 화살표 함수로 외부 this를 가져오면 경고가 없어진다
        this.eventSource.onmessage = this.messageEventHandler
        this.eventSource.onerror=callback.bind(this,callback.bind(this))

        let response = await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=${this.state.page}`)
        alert(`unread msg from server ${JSON.stringify(response.data.data)}`)
        let unreadMsg = response.data.data// dto를 담은 배열
        let mappedUnreadMsg = unreadMsg.map((request) => (({
            id: request.messageId,
            content: request.message,
            unread: request.readTime === null
        })))//dto에서 필요한 message 데이터를 새로운 id를 부여하여 requests에 담기
        alert(`setState ${JSON.stringify(mappedUnreadMsg)}`)
        let getTotalCount = response.data.totalElement
        let hasNext = response.data.hasNext
        this.setState({
            anchorEl: null, requests: mappedUnreadMsg,//state에 담아서 유지
            totalCount: getTotalCount, hasNext: hasNext
        });


    }

    async componentDidMount() {
        let requests = await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=1`)
        alert(`unread msg from server ${JSON.stringify(requests.data)}`)
        let unreadMsg = requests.data.data// dto를 담은 배열
        let mappedUnreadMsg = unreadMsg.map((request) => (({
                id: request.messageId,
                content: request.message,
                unread: request.readTime === null,
                forManager: request.forManager
            })))//dto에서 필요한 message 데이터를 새로운 id를 부여하여 requests에 담기
        alert(`setState ${JSON.stringify(mappedUnreadMsg)}`)
        let getTotalCount = requests.data.totalElement
        let hasNext = requests.data.hasNext
        this.setState({
            anchorEl: null, requests: mappedUnreadMsg,//state에 담아서 유지
            totalCount: getTotalCount, hasNext: hasNext, page: 1
        });
    }

    registerAgain = async function () {

        this.eventSource.close()
        this.eventSource = new EventSource(`http://localhost:8080/register/manager?employeeNumber=${this.employeeNumber}&userType=${this.userType}`)

        this.eventSource.onerror = this.onErrorHandler.bind(this,this.onErrorHandler.bind(this));

        this.eventSource.onmessage = async function (event) {
            let response = (await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=${this.state.page}`))
            let id = this.state.requests.length + 1
            alert(`sse recv! ${JSON.stringify({id: id, content: JSON.stringify(event.data)})}`)
            let getTotalCount = response.data.totalElement
            let hasNext = response.data.hasNext
            alert(`totalcount : ${getTotalCount}`)
            this.setState({
                anchorEl: this.state.anchorEl,
                requests: this.state.requests,
                totalCount: getTotalCount,
                hasNext: hasNext
            })
        }.bind(this) // 새로운 eventSource로 변경 발생하면 다시 onMessage에 대한 처리 등록 필요 -> 다른 코드 없을까?
    }.bind(this);


    handleToggleList = (handleEvent) => {
        console.log(`handleToggleList`)
        this.registerAgain()
        this.anchorEl = handleEvent.currentTarget
        this.setState({anchorEl: this.anchorEl, requests: this.state.requests, totalCount: this.state.totalCount});
    };

    handleCloseList = () => {
        console.log(`handleCloseList`)
        this.registerAgain()
        this.setState({anchorEl: null, requests: this.state.requests, totalCount: this.state.totalCount});
    };

    handleDeleteRequest = (id) => {
        // 요청 삭제 로직 구현
        // 예: this.setState({ requests: updatedRequests });
    };

    readMore = async function () {
        let response = (await axios.get(`http://localhost:8080/unread/manager/${this.employeeNumber}?page=${this.state.hasNext ? this.state.page + 1 : this.state.page}`))
        alert(`more message! ${JSON.stringify({
            newMessageLength: response.data.data.length, content: JSON.stringify(response.data.data)
        })}`)
        alert(`old message! ${JSON.stringify(this.state.requests.map((saved) => saved.id))}`)

        let unreadMsg = response.data.data// dto를 담은 배열
        let mappedUnreadMsg = unreadMsg.map((request) => (({
                id: request.messageId,
                content: request.message,
                unread: request.readTime === null
            })))//dto에서 필요한 message 데이터를 새로운 id를 부여하여 requests에 담기
        alert(`mappedUnreadNewMsg ${JSON.stringify(mappedUnreadMsg)}`)
        mappedUnreadMsg = mappedUnreadMsg.filter((newPageMessage) => !this.state.requests.map((saved) => saved.id).includes(newPageMessage.id))
        alert(`mappedUnreadNewMsg ${JSON.stringify(mappedUnreadMsg)}`)
        let getTotalCount = response.data.totalElement
        let hasNext = response.data.hasNext
        alert(`totalcount : ${getTotalCount}`)
        if (mappedUnreadMsg.length > 0) {
            this.setState({
                anchorEl: this.state.anchorEl,
                requests: this.state.requests.concat(mappedUnreadMsg),
                totalCount: getTotalCount,
                hasNext: hasNext,
                page: this.state.hasNext ? this.state.page + 1 : this.state.page
            })
        }
    }.bind(this)

    changeToRead = async function (messageId) {
        try {
            let response = await axios.get(`http://localhost:8080/notification/manager/read/${messageId}`)
            if (response.status === 200) {
                alert(`read message ${messageId}`)
                let filteredMsg = this.state.requests.filter((entity) => entity.id !== messageId)
                alert(`${JSON.stringify(filteredMsg)}`)
                //TODO: totalCount도 다시 바꾸기 - 백엔드에서 전달받기
                this.setState({requests: filteredMsg, totalCount: response.data.totalcount})
            } else {
            }
        } catch (error) {
            alert(`메세지 전환 실패 ${error.response.status}`)
        }
    }.bind(this)

    render() {
        const {anchorEl, requests, totalCount} = this.state;
        const isOpen = Boolean(anchorEl);
        console.log(`SSE 실행!!!!! requests ${JSON.stringify(requests)} ${totalCount}`)
        console.log('SSE 실행 끝!!!!!')
        return (<div>
                <Badge badgeContent={totalCount} color="secondary">
                    <AssignmentIcon variant="contained" color="white" onClick={this.handleToggleList}
                                    fontSize={"large"}>
                    </AssignmentIcon>
                </Badge>
                <Popover
                    open={isOpen}
                    anchorEl={anchorEl}
                    onClose={this.handleCloseList}
                    anchorOrigin={{
                        vertical: 'bottom', horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top', horizontal: 'left',
                    }}
                >
                    <Paper elevation={3} style={{padding: '16px', width: '300px'}}>
                        <List>
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-evenly"
                                alignItems="center"
                            >
                                {requests.map((request) => (

                                    <ListItem key={request.id} spacing={2}>
                                        <Grid item xs={10} sm={10} md={10}>
                                            <ListItemText primary={request.content}/>
                                        </Grid>
                                        <Grid item>
                                            <IconButton edge="end" aria-label="check"
                                                        onClick={() => this.changeToRead(request.id)}>
                                                <CheckIcon color={request.unread ? "primary" : "secondary"}/>
                                            </IconButton>
                                        </Grid>
                                    </ListItem>))}
                            </Grid>
                        </List>
                        <div>
                            <Typography variant="body2" color="primary" onClick={this.readMore}
                                        style={{textDecoration: 'underline', marginTop: '10px'}}>
                                새로운 메세지 확인
                            </Typography>
                        </div>
                    </Paper>
                </Popover>
            </div>);
    }
}

export default NotificationListForManager