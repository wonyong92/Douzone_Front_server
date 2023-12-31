import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid, IconButton, Snackbar,
    SvgIcon
} from "@material-ui/core";
import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import axios from "axios";
import ButtonInListComponent from "../Component/ButtonInListComponent";
import TableCell from "@material-ui/core/TableCell";
import Pagination from "react-js-pagination";
import SearchIcon from "@material-ui/icons/Search";
import {Alert} from "@material-ui/lab";

// const { employeeId } = this.props;
// const {closeModal} = this.props

const styles = (theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    text :{
        fontSize:'16px',
        fontFamily:'IBM Plex Sans KR',
        textAlign: 'center',
        padding:'0px',
        fontWeight: 'bold'
    },
    titleText:{
        fontSize:'22px',
        fontFamily:'IBM Plex Sans KR',
        fontWeight:'bold',

    },
    button :{
        height:"100%",
        fontSize:'1rem'
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
    },table: {
    },
    tableHead: {
        backgroundColor: '#F2F2F2',
        borderTop: '1.5px solid black',
    }

});

class AttendanceApprovalAllEmployees extends Component{

    constructor(props) {
        super(props);
        this.state = {
            isSearch:false,
            activePage:1,
            showPagiNation: 'flex',
            data:[],
            empPageData:{totalElement:0},
            desc:"",
            sort:"",
            dialogOpen: false,
            dialogTitle: '',
            dialogMessage: '',
            snackbarOpen:false,
            snackbarMessage:"",

        };
        this.searchKeyword="";
        this.desc="";
        this.sort="";



        this.fetchData = this.fetchData.bind(this);
        this.handleSearchButtonClick = this.handleSearchButtonClick.bind(this);
        this.sortChange = this.sortChange.bind(this);
        this.descChange = this.descChange.bind(this);
    }

    searchKeyword;
    desc;
    sort;

    searchKeywordChange=(e)=>{
        this.searchKeyword = e.target.value;
    }



    fetchData=async(page)=> {
        // //console.log("PageNationStyle",PageNationStyle);

        let getPage = page;
        //console.log("page : ", page);

        if (page != '') {
            getPage = '?page=' + getPage
        } else {
            this.desc=''; //최소한의 setState를 사용하기 위해 작성
            this.sort='';
        }

        if (this.desc !== '' && this.sort !== '') {
            getPage = getPage + (getPage.includes('?') ? '&' : '?') + 'desc=' + this.desc + '&sort=' + this.sort;
        }

        try {
            const employeeData = await axios.get('http://localhost:8080/manager/employees' + getPage);
            //console.log("employeeData.data : ", employeeData.data)
            const empPageData = employeeData.data //페이지 객체 데이터
            const empData = employeeData.data.data; //사원정보 데이터

            const newData = empData.map(({employeeId,name})=>({employeeId,name}))
            //console.log("newData : ",newData);

            const input = this.state.isSearch===false?"sort":"search";
            if(input==="sort"){
                //console.log("sort");
                this.setState({
                    ...this.state,
                    empPageData: empPageData,
                    data: newData,
                    activePage: page,
                    showPagiNation: 'flex',
                    desc:this.desc
                });
            }else{
                //console.log("search");
                this.setState({
                    ...this.state,
                    empPageData:empPageData,
                    data: newData,
                    activePage: page,
                    showPagiNation: 'flex',
                    isSearch: false,
                    sort: '', desc: ''
                });
            }


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



    handleSearchButtonClick = async(e) => {
        // 검색 버튼 클릭 시 수행할 로직
        const keyword=this.searchKeyword;

        const regex = /^[a-zA-Z0-9가-힣]{0,12}$/;
        if (!regex.test(keyword)) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "올바르지 않는 입력입니다"
            });
            return;
        }

        if(keyword === ""){
            const page="";

            // this.sort = "";
            // this.desc = "";
            // document.getElementById("descLabel").innerText="정렬 방식";
            // document.getElementById("sortLabel").innerText="정렬 기준";
            // document.getElementById("desc").innerText="정렬 방식";
            // document.getElementById("sortLabel").innerText="정렬 기준";

            this.fetchData(page);
        }else{
            try{
                const searchResponse = (await axios.get(`http://localhost:8080/employee/search?searchParameter=${keyword}`)).data;

                if(searchResponse===""){
                    this.setState({
                        snackbarOpen:true, snackbarMessage : "검색 결과가 없습니다!"
                    });
                    return;
                }

                const newData = searchResponse.map(({employeeId,name})=>({employeeId,name}))
                //console.log("newData : ",newData);

                this.setState({
                    ...this.state,
                    data: newData,
                    showPagiNation:"None",
                    isSearch:true,
                    sort: '',
                    desc: ''
                });
                this.sort = "";
                this.desc = "";

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

    sortChange =  (e) =>{
        this.sort=e.target.value;
        this.setState({...this.state,sort: this.sort,desc:""});
    }

    descChange =  (e) => {

        this.desc=e.target.value;
        if (!this.state.isSearch) {
            this.fetchData(1);
        } else {
            let empData = "";

            if (this.desc === "asc") {
                empData = this.state.data.sort((a, b) => {
                    if (this.sort === "employee_id") {
                        return a.employeeId - b.employeeId;
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                });
            } else {
                empData = this.state.data.sort((a, b) => {
                    if (this.sort === "employee_id") {
                        return b.employeeId - a.employeeId;
                    } else {
                        return b.name.localeCompare(a.name);
                    }
                });
            }
            this.setState({...this.state,data: empData,desc:this.desc});
            ``
        };
    };

    componentDidMount(){
        const { employeeId } = this.props;

        const page='';
        this.fetchData(page);
    }

    showErrorDialog = (title, message) => {
        this.setState({
            dialogOpen: true,
            dialogTitle: title,
            dialogMessage: message,
        });
    };

    // 다이얼로그 닫기 함수
    closeDialog = () => {
        this.setState({ dialogOpen: false });
    };

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ snackbarOpen: false });
    };





    render() {
        const {data} = this.state;
        const {classes} = this.props;
        const { dialogOpen, dialogTitle, dialogMessage } = this.state;

        return(
            <div>
                <Grid item lg={12}>
                    <Box style={{width:"1400px", margin:"10px 30px 30px 30px"}}>
                        <Box
                            sx={{fontSize:'30px', fontFamily:'IBM Plex Sans KR', fontWeight:'bold', borderBottom:'solid 1px black',  margin: '20px 0 20px 0',
                                paddingBottom: '10px'
                            }} >
                            전 사원 근태 승인 내역 조회
                        </Box>
                        <Box style={{border:'1px solid black', padding:'10px',borderRadius:'10px',display:"flex",justifyContent:'space-evenly'}} >
                            <TextField id="outlined-basic" label="사원 명/사원번호(최대 12자리)" variant="outlined" style={{width:"1300px",height:"55px"}} onChange={this.searchKeywordChange}/>

                            <IconButton
                                onClick={this.handleSearchButtonClick}
                                style={{
                                    borderRadius: '6px',
                                    width: "55px",
                                    border: '1px solid #c1c1c1',
                                    height: "55px"}}>
                                <SearchIcon />
                            </IconButton>

                            {/*<SvgIcon style={{borderRadius:'6px' , width: "4%",border:'1px solid #c1c1c1', height:"56px"}}*/}
                            {/*         cursor="pointer" component={SearchIcon} onClick={this.handleSearchButtonClick} />*/}
                            {/*<Button className={classes.button} variant="outlined" onClick={this.handleSearchButtonClick} >검색</Button>*/}
                        </Box>


                        <Box component="" style={{display:"flex",justifyContent:"flex-end",marginBottom: '10px'}}>
                            <FormControl className={classes.formControl}>
                                <InputLabel id={`demo-simple-select-label`}>정렬 기준</InputLabel>
                                <Select
                                    labelId={`demo-simple-select-label`}
                                    id={`demo-simple-select`}
                                    value={this.state.sort}
                                    onChange ={this.sortChange}>
                                    <MenuItem value={"employee_id"}>사원 번호</MenuItem>
                                    <MenuItem value={"name"}>사원 명</MenuItem>
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
                            {/*size="small" aria-label="a dense table"*/}
                            <Table className={classes.table} >
                                <TableHead className={classes.tableHead}>
                                    <TableRow>
                                        <TableCell align="center" className={classes.titleText}>사원 번호</TableCell>
                                        <TableCell align="center" className={classes.titleText}>사원 이름</TableCell>
                                        <TableCell align="center" className={classes.titleText}>승인 내역 조회</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.map((row) => (
                                        <ButtonInListComponent  className={classes.text} toggleModalShowing={this.props.args[0]} key={row.employeeId} row={row} keyData={row.employeeId} title="승인 내역 조회" />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box component="section" sx={{ display: this.state.showPagiNation,alignItems: 'center', justifyContent: 'center' }}>
                            <Pagination
                                activePage={parseInt(this.state.activePage)}
                                itemsCountPerPage={this.state.empPageData.size}
                                totalItemsCount={this.state.empPageData.totalElement}
                                pageRangeDisplayed={10}
                                onChange={(page) => this.fetchData(page)}
                                innerClass={classes.pagination} // 페이징 컨테이너에 대한 스타일
                                itemClass={classes.pageItem} // 각 페이지 항목에 대한 스타일
                                activeClass={classes.activePageItem} // 활성 페이지 항목에 대한 스타일

                            />
                        </Box>
                    </Box>
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
                </Grid>
            </div>
        )
    }
}
export default withStyles(styles)(AttendanceApprovalAllEmployees);

