import React, {Component} from "react";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Snackbar
} from "@material-ui/core";
import BlackButtonComponent from "../../../chun/Component/Button/BlackButtonComponent";
import {Typography, withStyles} from '@material-ui/core';
import Grid from "@material-ui/core/Grid";
import {Alert} from "@material-ui/lab";

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(5),
    },
    paper: {
        padding: theme.spacing(3),
        margin: theme.spacing(3),
    },
    title: {
        marginBottom: theme.spacing(2),
        textAlign: 'center',
    },
    gridContainer: {
        padding: theme.spacing(2),
    },
});

class SelectInfoForEmployeeReport extends Component {
    currentYear;
    check;

    constructor(props) {
        super(props);
        this.currentYear = new Date().getFullYear();

        this.state = {
            inputYear: String(this.currentYear), // Jan:false, Feb:false, Mar:false, Apr:false, May:false, Jun:false, Jul:false, Aug:false,Sep:false, Oct:false, Nov:false, Dec:false
            Months: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
                10: false,
                11: false,
                12: false,
                snackbarOpen: false,
                snackbarMessage: "",
            }

        }
        this.isChecked = false;
        this.currentYear = new Date().getFullYear();
        this.clickMonthChange = this.clickMonthChange.bind(this);
        this.clickYearChange = this.clickYearChange.bind(this)
        this.allMonths = this.allMonths.bind(this);
        this.allClick = this.allClick.bind(this);
        this.makeReport = this.makeReport.bind(this);
        // this.getData = this.getData.bind(this)
    }

    clickMonthChange = (e) => {
        const name = e.target.name;
        const checked = e.target.checked;
        this.setState((prevState) => ({
            Months: {...prevState.Months, [name]: checked}
        }));
    };

    clickYearChange = (e) => {
        this.setState({
            inputYear: String(e.target.value), Months: {
                1: false,
                2: false,
                3: false,
                4: false,
                5: false,
                6: false,
                7: false,
                8: false,
                9: false,
                10: false,
                11: false,
                12: false
            }
        }, () => {
            //console.log(this.state);
        });
    }

    allMonths = () => {
        if (this.state.inputYear === "") return null;

        // let months = [{1:"Jan"}, {2:"Feb"}, {3:"Mar"}, {4:"Apr"}, {5:"May"}, {6:"Jun"}, {7:"Jul"}, {8:"Aug"}, {9:"Sep"}, {10:"Oct"}, {11:"Nov"}, {12:"Dec"}];.
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        if (this.state.inputYear === this.currentYear) {
            const nowMonths = new Date().getMonth(); //이번달
            months = months.slice(0, nowMonths + 1);
        }

        return months.map((month) => (<FormControlLabel
            key={month}
            control={<Checkbox checked={this.state.Months[month]} onChange={this.clickMonthChange}
                               name={String(month)}/>}
            label={`${month}월`}
        />));
    };

    allClick = () => {
        if (this.state.inputYear === "") {
            this.setState({
                snackbarOpen: true, snackbarMessage: "년도를 반드시 선택해주세요"
            });
            return;
        }

        if (!this.isChecked) {
            this.setState({
                Months: {
                    1: true,
                    2: true,
                    3: true,
                    4: true,
                    5: true,
                    6: true,
                    7: true,
                    8: true,
                    9: true,
                    10: true,
                    11: true,
                    12: true
                }
            }, () => {

            });

        } else {
            this.setState({
                Months: {
                    1: false,
                    2: false,
                    3: false,
                    4: false,
                    5: false,
                    6: false,
                    7: false,
                    8: false,
                    9: false,
                    10: false,
                    11: false,
                    12: false
                }
            }, () => {

            });

        }

        this.isChecked = !this.isChecked;
    }


    makeReport = () => {
        const {inputYear, Months} = this.state;
        const selectedMonths = Object.keys(Months).filter(month => Months[month]);

        if (selectedMonths.length === 0) {
            this.setState({
                snackbarOpen: true, snackbarMessage: "월을 한개 이상 반드시 선택해주세요"
            });
            return;
        }

        this.props.onSelectionChange(inputYear, selectedMonths);
    };
    handleSnackbarClose = (event , reason) =>{
        if(reason ==='clickawy'){
            return;
        }
        this.setState({snackbarOpen : false});
    }


    render() {
        return (<>

            <Grid container spacing={4} alignItems="center" style={{margin:'0px'}}>
                <Grid>
                    <FormControl variant="outlined">
                        <InputLabel id="attendance-hour-label">년도</InputLabel>
                        <Select

                            style={{height: "50px", width: "150px"}}
                            labelId="attendance-hour-label"
                            id="attendaceHour"
                            value={this.state.inputYear} // 이 부분을 추가
                            onChange={this.clickYearChange}>
                            {[...Array(5)].map((_, index) => (
                                <MenuItem key={this.currentYear - index} value={this.currentYear - index}>
                                    {`${this.currentYear - index}년`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <BlackButtonComponent title={"전체 선택"} onButtonClick={this.allClick}/>
                </Grid>
                <Grid item>
                    <BlackButtonComponent title={"보고서 생성"} onButtonClick={this.makeReport}/>
                </Grid>
                <Snackbar
                    open={this.state.snackbarOpen}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                    anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                >
                    <Alert onClose={this.handleSnackbarClose} severity="warning">
                        {this.state.snackbarMessage}
                    </Alert>
                </Snackbar>
            </Grid>


            {this.allMonths()}


        </>)
    }

}

export default withStyles(styles)(SelectInfoForEmployeeReport);