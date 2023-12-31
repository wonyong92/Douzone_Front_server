import React, {Component} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Paper,
    Select, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import axios from "axios";
import defaultPersonImage from '../static/defaultPersonImage.png'
import {withStyles} from '@material-ui/core/styles';
import Container from "@material-ui/core/Container";
import {Alert} from "@material-ui/lab";

const styles = theme => ({
    container: {
        width:"900px",
        display:'flex',
    },
    addButton: {
        marginRight: theme.spacing(1),
        backgroundColor: '#719FE4',
        color: '#FFFFFF',
        '&:hover': {
            backgroundColor: '#5372C8',
        },
    },
    removeButton: {
        marginLeft: theme.spacing(1),
        backgroundColor: '#FFFFFF',
        color: '#719FE4',
        '&:hover': {
            backgroundColor: '#f3f3f3',
        },
    },
    papers: {
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        borderRadius: theme.shape.borderRadius,


    },
    reportTitle: {
        marginTop: '50px',
        lineHeight: '100px',
    },
    gridContainer: {
        width: '100%',
        margin: 0,
    },
    gridItem: {
        flex: 1,
    },
    formContainer: {
        backgroundColor: 'white',
        borderTop: '2px solid black',

    },
    uploadContainer: {
        padding: theme.spacing(3),
        backgroundColor: '#719FE4',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    uploadInput: {
        display: 'none'
    },
    uploadLabel: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        justifyContent: 'center',
        margin: theme.spacing(1),
        padding: theme.spacing(2),
        borderRadius: '50%',
        width: 230,
        height: 230,

    },
    uploadIcon: {
        borderRadius: '50%',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    submitButton: {
        marginTop: theme.spacing(1),
        marginRight: theme.spacing(1),
        backgroundColor: '#719FE4',
        color: '#FFFFFF',
    },
    cancelButton: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(1),
        backgroundColor: 'white',

    },

    tableCell: {
        backgroundColor: 'gray',
    },
    grayBackground: {
        textAlign: 'right',
        backgroundColor: '#E4F3FF',
        fontFamily:'IBM Plex Sans KR', // 변경된 글꼴
        fontSize:'18px'
    },


    errorMessage: {
        color: theme.palette.error.main,
        marginTop: theme.spacing(2)
    },

    buttonContainer: {
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },

});

class CreateEmployee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeId: "",
            passWord: "",
            name: "",
            attendanceManager: false,
            hireYear: "",
            uploadFile: null,
            isModalOpen: false,
            snackbarOpen:false,
            snackbarMessage:"",
            defaultPersonImage: defaultPersonImage,
            dialogOpen: false,
            dialogTitle: '',
            dialogMessage: '',
        };
    }


    handleImageUpload = (e) => {
        const imageFile = e.target.files[0];
        this.setState({uploadFile: imageFile});
    };

    handleImageRemove = () => {
        this.setState({uploadFile: null});
    };

    handleCreateEmployee = async () => {
        const {
            employeeId,
            passWord,
            name,
            attendanceManager,
            uploadFile,
            hireYear,

        } = this.state;


        if (!name.trim()) {
            this.setState({
               snackbarOpen:true, snackbarMessage : "이름을 입력해주세요"
            });
            return;
        } else if (/\d/.test(name) || /[^a-zA-Z\s가-힣]/.test(name)) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "이름에는 숫자나 특수문자를 입력할수없습니다"
            });
            return;
        } else if (name.length > 10) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "이름을 10자 이내로 입력하세요"
            });
            return;
        }

        if (!employeeId.trim()) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "사원 ID을 입력하세요"
            });
            return;
        } else if (!/^\d+$/.test(employeeId)) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "사원 ID는 숫자만 입력할 수 있습니다"
            });
            return;
        } else if (employeeId.length > 10) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "사원 ID는 10자 이내로 입력할 수 있습니다"
            });
            return;
        }

        if(!hireYear.trim()){
            this.setState({
                snackbarOpen:true, snackbarMessage:"입사 날짜를 선택하시오"
            });
            return;
        }

// 비밀번호 검증
        if (!passWord.trim()) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "바밀번호를 입력해주세요"

            });
            return;
        } else if (passWord.length > 10) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "비밀번호를 10자 이내로 입력하세요"
            });
            return;
        } else if (/[^a-zA-Z0-9\s]/.test(passWord)) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "비밀번호는 특수문자를 입력하면 안됩니다"
            });
            return;
        }

        if (!this.state.uploadFile) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "이미지를 업로드 하세요"
            });
            return;
        }
        try {

            const employeeAddUrl = "http://localhost:8080/admin/register";
            const createForm = new FormData();
            createForm.append("employeeId", employeeId);
            createForm.append("passWord", passWord);
            createForm.append("name", name);
            createForm.append("attendanceManager", attendanceManager);
            createForm.append("hireYear", hireYear);

            const response = await axios.post(employeeAddUrl, createForm);

            if (uploadFile instanceof File) {
                const uploadFileUrl = "http://localhost:8080/admin/upload";
                const uploadFormData = new FormData();
                uploadFormData.append("identifier", employeeId);
                uploadFormData.append("uploadFile", uploadFile);

                const uploadResponse = await axios.post(uploadFileUrl, uploadFormData);
            }

            this.showSuccessDialog("요청이 성공적으로 처리되었습니다.");

            // 상태 초기화 또는 업데이트


        } catch (error) {
            let errorMessage = "error";
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        errorMessage = "400 Bad Request 에러!";
                        break;
                    case 403:
                        errorMessage = "403 Forbidden - 권한이 없습니다!";
                        break;
                    case 409:
                        errorMessage = "409 Conflict - 중복된 사원번호가 존재합니다.";
                        break;
                    case 500:
                        errorMessage = "500 Internal Server Error - 서버 에러 발생!";
                        break;

                    default:
                        errorMessage = "An error occurred!";
                        break;
                }
            }
            this.showErrorDialog(errorMessage);

            // 상태 초기화 또는 업데이트
            this.setState({isModalOpen: false});
        }
    };

    handleAttendanceManagerChange = (event) => {
        this.setState({attendanceManager: event.target.value === 'true'});
    };


    handleImageUpload = (e) => {
        const imageFile = e.target.files[0];
        this.setState({uploadFile: imageFile});
    };

    handleSnackbarClose = (event , reason) =>{
        if(reason ==='clickawy'){
            return;
        }
        this.setState({snackbarOpen : false});
    }






    showSuccessDialog = (message) => {
        this.setState({
            dialogOpen: true,
            dialogTitle: '사원 생성 완료했습니다',
            dialogMessage: message,
        });
    };

// 오류 다이얼로그를 표시하는 함수
    showErrorDialog = (message) => {
        this.setState({
            dialogOpen: true,
            dialogTitle: 'Error',
            dialogMessage: message,
        });
    };


    // 다이얼로그 닫기 함수
    closeDialog = () => {
        this.setState({dialogOpen: false});
    };

    render() {
        const {classes} = this.props;
        const {employeeId, passWord, name, attendanceManager, hireYear, uploadFile, formError} = this.state;
        const {dialogOpen, dialogTitle, dialogMessage} = this.state;
        return (


            <Box className={classes.container}>
                <Container>
                    <Box className={classes.papers}>
                        <Box
                            sx={{
                                width: "100%",
                                fontSize:'30px',
                                fontFamily:'IBM Plex Sans KR',
                                fontWeight: 'bold',
                                borderBottom: 'solid 1px black',
                                margin: 'auto',
                                marginBottom: '40px', // 여기에 marginBottom 추가
                            }}>
                            사원 생성
                        </Box>
                        <Paper>
                            <Box className={classes.uploadContainer} justifyContent="center" alignItems="center">
                                <input
                                    accept="image/*"
                                    className={classes.uploadInput}
                                    id="upload-file"
                                    type="file"
                                    onChange={this.handleImageUpload}
                                />
                                <label htmlFor="upload-file" className={classes.uploadLabel}>
                                    {uploadFile ? (
                                        <img
                                            src={URL.createObjectURL(uploadFile)}
                                            alt="Employee"
                                            className={classes.uploadIcon}
                                        />
                                    ) : (
                                        <img
                                            src={defaultPersonImage}
                                            alt="Default"
                                            className={classes.uploadIcon}
                                        />
                                    )}
                                </label>
                                {/* 버튼 컨테이너 */}
                                <Box display="flex" flexDirection="column" alignItems="center" marginTop={'50px'}>
                                    <Box display="flex" flexDirection="row" mb={3}>
                                        <Button
                                            variant="contained"
                                            component="span"
                                            className={classes.addButton}
                                            onClick={() => document.getElementById('upload-file').click()}
                                        >
                                            추가
                                        </Button>
                                        <Button
                                            variant="contained"
                                            component="span"
                                            className={classes.removeButton}
                                            onClick={this.handleImageRemove}
                                            disabled={!uploadFile}
                                        >
                                            삭제
                                        </Button>
                                    </Box>
                                    <Typography variant="h5" style={{color: 'white',marginLeft:'30px', marginTop: '30px'}}>
                                        프로필 이미지를 등록해주세요
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>

                        <Box className={classes.paper}>
                            <Box
                                sx={{
                                    width: "100%",
                                    fontSize: '25px',
                                    fontFamily:'IBM Plex Sans KR',
                                    fontWeight: 'bold',
                                    margin: 'auto',
                                    marginTop: '40px',
                                    marginBottom: '20px',// 여기에 marginBoxttom 추가
                                }}>
                                기본 정보
                            </Box>

                            <TableContainer component={Box} className={classes.formContainer} flex='center'>
                                <Table>
                                    <TableBody>
                                        {/* 사원번호 입력 */}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className={classes.grayBackground}>
                                                사원번호
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Employee ID"
                                                    variant="outlined"
                                                    value={employeeId}
                                                    onChange={e => this.setState({employeeId: e.target.value})}
                                                    margin="normal"
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* 비밀번호 입력 */}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className={classes.grayBackground}>
                                                비밀번호
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    variant="outlined"
                                                    value={passWord}
                                                    onChange={e => this.setState({passWord: e.target.value})}
                                                    margin="normal"
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* 사원이름 입력 */}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className={classes.grayBackground}>
                                                사원이름
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Name"
                                                    variant="outlined"
                                                    value={name}
                                                    onChange={e => this.setState({name: e.target.value})}
                                                    margin="normal"
                                                    fullWidth
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* 근태 관리자 여부 */}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className={classes.grayBackground}>
                                                근태 관리자 여부
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={attendanceManager ? 'true' : 'false'}
                                                    onChange={this.handleAttendanceManagerChange}
                                                    fullWidth
                                                >
                                                    <MenuItem value="true">근태 관리자</MenuItem>
                                                    <MenuItem value="false">사원</MenuItem>
                                                </Select>
                                            </TableCell>
                                        </TableRow>

                                        {/* 입사 날짜 선택 */}
                                        <TableRow>
                                            <TableCell component="th" scope="row" className={classes.grayBackground}>
                                                입사 날짜
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    label="Hire Year"
                                                    type="date"
                                                    variant="outlined"
                                                    value={hireYear} // 상태를 'hireYear'로 변경해야 합니다.
                                                    onChange={e => this.setState({hireYear: e.target.value})}
                                                    margin="normal"
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>

                                        {/* 폼 에러 메시지 표시 */}
                                        {formError && (
                                            <TableRow>
                                                <TableCell colSpan={2}>
                                                    <Typography
                                                        className={classes.errorMessage}>{formError}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}

                                        {/* 등록 및 취소 버튼 */}
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Box className={classes.buttonContainer}>
                                                    <Button
                                                        variant="contained"
                                                        className={classes.submitButton}
                                                        onClick={this.handleCreateEmployee}
                                                    >
                                                        등록
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Container>

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
            </Box>

        );
    }
}

export default withStyles(styles)(CreateEmployee);