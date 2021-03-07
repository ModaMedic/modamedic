import React from 'react'
import "./NavBar.css"
import { Navbar,Nav } from 'react-bootstrap'
import {Redirect} from "react-router-dom";
import axios from "axios";
import NavDropdown from "react-bootstrap/NavDropdown";
import { FaUser,FaUserMd } from 'react-icons/fa'
import 'bootstrap/dist/css/bootstrap.css'
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import PatientData from "./PatientData";
import Button from "react-bootstrap/Button";

class NavBar extends React.Component {
    constructor(){
        super();
        this.state = {
            showPopup: false,
            userInfo: false,
            pass: "",
            pass2: "",
            diff: false,
            isLogOut: false,
            isMessage: false,
            isPatientInfo: false,
            isInstructions: false,
            isExercises: false,
            isEdit: false,
        };
        this.logout = this.logout.bind(this);
        this.change = this.change.bind(this);
        this.privateInfoShow = this.privateInfoShow.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeToEdit = this.changeToEdit.bind(this);
    }

    goToMessages() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: true,
            isQuestionnaires: false,
            isExercises: false
        })
    }

    goToExercises() {
        this.setState({
            isPatientInfo: false,
            isInstructions: false,
            isMessage: false,
            isExercises: true,
            isQuestionnaires: false
        })
    }

    goToSearch() {
        this.setState({
            isPatientInfo: true,
            isMessage:false,
            isQuestionnaires: false,
            isInstructions: false,
            isExercises: false
        })
    }

    goToQuestionnaires() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: false,
            isQuestionnaires: true,
            isExercises: false
        })
    }

    goToInstructions() {
        this.setState({
            isPatientInfo: false,
            isMessage: false,
            isInstructions: true,
            isQuestionnaires: false,
            isExercises: false
        })
    }

    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    toggleUserInfo() {
        this.setState({
            userInfo: !this.state.userInfo
        });
    }

    async handleSubmit(event){
        event.preventDefault();
        if(this.state.pass !== this.state.pass2){
            this.setState({
                diff: true
            });
        }
        else{
            let url = 'http://localhost:8180/auth/usersAll/askChangePassword';
            var token;
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': sessionStorage.getItem("token")
                    }
                }
            );
            token = response.data.data;
            url = 'http://localhost:8180/users/passwordChangeCheck/changePassword';
            const responsec = await axios.post(
                url,
                {
                    "NewPassword":this.state.pass
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    }
                }
            );
            if(responsec.data.message){
                window.alert("הסיסמא שונתה בהצלחה");
                this.togglePopup();
            }
        }
    }

    componentDidMount() {
        this.getInfo()
    }

    async getInfo(){
        let url = 'http://localhost:8180/auth/usersAll/userInfo';
        var token;
        const response = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        this.setState({currUser: response.data.data})
    }


    handleChange(event) {
        const {name, value, type, checked} = event.target
        type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value })
    }

    logout() {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("type");
        sessionStorage.removeItem("name");
        sessionStorage.removeItem("doctor");
        sessionStorage.removeItem("patient");
        sessionStorage.removeItem("patientUserId");
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("name");
        localStorage.removeItem("doctor");
        localStorage.removeItem("patient");
        this.setState({
            isLogOut: true
        })
    }

    change(){
        this.togglePopup();
    }

    privateInfoShow(){
        this.toggleUserInfo()
    }

    isDoctor(){
        return sessionStorage.getItem('doctor')
    }

    changeToEdit(){
        this.setState({
            isEdit: !this.state.isEdit
        });
    }

    render() {
        var path = window.location.pathname;
        require("./NavBar.css");
        var iconType;
        if (this.isDoctor()) {
            iconType = <FaUserMd class="userIcon" style={{color: 'white'}} size={25}/>
        }else{
            iconType =  <FaUser class="userIcon" style={{color: 'white'}} size={25}/>
        }
        return (
            <div>
                <Navbar class="navbar navbar-fixed-top" bg="dark" variant="dark" fixed="top">
                    <div id="buttons">
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToSearch()}>מדדים אישיים</button>
                        <span>{'    '}            </span>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToQuestionnaires()}>שאלונים</button>
                        <span>{'              '}</span>
                        <button id="change" class="btn btn-dark" type="button"  onClick={() => this.goToMessages()}>לוח הודעות</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={() => this.goToExercises()}>תרגולים רפואיים</button>
                        <button id="change" class="btn btn-dark" type="button" onClick={()=> this.goToInstructions()}>הדרכות ניתוח</button>
                        {this.state.isMessage ? <Redirect to="/messages" /> : null}
                        {this.state.isPatientInfo ? <Redirect to="/search" /> : null}
                        {this.state.isQuestionnaires ? <Redirect to="/questionnaires" /> : null}
                        {this.state.isQuestionnaires ? this.setState({isQuestionnaires: false}) : null}
                        {this.state.isInstructions ? <Redirect to="/instructions" /> : null}
                        {this.state.isExercises ? <Redirect to="/exercises" /> : null}
                        {this.state.isLogOut ? <Redirect to="/" /> : null}
                        {this.state.showPopup ?
                            <Popup
                                change={this.handleChange.bind(this)}
                                closePopup={this.togglePopup.bind(this)}
                                handleSubmit={this.handleSubmit.bind(this)}
                                diff={this.state.diff}
                            /> : null
                        }
                        {this.state.userInfo ?
                            <UserInfo
                                user = {this.state.currUser}
                                isEdit = {this.state.isEdit}
                                closePopup={this.toggleUserInfo.bind(this)}
                                changeToEdit = {this.changeToEdit}
                            /> : null
                        }
                    </div>
                    <NavDropdown  id="dropdown-item-button" style={{color : 'white'}} title = {sessionStorage.getItem("name")}>
                        <NavDropdown.Item as="button" onClick={() => this.change()}>שנה סיסמא</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.logout()}>התנתק</NavDropdown.Item>
                        <NavDropdown.Item as="button" onClick={() => this.privateInfoShow()}>פרטים אישיים</NavDropdown.Item>
                    </NavDropdown>
                    {iconType}
                    <Navbar.Brand>
                        <img
                            alt=""
                            src={require("./first_logo.png")}
                            width="70"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                    </Navbar.Brand>
                </Navbar>
                <br/>
                <br/>
            </div>
        )
    }
}

export default NavBar;

class Popup extends React.Component {
    render() {
        // require("./App.css");
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <h3 id="h3">החלפת סיסמא</h3>
                    <form onSubmit={this.props.handleSubmit}>
                        <div className="lineC">
                            <label>
                                סיסמא חדשה:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass" id="pass" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            <label>
                                הקלד את הסיסמא מחדש:
                            </label>
                        </div>
                        <div className="lineC">
                            <input type="password" name="pass2" id="pass2" onChange={this.props.change} required/>
                        </div>
                        <div className="lineC">
                            {this.props.diff ? <label id="diffPass">הסיסמאות שונות</label> : null}
                        </div>
                        <div className="lineC">
                            <input type="submit" value="שלח"/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: "",
            fName: this.props.user.First_Name,
            lName: this.props.user.Last_Name,
            bday: new Date(this.props.user.BirthDate),
            phone: this.props.user.Phone_Number,
            gender: this.props.user.Gender,
            smoke: this.props.user.Smoke,
            dateOfSurgery:this.props.user.DateOfSurgery,
            surgeryType: this.props.user.SurgeryType,
            education: this.props.user.Education,
            height: this.props.user.Height,
            weight: this.props.user.Weight,
            bmi:this.props.user.BMI,
        }
        this.handleChangeInfo = this.handleChangeInfo.bind(this);
        this.handleSubmitInfo = this.handleSubmitInfo.bind(this);
    }
    handleChangeInfo(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmitInfo(event) {
        event.preventDefault();
        var bDay = new Date(this.state.bday);
        var now = new Date();
        if(this.state.type === 'patient') {
            var dateOfSurgery = new Date(this.state.dateOfSurgery);
            let gender;
            if (this.state.gender == 1) {
                gender = "נקבה"
            } else if (this.state.gender == 2) {
                gender = "זכר"
            }
            let smoke;
            if (this.state.gender == 1) {
                smoke = "מעשן"
            } else if (this.state.gender == 2) {
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
            axios.put('http://localhost:8180/usersAll/patientUpdate', {
                UserID: this.state.userName,
                First_Name: this.state.fName,
                Last_Name: this.state.lName,
                Phone_Number: this.state.phone,
                Gender:gender,
                Smoke: smoke,
                DateOfSurgery: dateOfSurgery.getTime(),
                SurgeryType: sType,
                Education: education,
                Height: this.state.height,
                Weight: this.state.weight,
                BMI: bmi,
                BirthDate: bDay.getTime(),
                ValidTime: now.getTime()
            })
        }
    }
    render() {
        require("./NavBar.css");
        let bDate = new Date(this.props.user.BirthDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        let sDate;
        var today = new Date();
        var birthday = new Date(this.props.user["BirthDate"]);
        var age = Math.floor((today.getTime() - birthday.getTime())/ 31536000000)
        if(this.props.user.DateOfSurgery){
            sDate = (new Date(this.props.user["DateOfSurgery"])).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        else{
            sDate = "לא נקבע יום ניתוח";
        }
        let bmi = parseFloat(this.props.user["BMI"]).toFixed(1);
        let patientListItems;
        if(sessionStorage.getItem("patient")){
            patientListItems =  <div>
                <ListGroup.Item> גובה: {this.props.user.Height}</ListGroup.Item>
                <ListGroup.Item> משקל: {this.props.user.Weight}</ListGroup.Item>
                <ListGroup.Item> BMI:{bmi}</ListGroup.Item>
                <ListGroup.Item> תאריך ניתוח: {sDate} </ListGroup.Item>
                <ListGroup.Item> סוג ניתוח: {this.props.user.SurgeryType} </ListGroup.Item>
                <ListGroup.Item> השכלה: {this.props.user.Education} </ListGroup.Item>
            </div>
        }
        let genderOptions = [<option></option>,<option>נקבה</option>,<option>זכר</option>];
        let surgeryOptions = [<option/>,<option>ניתוח דחוף</option>,<option>ניתוח מתוכנן</option>,<option>ללא ניתוח</option>];
        let smokeOptions = [<option/>,<option>מעשן</option>,<option>לא מעשן</option>];
        let educationOptions = [<option/>,<option>השכלה אקדמאית</option>,<option>השכלה תיכונית</option>,<option>10-12 שנות לימוד</option>,<option>6-9 שנות לימוד</option>,<option>5 שנות לימוד או פחות</option>,<option>לא מעוניין לענות</option>];
        var today = (new Date()).toISOString().split("T")[0];
        return (
            <div className='popup'>
                <div className='popup_inner_info'>
                    <button onClick={this.props.closePopup} id="x">x</button>
                    {!this.props.isEdit ?
                    <Card style={{ align:'center',width: '30rem', marginLeft: '15%', marginTop:'0%' }}>
                        <Card.Header><b>{this.props.user.First_Name}{' '}{this.props.user.Last_Name}</b></Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item > תאריך לידה: {bDate} </ListGroup.Item>
                            <ListGroup.Item > גיל: {age}</ListGroup.Item>
                            <ListGroup.Item> מין: {this.props.user.Gender} </ListGroup.Item>
                            <ListGroup.Item> טלפון: {this.props.user.Phone_Number} </ListGroup.Item>
                            {patientListItems}
                        </ListGroup>
                    </Card> : null }
                    <button style={{width: 150}} variant="info" onClick={this.props.changeToEdit}> עריכת פרטים </button>
                    <form onSubmit={this.handleSubmitInfo} onReset={this.handleReset} id="new_user_form">
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">שם פרטי</label>
                            <input className="inputs_in_add_user" name="fName" type="text" value={this.state.fName} maxLength="20"
                                   onChange={this.handleChangeInfo} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">שם משפחה </label>
                            <input className="inputs_in_add_user" name="lName" type="text" value={this.state.lName} maxLength="20"
                                   onChange={this.handleChangeInfo} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">מספר טלפון</label>
                            <input className="inputs_in_add_user" name="phone" type="tel" id="phone" pattern="[0-9]{10}"
                                   value={this.state.phone} onChange={this.handleChangeInfo} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">תאריך לידה</label>
                            <input className="inputs_in_add_user" name="bday" type="date" max={today}
                                   value={bDate} onChange={this.handleChangeInfo} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">משקל (ק"ג) </label>
                            <input className="inputs_in_add_user" name="weight" type="number" value={this.state.weight}
                                   onChange={this.handleChangeInfo} required/>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">גובה (ס"מ) </label>
                            <input className="inputs_in_add_user" name="height" type="number" value={this.state.height}
                                   onChange={this.handleChangeInfo} required/>
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
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">השכלה </label>
                            <select className="select_in_add_user" onChange={this.onSelectEducation}>
                                {educationOptions}
                            </select>
                        </div>
                        <div className="divs_in_add">
                            <label className="labels_in_add_user">סוג ניתוח </label>
                            <select className="select_in_add_user" onChange={this.onSelectSurgeryType}>
                                {surgeryOptions}
                            </select>
                        </div>
                    <div className="divs_in_add">
                        <label className="labels_in_add_user">תאריך ניתוח</label>
                        <input className="inputs_in_add_user" name="dateOfSurgery" type="date"
                               value={this.state.dateOfSurgery} onChange={this.handleChangeInfo} required/>
                    </div>
                        <div className="divs_in_add">
                            <input type="submit" value="הירשם" className="submit_and_reset_buttons"/>
                        </div>
                        <br/>
                        <br/>
                    </form>
                </div>
            </div>
        );
    }
}