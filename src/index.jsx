import React from 'react';

import EmployeeVacationSetting from "./component/chun/Component/EmployeeVacationSetting";
import {render} from "react-dom";
import VacationRequest from "./component/chun/Component/VacationRequest";


document.addEventListener('DOMContentLoaded', function () {
    render(<EmployeeVacationSetting/>, document.body.appendChild(document.createElement('div')))
})
