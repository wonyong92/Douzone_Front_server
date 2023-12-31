
//Todo: 이거 승인반려 다이어 로그 처리못함

import Box from "@material-ui/core/Box";
import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import axios from "axios";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Pagination from "react-js-pagination";
import VacationProcessListComponent from "../Component/VacationProcessListComponent";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton, Snackbar,
    SvgIcon
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {stateStore} from "../../../index";
import {Alert} from "@material-ui/lab";

// const {employeeId} = this.props;
// const {closeModal} = this.props
const styles = (theme) => ({

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    text: {
        fontSize: '16px',
        fontFamily:'IBM Plex Sans KR',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        fontWeight:'bold'
    },
    titleText: {
        fontSize: '20px',
        fontFamily:'IBM Plex Sans KR',
        fontWeight: 'bold',
        whiteSpace: 'nowrap'
    },
    button: {
        height: "90%",
        fontSize: '1rem'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px',
        listStyle: 'none',
        padding: 0,
    },
    pageItem: {
        margin: '0 8px',
        '& a': {
            textDecoration: 'none',
            color: 'black',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '35px',
            width: '35px',
            borderRadius: '50%',
        },
        '&:hover': {
            border: '1px solid #ddd',
        },
    },
    activePageItem: {
        '& a': {
            color: '#007bff', // 번호 색상을 파란색으로 변경
        },
        '&:hover': {
            border: '1px solid #ddd',
        },
    },
    tableHead: {
        backgroundColor: '#F2F2F2',
        borderTop: '1.5px solid black',
    }

});

class VacationProcess extends Component {
    searchKeyword;
    desc;
    sort;
    id;

    constructor(props) {
        super(props);
        this.state = {
            desc: '',
            sort: '',
            isSearch: '',
            activePage: 1,
            showPagiNation: 'flex',
            data: [],
            pageData: {totalElement:0},
            approveOpen: false,
            rejectOpen: false,
            dialogOpen: false,
            dialogTitle: '',
            dialogMessage: '',
            inputCheckSnackbarOpen:false,
            searchResultSnackbarOpen:false

        };

        this.searchKeyword = "";
        this.desc = "";
        this.sort = "";
        this.id = ""


        this.fetchData = this.fetchData.bind(this);
        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.sortChange = this.sortChange.bind(this);
        this.descChange = this.descChange.bind(this);
        this.onApproveBtnClick = this.onApproveBtnClick.bind(this);
        this.onRejectBtnClick = this.onRejectBtnClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.reRnderer = this.reRnderer.bind(this);
        this.handleInputCheck=this.handleInputCheck.bind(this);
        this.handleInputCheckClose=this.handleInputCheckClose.bind(this);
        this.handleSearchResultCheck=this.handleSearchResultCheck.bind(this);
        this.handleSearchResultCheckClose=this.handleSearchResultCheckClose.bind(this);
        this.showErrorDialog=this.showErrorDialog.bind(this);
    }

    handleInputCheck=()=>{
        this.setState({inputCheckSnackbarOpen:true});
    }

    handleInputCheckClose=()=>{
        this.setState({inputCheckSnackbarOpen:false});
    }

    handleSearchResultCheck=()=>{
        this.setState({searchResultSnackbarOpen:true});
    }

    handleSearchResultCheckClose=()=>{
        this.setState({searchResultSnackbarOpen:false});
    }


    searchKeywordChange = (e) => {
        this.searchKeyword = e.target.value;
    }

    showErrorDialog = (title, message) => {
        this.setState({
            dialogOpen: true,
            dialogTitle: title,
            dialogMessage: message,
        });
    };



    fetchData = async (page) => {

        let getPage = page;

        if (page != '') {
            getPage = '?page=' + getPage
        } else {
            this.desc = '';
            this.sort = '';
        }

        if (this.desc !== '' && this.sort !== '') {
            getPage = getPage + (getPage.includes('?') ? '&' : '?') + 'desc=' + this.desc + '&sort=' + this.sort;
        }

        try {
            const getVacationAllRequest = await axios.get('http://localhost:8080/manager/vacation/all/requested' + getPage);
            //console.log("getVacationAllRequest.data.data : ", getVacationAllRequest.data.data);

            const getVacationAllRequestData = getVacationAllRequest.data.data.map(item => {
                return {
                    vacationRequestKey: item.vacationRequestKey,
                    employeeId: item.employeeId,
                    name: item.name,
                    vacationCategoryKey: item.vacationCategoryKey,
                    vacationStartDate: item.vacationStartDate,
                    vacationEndDate: item.vacationEndDate,
                    reason: item.reason,
                    vacationRequestTime: item.vacationRequestTime,
                };
            });

            //console.log("1. getVacationAllRequestData : ", getVacationAllRequestData);


            this.setState({
                isSearch: false,
                activePage: page,
                showPagiNation: 'flex',
                data: getVacationAllRequestData,
                pageData: getVacationAllRequest.data,
                desc: this.desc,
                sort: this.sort
            });
        }catch (error) {
            let errorMessage = "데이터를 불러오는 중 오류가 발생했습니다.";
            if (error.response) {
                const { status } = error.response;
                if (status === 400) {
                    errorMessage = "400 잘못된 요청입니다";
                } else if (status === 500) {
                    // errorMessage = "500 Internal Server Error!";
                } else if (status === 403) {
                    errorMessage = "403 Forbidden Error!";
                }else if (status === 409) {
                    errorMessage = "409 진행 중인 요청이 있습니다!";
                }
            } else {
                console.error('Error:', error);
            }
            this.showErrorDialog('Error', errorMessage);
        }


    }




    // 다이얼로그 닫기 함수
    closeDialog = () => {
        this.setState({ dialogOpen: false });
    };


    showDialog = (title, message) => {
        this.setState({
            dialogOpen: true,
            dialogTitle: title,
            dialogMessage: message,
        });
    };

    handleSearchButtonClick = async (e) => {
        // 검색 버튼 클릭 시 수행할 로직
        const searchKeyword = this.searchKeyword;
        const regex = /^[a-zA-Z0-9가-힣]{0,12}$/;
        if (!regex.test(searchKeyword)) {
            this.handleInputCheck();
            // alert("올바르지 않은 입력입니다!");
            return;
        }

        if (searchKeyword === "") {
            const page = "";
            this.fetchData(page);
        } else {
            try {
                const searchRawData = await axios.get(`http://localhost:8080/manager/search/vacation/all/requested?searchParameter=${searchKeyword}`);
                //console.log("searchRawData :", searchRawData);

                if (searchRawData.data === "") {
                    this.handleSearchResultCheck();
                    // alert("검색 결과가 없습니다!");
                    return;
                }

                const getSearchAllVacationRequest = searchRawData.data.map(item => {
                    return {
                        vacationRequestKey: item.vacationRequestKey,
                        employeeId: item.employeeId,
                        name: item.name,
                        vacationCategoryKey: item.vacationCategoryKey,
                        vacationStartDate: item.vacationStartDate,
                        vacationEndDate: item.vacationEndDate,
                        reason: item.reason,
                        vacationRequestTime: item.vacationRequestTime,

                    };
                });


                this.setState({

                    data: getSearchAllVacationRequest,
                    showPagiNation: "None",
                    isSearch: true,
                    sort: "",
                    desc: "",

                });

            } catch (error) {
                let errorMessage = "An error occurred!";
                if (error.response) {
                    switch (error.response.status) {
                        case 400:
                            errorMessage = "400 Bad Request 에러!";
                            break;
                        case 500:
                            errorMessage = "500 Internal Server 에러!";
                            break;
                        case 403:
                            errorMessage = "403 권한이 없습니다!";
                            break;
                        default:
                            errorMessage = "An error occurred while fetching data!";
                            break;
                    }
                } else {
                    console.error('Error:', error);
                    errorMessage = "An error occurred while fetching data!";
                }
                this.showErrorDialog('Error', errorMessage);
            }
        }
    };

    sortChange = (e) => {
        this.sort = e.target.value;
        this.setState({...this.state, sort: this.sort, desc: ""});


    }

    descChange = (e) => {
        this.desc = e.target.value;
        if (!this.state.isSearch) {
            this.fetchData(1);
        } else {
            let data = "";

            if (this.desc === "asc") {
                data = this.state.data.sort((a, b) => {

                    const dateA = new Date(a.vacationRequestTime);
                    const dateB = new Date(b.vacationRequestTime);
                    return dateA - dateB;
                });
            } else {
                data = this.state.data.sort((a, b) => {

                    const dateA = new Date(a.vacationRequestTime);
                    const dateB = new Date(b.vacationRequestTime);
                    return dateB - dateA;
                });
            }
            this.setState({data: data, desc: this.desc});
        }
    };


    onApproveBtnClick = () => {
        this.setState({...this.state, approveOpen: true}, () => {
            // 상태가 변경된 후에 실행되는 부분
            const page = '';
            this.fetchData(page);
        });
    };

    onRejectBtnClick = () => {
        this.setState({...this.state, rejectOpen: true}, () => {
            // 상태가 변경된 후에 실행되는 부분
            const page = '';
            this.fetchData(page);
        });
    };

    handleClose = (employeeId) => {
        stateStore.chartContainerStateSet.setState({...stateStore.chartContainerStateSet.state})
        stateStore.vacationChartStateSet.setState({...stateStore.vacationChartStateSet.state})
        this.setState({...this.state, approveOpen: false, rejectOpen: false})

    };

    componentDidMount() {
        const {employeeId} = this.props;

        const page = '';
        this.fetchData(page);
    }
    reRnderer = function(value){
        this.setState(value)
    }

    render() {
        const {searchKeyword, data} = this.state;
        const {classes} = this.props;
        const {dialogOpen, dialogTitle, dialogMessage} = this.state;

        return (
            <div>
                <Snackbar anchorOrigin={{horizontal: 'center',vertical:'top'}}  open={this.state.inputCheckSnackbarOpen} autoHideDuration={2000} onClose={this.handleInputCheckClose}>
                    <Alert onClose={this.handleInputCheckClose} severity="warning">
                        올바르지 않은 입력입니다!
                    </Alert>
                </Snackbar>
                <Snackbar anchorOrigin={{horizontal: 'center',vertical:'top'}}  open={this.state.searchResultSnackbarOpen} autoHideDuration={2000} onClose={this.handleSearchResultCheckClose}>
                    <Alert onClose={this.handleSearchResultCheckClose} severity="warning">
                        검색 결과가 없습니다!
                    </Alert>
                </Snackbar>
                <Dialog
                    open={dialogOpen}
                    onClose={this.closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.closeDialog} color="primary">
                            확인
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.approveOpen} onClose={this.handleClose}>
                    <DialogTitle>연차 신청 승인</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            승인 완료 하였습니다!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={this.state.rejectOpen} onClose={this.handleClose}>
                    <DialogTitle>연차 신청 반려</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            반려 완료 하였습니다!
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>


                <Grid item lg={12}>
                    <Box style={{width:"1600px",margin:"10px 30px 30px 30px"}} >
                        <Box
                            sx={{
                                fontSize: '30px',
                                fontFamily:'IBM Plex Sans KR',
                                fontWeight: 'bold',
                                borderBottom: 'solid 1px black',
                                margin: '20px 0 20px 0',
                                paddingBottom: '10px'
                            }}>
                            연차 요청 처리
                        </Box>
                        <Box style={{border:'1px solid black', padding:'10px',borderRadius:'10px',display:"flex",justifyContent:'space-evenly'}} >
                            <TextField id="outlined-basic" label="사원 명/사원번호(최대 12자리)" variant="outlined" style={{width: "95%", height:"56px"}} onChange={this.searchKeywordChange}/>

                            <IconButton
                                onClick={this.handleSearchButtonClick}
                                style={{
                                    borderRadius: '6px',
                                    width: "4%",
                                    border: '1px solid #c1c1c1',
                                    height: "56px"}}>
                                <SearchIcon />
                            </IconButton>

                                {/*<SvgIcon style={{*/}
                                {/*    borderRadius: '6px',*/}
                                {/*    width: "4%",*/}
                                {/*    border: '1px solid #c1c1c1',*/}
                                {/*    height:"56px"*/}
                                {/*}}*/}
                                {/*         cursor="pointer" component={SearchIcon} onClick={this.handleSearchButtonClick}/>*/}
                                {/*<Button className={classes.button} variant="outlined" onClick={this.handleSearchButtonClick} >검색</Button>*/}

                        </Box>

                        <Box component="" style={{display: "flex", justifyContent: "flex-end", marginBottom: '10px'}}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id={`demo-simple-select-label`}>정렬 기준</InputLabel>
                                <Select
                                    labelId={`demo-simple-select-label`}
                                    id={`demo-simple-select`}
                                    value={this.state.sort}
                                    onChange={this.sortChange}>
                                    <MenuItem value={"vacationRequestTime"}>신청 시간</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel id={`demo-simple-select-label`}>정렬 방식</InputLabel>
                                <Select
                                    labelId={`demo-simple-select-label`}
                                    id={`demo-simple-select`}
                                    value={this.state.desc}
                                    onChange={this.descChange}>
                                    <MenuItem value={"asc"}>오름차순</MenuItem>
                                    <MenuItem value={"desc"}>내림차순</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <TableContainer component={Paper}>
                            <Table className={classes.table}>
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell align="center" className={classes.titleText}>일련 번호</TableCell>
                                        <TableCell align="center" className={classes.titleText}>사원 번호</TableCell>
                                        <TableCell align="center" className={classes.titleText}>사원 이름</TableCell>
                                        <TableCell align="center" className={classes.titleText}>연차 시작 날짜</TableCell>
                                        <TableCell align="center" className={classes.titleText}>연차 종료 날짜</TableCell>
                                        <TableCell align="center" className={classes.titleText}>신청 사유</TableCell>
                                        <TableCell align="center" className={classes.titleText}>신청 시간</TableCell>
                                        <TableCell align="center" className={classes.titleText}>승인</TableCell>
                                        <TableCell align="center" className={classes.titleText}>반려</TableCell>
                                        <TableCell align="center" className={classes.titleText}>반려 사유</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (

                                        <VacationProcessListComponent className={classes.text} id={JSON.parse(sessionStorage.getItem('userData')).loginId}
                                                                      onApproveBtnClick={this.onApproveBtnClick}
                                                                      onRejectBtnClick={this.onRejectBtnClick}
                                                                      key={row.vacationRequestKey} row={row}
                                                                      keyData={row.vacationRequestKey}
                                                                      parentRerender={this.reRnderer}
                                                                      title={["승인", "반려"]}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box component="section"
                             sx={{display: this.state.showPagiNation, alignItems: 'center', justifyContent: 'center'}}>
                            <Pagination
                                activePage={parseInt(this.state.activePage)}
                                itemsCountPerPage={this.state.pageData.size}
                                totalItemsCount={this.state.pageData.totalElement}
                                pageRangeDisplayed={10}
                                onChange={(page) => this.fetchData(page)}
                                innerClass={classes.pagination} // 페이징 컨테이너에 대한 스타일
                                itemClass={classes.pageItem} // 각 페이지 항목에 대한 스타일
                                activeClass={classes.activePageItem} // 활성 페이지 항목에 대한 스타일
                            />
                        </Box>
                    </Box>




                </Grid>
            </div>

        )
    }
}

export default withStyles(styles)(VacationProcess);