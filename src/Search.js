import React, {Component} from "react"
import axios from 'axios';
import Card from 'react-bootstrap/Card'

class SearchPatient extends Component {

    constructor() {
        super();
        this.state = {
            optionsPName: [],
            namesDiv: [],
            isFetchingNames: false,
            users: [],
            pName:'',
            showPopup: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.togglePopup = this.togglePopup.bind(this);
        this.fetchNames = this.fetchNames.bind(this);
        this.handlePName = this.handlePName.bind(this)
    }

    componentDidMount() {
        this.fetchNames()
            .then(() => console.log("Fetch names successfully"));
    }

    async fetchNames(){
        var list = [];
        var users = [];
        var namesDiv = [];
        this.setState({isFetchingNames: true});
        var response = await axios.get(
            "  https://modamedic.cs.bgu.ac.il/auth/doctors/metrics/getUsers",
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem("token")
                }
            }
        );
        if(response.data.data){
            var names = [];
            for(var i = 0; i < response.data.data.length; i++){
                let user = response.data.data[i];
                namesDiv.push({first: user.First_Name, last: user.Last_Name});
                users.push(user);
                names.push(user.First_Name.trim() + " " + user.Last_Name.trim())
            }
            names = names.sort();
            var uniqueNames = Array.from(new Set(names));
            for(i = 0; i < uniqueNames.length; i++){
                list.push(<option key={uniqueNames[i]}>{uniqueNames[i]}</option>);
            }
        }
        this.setState({
            isFetchingNames: false,
            optionsPName: list,
            namesDiv: namesDiv,
            users: users
        });
    }
    togglePopup() {
        this.setState({
            showPopup: !this.state.showPopup
        });
    }

    handlePName(event) {
        this.setState({pName: event.target.value});
    }

    async handleSubmit(event) {
        if(event){
            event.preventDefault()
        }

        let usersByName = [];
        this.state.users.forEach(user => {
            if(this.state.pName.toLocaleLowerCase() === `${user.First_Name.trim()} ${user.Last_Name.trim()}`.toLocaleLowerCase()) {
                console.log(`found user ${user}`);
                usersByName.push(user);
            }
        });
        let cards = [];
        for(let i = 0; i < usersByName.length; i++){
            let user = usersByName[i];
            let dateC = new Date(user.BirthDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'numeric', year:"numeric"});
            cards.push(
                <Card className="card" key={user.UserID}  onClick={() => {
                    sessionStorage.setItem("patientUserId", user.UserID);
                    this.togglePopup();
                }}>
                    <Card.Body className="cardBody">שם מלא: {this.state.pName.trim()} </Card.Body>
                    <Card.Body className="cardBody">תאריך לידה: {dateC}</Card.Body>
                </Card>
            );
        }
        this.setState({
            text: cards
        });
        this.togglePopup();
    }

    render() {
        require("./search.css");
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <datalist id="first-list">{this.state.optionsPName}</datalist>
                    <div className="search">
                        <label className="lSearch">
                            חפש מטופל:
                        </label>
                        <input className="iSearch"
                               id="pname"
                               type="text"
                               name="pName"
                               value={this.state.pName}
                               placeholder="שם פרטי ומשפחה"
                               onChange={this.handlePName}
                               list="first-list"
                               required
                        />
                        <button className="bSearch">
                            חפש
                        </button>
                    </div>
                </form>
                <br />
                {this.state.showPopup ?
                    <Popup
                        text={this.state.text}
                        closePopup={this.togglePopup.bind(this)}
                    /> : null
                }
            </div>
        )
    }
}

export default SearchPatient

class Popup extends React.Component {
    render() {
        return (
            <div className='popup'>
                <div className='popup_inner' >
                    <button onClick={this.props.closePopup} id="x">x</button>
                    <h4>:אנא בחר מבין הרשומות הבאות</h4>
                    {this.props.text}
                </div>
            </div>
        );
    }
}
