import React, {Component} from "react"
import axios from 'axios';
    import "../TableQuestionnaire.css";
    import { BrowserRouter, Route, Link } from "react-router-dom";
    import SurveyComponent from './SurveyComponent';
    import Table from 'react-bootstrap/Table';
 //   import 'bootstrap/dist/css/bootstrap.css';
class QuestionnaireManger extends Component {
    constructor() {
        super()
        this.state={
        questionnairesArr: []
        } 
       
    this.presentQuestionnaire = this.presentQuestionnaire.bind(this);
    this.presentQuestionnaire();
    }

    async presentQuestionnaire(){
  
        let url = 'http://localhost:8180/auth/usersAll/getUserQuestionnaire';
         let response =await axios.get(
          url,
            { 
                headers: { 
                    'Content-Type': 'application/json',
                   'x-auth-token': sessionStorage.getItem("token")
                } 
            });
        
            if(response.data.data){
                //console.log (response.data.data);
                let questionnairesArrTemp= [];
                //run over questionareest
                for (var i=0;i<response.data.data.length;i++){
                 questionnairesArrTemp.push([response.data.data[i].QuestionnaireID,response.data.data[i].QuestionnaireText]);
                }
   
                this.setState({
                    questionnairesArr: questionnairesArrTemp
                  });
        }
    }


    render(){
        require("../Table.css");
        return(
            <div>
                <div style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                    <table style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                        <thead style={{alignRight: "auto", alignLeft: "auto", textWeight: "large"}}>
                        <h2><b>שם שאלון</b></h2>
                        </thead>
                        <tr style={{width: "50%" , textWeight: "large"}}>
                            {this.state.questionnairesArr.map(id => (
                                <th  id = "mdd" scope="row" style={{width: "100%", textWeight: "large" }} >
                                    <Link to={`/userQuestionnaire/${id[0]}`} > {id[1]}
                                    </Link>
                                </th>
                            ))}
                        </tr>
                    </table>
                </div>
            </div>
        );

    }

}

export default QuestionnaireManger;