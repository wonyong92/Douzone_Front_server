import React, {Component} from "react";
import {Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Snackbar, TextField} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {Alert} from "@material-ui/lab";

class SearchYearMonthDay extends Component {
    state = {
        year: '',
        month: '',
        day: '',
        snackbarOpen:false,
        snackbarMessage:"",

    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };



    handleSubmit = (event) => {
        event.preventDefault();
        let {year, month, day} = this.state;
        const searchParameter = event.target.elements.search.value;

        // 특수문자 검증을 위한 정규 표현식
        const specialCharRegex = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

        if (specialCharRegex.test(searchParameter)) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "검색에 특수문자를 적을수 없습니다"
            });
            return;
        }
        if (searchParameter.length > 12) {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "검색어는 12자 이하로 입력해주세요."
            });
            return;
        }


        if (day === "월별 검색") {
            day = '0';
        }
        if (!year || !month) {
            this.setState({
                snackbarOpen:true, snackbarMessage : "년도와 월을 선택해주세요 "
            });
            return;
        }

        this.props.onSearch({year, month, day, searchParameter});
    }

    render() {
        return (
            <Box component="form" onSubmit={this.handleSubmit} style={{border:'1px solid black', padding:'10px',borderRadius:'10px'}}>
                <Grid container spacing={1} alignItems="center" justify="flex-end">

                    <Grid item xs>
                        <TextField
                            fullWidth
                            name="search"
                            label="사원 명/사원번호(최대 12자리)"
                            variant="outlined"
                        />
                    </Grid>

                    <Grid item>
                        <FormControl variant="outlined">
                            <InputLabel>년도</InputLabel>
                            <Select
                                name="year"
                                value={this.state.year}
                                onChange={this.handleChange}
                                style={{ minWidth: 80 }}
                            >
                                {[2020, 2021, 2022, 2023].map(year => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl variant="outlined">
                            <InputLabel>월</InputLabel>
                            <Select
                                name="month"
                                value={this.state.month}
                                onChange={this.handleChange}
                                style={{ minWidth: 60 }}
                            >
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                    <MenuItem key={month} value={month}>{month}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl variant="outlined">
                            <InputLabel>일</InputLabel>
                            <Select
                                name="day"
                                value={this.state.day}
                                onChange={this.handleChange}
                                style={{ minWidth: 60 }}
                            >
                                <MenuItem value="월별 검색">월별 검색</MenuItem>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                    <MenuItem key={day} value={day}>{day}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <Box >
                        <IconButton type="submit" style={{borderRadius:'6px' , width: "100%",border:'1px solid #c1c1c1', height:"56px"}}>
                            <SearchIcon />
                        </IconButton>
                        </Box>
                    </Grid>

                </Grid>
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

export default SearchYearMonthDay;
