import React, { Component } from "react";
import axios from 'axios';
import {Redirect} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Select from 'react-select';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import {FcInfo} from "react-icons/fc";
import Tooltip from "@material-ui/core/Tooltip";
import MultiSelect from "react-multi-select-component";


const initialState = {
    userName: "",
    fName: "",
    lName: "",
    password: "",
    bday: new Date(),
    questionsID: [],
    questionsText: [],
    questions :[],
    answerUserQuestion: "",
    quesionChosen: 0,
    code: "",
    type: '',
    questionnairesID:[],
    questionnairesText:[],
    gender: "",
    smoke: "",
    dateOfSurgery:"",
    surgeryType: "",
    education: "",
    height: "",
    weight: "",
    bmi:"",
    // questionnaires: [],
    questionnairesChosen:0,
};

class AddUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: "",
            lName: "",
            password: "",
            bday: new Date(),
            phone: "",
            questionsID: [],
            questionsText: [],
            questions :[],
            answerUserQuestion: "",
            code: "",
            questionnaires: [],
            questionnairesID:[],
            questionnairesText:[],
            questionnairesChosen:0,
            quesionChosen: 0,
            gender: "",
            smoke: "",
            dateOfSurgery:"",
            surgeryType: "",
            education: "",
            height: "",
            weight: "",
            bmi:"",
            surgeryDateDisplay: false,
            selected: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.onSelectQuesionChosen = this.onSelectQuesionChosen.bind(this);
        this.onSelectGender = this.onSelectGender.bind(this);
        this.onSelectSmoke = this.onSelectSmoke.bind(this);
        this.onSelectSurgeryType = this.onSelectSurgeryType.bind(this);
        this.onSelectEducation = this.onSelectEducation.bind(this);
        this.onSelectQuestionnairesChosen = this.onSelectQuestionnairesChosen.bind(this);
        this.setSelected = this.setSelected.bind(this);
    }

    onSelectQuesionChosen(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            quesionChosen: selectedIndex
        });
    }
    onSelectGender(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            gender: selectedIndex
        });
    }
    onSelectSmoke(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            smoke: selectedIndex
        });
    }
    onSelectEducation(event) {
        const selectedIndex = event.target.options.selectedIndex;
        this.setState({
            education: selectedIndex
        });
    }

    onSelectSurgeryType(event) {
        const selectedIndex = event.target.options.selectedIndex;
        console.log(selectedIndex)
        this.setState({
            surgeryType: selectedIndex
        });
        if( selectedIndex !== 3 && selectedIndex !==0){
            this.setState({
                surgeryDateDisplay: true
            });
        }else{
            this.setState({
                surgeryDateDisplay: false
            });
        }

    }
    onSelectQuestionnairesChosen(selected) {
        console.log(selected)
        // const selectedIndex = event.target.options.selectedIndex;
        let chosen = [];
        let questionnaires = this.state.questionnaires;
        selected.forEach(selectQuestionnaire => {
            questionnaires.forEach(questionnaire => {
                if(selectQuestionnaire.value === questionnaire.QuestionnaireText){
                    chosen.push(questionnaire)
                }
            })
        });
        this.setState({
            selected: selected,
            questionnairesChosen: Array.from(new Set(chosen))
        });
    }

    componentDidMount() {
        let initialQuestions = [];
        let initQuestionsID = [];
        let initQuestionsText = [];

        fetch(' https://icc.ise.bgu.ac.il/njsw18users/getVerifications')
            .then(response => {
                return response.json();
            }).then(results => {

            initialQuestions = results.data;

            for(var i = 0; i < initialQuestions.length; i++) {
                var obj = initialQuestions[i];
                initQuestionsID.push(obj.QuestionID);
                initQuestionsText.push(obj.QuestionText);

            }

            this.setState({
                questionsID: initQuestionsID,
                questionsText: initQuestionsText,
                questions: initialQuestions,
            });
        });
        // if(this.state.type === "patient"){
        let initQuestionnairesID = [];
        let initQuestionnairesText = [];
        let initQuestionnaires = [];
        fetch(' https://icc.ise.bgu.ac.il/njsw18questionnaires/all')
            .then(response => {
                return response.json();
            }).then(results => {

            initQuestionnaires = results.data;

            for(var i = 0; i < initQuestionnaires.length; i++) {
                var obj = initQuestionnaires[i];
                if(obj.QuestionnaireID !== 0 && obj.QuestionnaireID !==6 && obj.QuestionnaireID !== 5) {
                    initQuestionnairesID.push(obj.QuestionnaireID);
                    initQuestionnairesText.push(obj.QuestionnaireText);
                }
            }
            this.setState({
                questionnaires: initQuestionnaires,
                questionnairesID: initQuestionnairesID,
                questionnairesText: initQuestionnairesText
            });
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        var bDay = new Date(this.state.bday);
        var now = new Date();
        // var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        // if(!regex.test(this.state.password)){
        //     window.alert('הסיסמא צריכה להכיל לפחות 8 תווים,אות אנגלית קטנה, אות אנגלית גדולה ומספר')
        //     return
        // }
        if(this.state.type === 'doctor') {
            axios.post(' https://icc.ise.bgu.ac.il/njsw18users/doctorRegister', {
                UserID: this.state.userName,
                Password: this.state.password,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                BirthDate: bDay.getTime(),
                Code: this.state.code,
                VerificationQuestion: this.state.quesionChosen,
                VerificationAnswer: this.state.answerUserQuestion,
                ValidTime: now.getTime()
            }).then(res => {
                if (res.data.message === "Wrong Code") {
                    window.alert("קוד האימות אינו נכון");
                } else if (res.data.message === "Taken Email") {
                    window.alert("כתובת הדואל כבר רשומה במערכת");
                } else {
                    window.alert("ההרשמה בוצעה בהצלחה נא לבצע התחברות");
                    window.location.reload(false);
                }
            })
        }
        if(this.state.type === 'patient') {
            var dateOfSurgery = new Date(this.state.dateOfSurgery);
            let gender;
            if (this.state.gender == 1) {
                gender = "נקבה"
            } else if (this.state.gender == 2) {
                gender = "זכר"
            }
            let smoke;
            if (this.state.smoke == 1) {
                smoke = "מעשן"
            } else if (this.state.smoke == 2) {
                smoke = "לא מעשן"
            }
            let sType;
            if (this.state.surgeryType ==1) {
                sType = "ניתוח דחוף"
            }else if (this.state.surgeryType == 2)
            {
                sType = "ניתוח מתוכנן"

            }else if (this.state.surgeryType == 3) {
                sType = "ללא ניתוח"
            }
            let education;
            let educationOptions = {1 :"השכלה אקדמאית", 2: "השכלה תיכונית", 3:"10-12 שנות לימוד", 4: "6-9 שנות לימוד", 5: "5 שנות לימוד או פחות", 6:"לא מעוניין לענות"};
            for (var key in educationOptions) {
                if(key == this.state.education){
                    education = educationOptions[key]
                }
            }
            let height_double = Number(this.state.height / 100);
            let bmi = String((Number(this.state.weight)/Math.pow(height_double,2)));
            axios.post(' https://icc.ise.bgu.ac.il/njsw18users/patientRegister', {
                UserID: this.state.userName,
                Password: this.state.password,
                First_Name: "מטופל",
                Last_Name: this.state.userName,
                Phone_Number: "",
                Gender:gender,
                Smoke: smoke,
                DateOfSurgery: dateOfSurgery.getTime(),
                SurgeryType: sType,
                Education: education,
                Height: this.state.height,
                Weight: this.state.weight,
                BMI: bmi,
                BMI_NUMBER: parseFloat(bmi),
                BirthDate: bDay.getTime(),
                Code: this.state.code,
                Questionnaires: this.state.questionnairesChosen,
                VerificationQuestion: this.state.quesionChosen,
                VerificationAnswer: this.state.answerUserQuestion,
                ValidTime: now.getTime()
            }).then(res => {
                if (res.data.message === "Wrong Code") {
                    window.alert("קוד האימות אינו נכון");
                } else if (res.data.message === "Taken Email") {
                    window.alert("כתובת הדואל כבר רשומה במערכת");
                } else {
                    window.alert("ההרשמה בוצעה בהצלחה נא לבצע התחברות");
                    window.location.reload(false);
                }
            })
        }
    }

    handleReset(event) {
        this.setState (initialState);
        let initialQuestions = [];
        let initQuestionsID = [];
        let initQuestionsText = [];
        fetch(' https://icc.ise.bgu.ac.il/njsw18users/getVerifications')
            .then(response => {
                return response.json();
            }).then(results => {

            initialQuestions = results.data;
            console.log(initialQuestions);

            for(var i = 0; i < initialQuestions.length; i++) {
                var obj = initialQuestions[i];

                initQuestionsID.push(obj.QuestionID);
                initQuestionsText.push(obj.QuestionText);
            }

            this.setState({
                questionsID: initQuestionsID,
                questionsText: initQuestionsText,
                questions: initialQuestions
            });
        });

        let initQuestionnairesID = [];
        let initQuestionnairesText = [];
        let initQuestionnaires = [];
        fetch(' https://icc.ise.bgu.ac.il/njsw18questionnaires/all')
            .then(response => {
                return response.json();
            }).then(results => {

            initQuestionnaires = results.data;

            for(var i = 0; i < initQuestionnaires.length; i++) {
                var obj = initQuestionnaires[i];

                initQuestionnairesID.push(obj.QuestionnaireID);
                initQuestionnairesText.push(obj.QuestionnaireText);
            }
            this.setState({
                questionnaires: initQuestionnaires,
                questionnairesID: initQuestionnairesID,
                questionnairesText: initQuestionnairesText
            });
        });

    }

    isDoctor(){
        this.setState({type: 'doctor'})
    }
    isPatient(){
        this.setState({type: 'patient'})
    }

    setSelected(selected) {
        this.onSelectQuestionnairesChosen(selected)
    }
    render() {
        require("./AddUser.css");
        let quesions = this.state.questionsText;
        let optionItems = quesions.map((question) =>
            <option key={question} >{question}</option>
        );
        let questionnaires = this.state.questionnairesText;
        if (questionnaires.length === 0){
            this.componentDidMount();
            questionnaires = this.state.questionnairesText;
        }
        // let questionnairesOption = questionnaires.map((questionnaire) =>
        //     <option key={questionnaire} >{questionnaire}</option>
        // );
        let questionnairesOption =[];
        questionnaires.forEach(questionnaire => {
            questionnairesOption.push(questionnaire)
            // questionnairesOption.push({value: questionnaire, label: questionnaire})
        });
        let options = [];
        questionnaires.forEach(q => {
            options.push({ label: q, value: q });
        });
        // let questionnairesOption = questionnaires.map((questionnaire) => {value: {questionnaire}, label: {questionnaire}});
        let genderOptions = [<option></option>,<option>נקבה</option>,<option>זכר</option>];
        let surgeryOptions = [<option/>,<option>ניתוח דחוף</option>,<option>ניתוח מתוכנן</option>,<option>ללא ניתוח</option>];
        let smokeOptions = [<option/>,<option>מעשן</option>,<option>לא מעשן</option>];
        let educationOptions = [<option/>,<option>השכלה אקדמאית</option>,<option>השכלה תיכונית</option>,<option>10-12 שנות לימוד</option>,<option>6-9 שנות לימוד</option>,<option>5 שנות לימוד או פחות</option>,<option>לא מעוניין לענות</option>];
        var today = (new Date()).toISOString().split("T")[0];
        return (
            <div>
                <label className="buttonsChoose">
                    <Button style={{width: 150, floatButtom:'auto'}} className="docbutton" variant="info" onClick={() => this.isDoctor()}> דוקטור </Button>
                    {'                                                                '}
                    <Button style={{width: 150}} className="docbutton" variant="info" onClick={() => this.isPatient()}> מטופל </Button>
                </label>
                {this.state.type === 'doctor' ?
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset} id="new_user_form">
                        <div className="divs_in_add">
                            <label for= "email" className="labels_in_add_user">כתובת דוא"ל</label>
                            <input className="inputs_in_add_user" name="userName" type="email"
                                   value={this.state.userName} onChange={e => this.handleChange(e)} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">שם פרטי</label>
                            <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName}
                                   minLength="2" maxLength="20" onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">שם משפחה </label>
                            <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName}
                                   minLength="2" maxLength="20" onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">סיסמה </label>
                            <input className="inputs_in_add_user" name="password" type="password" minlength="8"
                                   maxLength="12" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$" value={this.state.password} onChange={this.handleChange} message={"הסיסמא צריכה להכיל לפחות 8 תווים, לפחות תו אחד באות אנגלית קטנה, תו אחד באות אנגלית אות אנגלית גדולה ותו אחד כמספר."} required/>
                            <Tooltip title="הסיסמא צריכה להכיל לפחות 8 תווים,אות אנגלית קטנה, אות אנגלית גדולה ומספר">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">מספר טלפון</label>
                            <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                   value={this.state.phone} onChange={this.handleChange} required/>
                            <Tooltip title="מספר טלפון המכיל מספרים בלבד">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">תאריך לידה</label>
                            <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                   value={this.state.bday} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">קוד אימות </label>
                            <input className="inputs_in_add_user" name="code" type="text" value={this.state.code}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">שאלת אימות </label>
                            <select className="select_in_add_user" onChange={this.onSelectQuesionChosen}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">תשובה </label>
                            <input className="inputs_in_add_user" name="answerUserQuestion" type="text"
                                   value={this.state.answerUserQuestion} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <input type="submit" value="הירשם" className="submit_and_reset_buttons"/>
                        </div>
                        <br/>
                        <br/>
                    </form>
                    : null}
                {this.state.type === 'patient' ?
                    <form onSubmit={this.handleSubmit} onReset={this.handleReset} id="new_user_form">
                        <div className="divs_in_add">
                            <label for="email" className="labels_in_add_user">מזהה מטופל: </label>
                            <input className="inputs_in_add_user" name="userName" type="text"
                                   value={this.state.userName} onChange={e => this.handleChange(e)} required/>
                        </div>
                        {/*<div className="divs_in_add">*/}
                        {/*    <label className="labels_in_add_user">שם פרטי</label>*/}
                        {/*    <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName}  minLength="2" maxLength="20"*/}
                        {/*           onChange={this.handleChange} required/>*/}
                        {/*</div>*/}
                        {/*<div className="divs_in_add">*/}
                        {/*    <label className="labels_in_add_user">שם משפחה </label>*/}
                        {/*    <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName}  minLength="2" maxLength="20"*/}
                        {/*           onChange={this.handleChange} required/>*/}
                        {/*</div>*/}
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">סיסמה </label>
                            <input className="inputs_in_add_user" name="password" type="password" minlength="8"
                                   maxLength="12" pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                                   value={this.state.password} onChange={this.handleChange} required/>
                            <Tooltip title="הסיסמא צריכה להכיל לפחות 8 תווים,אות אנגלית קטנה, אות אנגלית גדולה ומספר">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        {/*<div className="divs_in_add">*/}
                        {/*    <label className="labels_in_add_user">מספר טלפון</label>*/}
                        {/*    <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"*/}
                        {/*           value={this.state.phone} onChange={this.handleChange} required/>*/}
                        {/*    <Tooltip title="מספר טלפון המכיל מספרים בלבד">*/}
                        {/*        <IconButton >*/}
                        {/*            <FcInfo></FcInfo>*/}
                        {/*        </IconButton>*/}
                        {/*    </Tooltip>*/}
                        {/*</div>*/}
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">תאריך לידה</label>
                            <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                   value={this.state.bday} onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">משקל (ק"ג) </label>
                            <input className="inputs_in_add_user" name="weight" type="number" value={this.state.weight}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">גובה (ס"מ) </label>
                            <input className="inputs_in_add_user" name="height" type="number" minLength="3" value={this.state.height}
                                   onChange={this.handleChange} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">מין </label>
                            <select className="select_in_add_user" onChange={this.onSelectGender}>
                                {genderOptions}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">מעשן </label>
                            <select className="select_in_add_user" onChange={this.onSelectSmoke}>
                                {smokeOptions}
                            </select>
                        </div>
                        <div className="divs_in_add_user">
                            <label className="labels_in_add_user">השכלה </label>
                            <select className="select_in_add_user" onChange={this.onSelectEducation}>
                                {educationOptions}
                            </select>
                        </div>
                        <div className="divs_in_add_user">
                            <label className="labels_in_add_user">סוג ניתוח </label>
                            <select className="select_in_add_user" onChange={this.onSelectSurgeryType}>
                                {surgeryOptions}
                            </select>
                        </div>{this.state.surgeryDateDisplay &&
                    <div className="divs_in_add_user">
                        <label className="labels_in_add_user">תאריך ניתוח</label>
                        <input className="inputs_in_add_user" name="dateOfSurgery" type="date"
                               value={this.state.DateOfSurgery} onChange={this.handleChange} required/>
                    </div>}

                        <div className="divs_in_add_user">
                            <label className="labels_in_add_user">שאלת אימות </label>
                            <select className="select_in_add_user" onChange={this.onSelectQuesionChosen}>
                                {optionItems}
                            </select>
                        </div>
                        <div className="divs_in_add_user">
                            <label className="labels_in_add_user">תשובה </label>
                            <input className="inputs_in_add_user" name="answerUserQuestion" type="text"
                                   value={this.state.answerUserQuestion} onChange={this.handleChange} required/>
                        </div>
                        {/*<div className="divs_in_add_try">*/}
                        {/*    <label className="labels_in_add_user">שאלונים רפואיים </label>*/}
                        {/*    <DropdownMultiselect id="add_user_dropdown" options={questionnairesOption} handleOnChange={(selected) => {*/}
                        {/*        this.onSelectQuestionnairesChosen(selected)*/}
                        {/*    }} selectDeselectLabel={undefined} name="questionnaires" placeholder="לא נבחר שאלון"  style={{borderColor: 'black', width:80}}/>*/}
                        {/*</div>*/}

                        <div className="divs_in_add_try">
                            <label className="labels_in_add_user">שאלונים רפואיים </label>
                            <MultiSelect
                                className="inputs_in_add_user"
                                options={options}
                                value={this.state.selected}
                                onChange={this.setSelected}
                                labelledBy="Select"
                            />
                        </div>
                        <br/>
                        <div className="divs_in_add_code">
                            <label className="labels_in_add_user">קוד אימות </label>
                            <input className="inputs_in_add_user" name="code" type="text" value={this.state.code}
                                   onChange={this.handleChange} required/>
                            <Tooltip title="קוד האימות שהוגדר מבית החולים המטפל">
                                <IconButton >
                                    <FcInfo></FcInfo>
                                </IconButton>
                            </Tooltip>
                        </div>
                        <div style={{width:50, height:300}}>
                            <input type="submit" value="הירשם" className="submit_and_reset_buttons" required/>
                        </div>
                        <br/>
                        <br/>
                    </form>
                    : null}
            </div>
        );
    }
}

export default AddUser;