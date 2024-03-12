import './schedulingPopup.css';
import React, {useState} from 'react';
import axios from 'axios';
import Select from 'react-select';
import jwt_decode from 'jwt-decode';

function SchedulingPopup({formattedDate}) {
  
  const token = localStorage.getItem('token')
  const decodedToken = jwt_decode(token,"SuperSecretKey")
  const NameID = decodedToken.email;
  const gatewayIP = "20.76.217.223";

  let userEmail = [];
  let addedUserRole = [];
  axios.get(`http://${gatewayIP}/users/user`)
  .then(response => {
    console.log(response)
    response.data.forEach(element => {
      console.log(element.email)
      userEmail.push({value: `${element.email}`, label: `${element.email}` });
    });
  })
  .catch(err => {
    console.log(err);
  })
    const [selectedAtendees, setselectedAtendees] = useState([]);
    const handleAtendee = (e) =>{
        setselectedAtendees(e);
    }

    const [textAgenda, setTextAgenda] = useState('');
    const handleChangeAgenda = (e) =>{
        setTextAgenda(e.target.value);
    }

    const [textLocation, setTextLocation] = useState('');
    const handleChangeLocation = (e) =>{
        setTextLocation(e.target.value);
    }

    const [textEventName, setTextEventName] = useState('');
    const handleEventName = (e) =>{
        setTextEventName(e.target.value);
    }

    const [TimeMin, setTimeMIn] = useState('');
    const handleTimeMIn = (e) =>{
        setTimeMIn(e.target.value);
    }

    const [TimeHour, setTimeHour] = useState('');
    const handleTimeHour = (e) =>{
        setTimeHour(e.target.value);
    }

    const addAdmin = () => {
      addedUserRole.push('Admin')
      console.log(addedUserRole)
    }

    const addEditor = () => {
      addedUserRole.push('Editor')
      console.log(addedUserRole)
    }

    const addViwer = () => {
      addedUserRole.push('Viwer')
      console.log(addedUserRole)
    }

    const AddEvent = () =>{
      console.log(selectedAtendees);

        if(!(TimeHour < 25 && TimeHour > -1 && TimeHour !== "" && TimeMin < 61 && TimeMin > -1 && TimeMin !== ""))
        {
          alert("Wrong input")
          return -1;
        }

        const time = TimeHour + ':' + TimeMin;
        const newEventData = {
          email: NameID,
          eventName: textEventName,
          date: formattedDate,
          time: time,
          location: textLocation,
          agenda: textAgenda,
          attendies: selectedAtendees.map(selectedAtendees => selectedAtendees.value),
          userRole: addedUserRole
        };

        console.log(newEventData);
          axios.get(`http://${gatewayIP}/event/${NameID}/${formattedDate}/${time}`)
          .then(response => {
            console.log(response);
            if(response.status !== 202 )
            {
                alert("There is already an event for this time");
                console.log("not added")
                console.log(response);
            }
            else{

                axios.post(`http://${gatewayIP}/event`, newEventData)
                console.log("added")
                alert('added');
                console.log(response);
            }
          })
          .catch(err => {
            console.log(err);
            console.log("not added")
          })
          
    }

    const UpdateEvents = () => {
      if(!(TimeHour < 25 && TimeHour > -1 && TimeHour !== "" && TimeMin < 61 && TimeMin > -1 && TimeMin !== "" ))
      {
        alert("Wrong input")
        return -1;
      }
      const time = TimeHour + ':' + TimeMin;
      const newUpdatedEvent = {
        email: NameID,
        eventName: textEventName,
        date: formattedDate,
        time: time,
        location: textLocation,
        agenda: textAgenda,
        attendies: selectedAtendees.map(selectedAtendees => selectedAtendees.value),
        userRole: addedUserRole
      };
          
      axios.get(`http://${gatewayIP}/event/${NameID}/${formattedDate}/${time}`)
      .then(response => {
        if(response.status === 202)
        {
            alert("There is no an event for this time");
            console.log("not updated")
            console.log(response);
        }
        else{
            axios.patch(`http://${gatewayIP}/event/${NameID}/${formattedDate}/${time}`, newUpdatedEvent)
            console.log("updated")
            console.log(response);
            alert("updated");
        }
      })
      .catch(err => {
        console.log(err);
        console.log("not added")
      })
    }

    const DeleteEvent = () => {
      if(!(TimeHour < 25 && TimeHour > -1 && TimeHour !== "" && TimeMin < 61 && TimeMin > -1 && TimeMin !== "" ))
      {
        alert("Wring input")
        return -1;
      }
      const time = TimeHour + ':' + TimeMin;
      axios.get(`http://${gatewayIP}/event/${NameID}/${formattedDate}/${time}`)
      .then(response => {
        if(response.status === 202)
        {
            alert("There is no an event for this time");
            console.log(response);
        }
        else{
          console.log(response);
            axios.delete(`http://${gatewayIP}/event/${NameID}/${formattedDate}/${time}`)
            console.log("deleted")
            alert("deleted");
        }
      })
      .catch(err => {
        console.log(err);
        console.log("not deleted")
      })
    }

    return ( 
        <div className="popup" >
            <div className='dateBox'>
                <header>{formattedDate}</header>
            </div>
            <div className="cudGrid">
                <button className="create" onClick={AddEvent }>create</button>
                <button className="update" onClick={UpdateEvents}>update</button>
                <button className="delete" onClick={DeleteEvent}>delete</button>
            </div>
            <div>
                <textarea className='eventName'
                value={textEventName}
                onChange={handleEventName}
                placeholder="eventName"
                style={{
                  marginTop: '10px',
                    width: '50%',
                    height: '35px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    resize: 'none', 
                }}/>
                </div>
                <h3>Time</h3>
                <div>
                <textarea className='timeHour'
                value={TimeHour}
                onChange={handleTimeHour}
                placeholder="Hour"
                style={{
                    width: '20%',
                    float: 'left',
                    height: '35px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    resize: 'none', 
                }}/>
            </div>
            <div>
                <textarea className='timeMin'
                value={TimeMin}
                onChange={handleTimeMIn}
                placeholder="Min"
                style={{
                    marginBottom: '10px',
                    marginRight: '150px',
                    float: 'left',
                    width: '20%',
                    height: '35px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    resize: 'none', 
                }}/>
            </div>
            <textarea className='location'
                value={textLocation}
                onChange={handleChangeLocation}
                placeholder="Location"
                style={{
                    width: '50%',
                    height: '35px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    resize: 'none', 
                }}/>
            <div>
                <textarea className='agenda'
                value={textAgenda}
                onChange={handleChangeAgenda}
                placeholder="Agenda"
                style={{
                    width: '70%',
                    height: '70px',
                    padding: '8px',
                    boxSizing: 'border-box',
                    border: '1px solid gray',
                    borderRadius: '8px',
                    resize: 'none', 
                }}/>
            </div>
                <div className="multi-choice-dropdown">
                  <Select
                  options={userEmail}
                  isMulti
                  isSearchable
                  closeMenuOnSelect={false}
                  placeholder="Attendees"
                  className="multi-choice-dropdown-select"
                  onChange={handleAtendee}
                  />
                  </div>
               <div>
                <button className='admin' onClick={addAdmin}>Admin</button>
                <button className='editor' onClick={addEditor}>Editor</button>
                <button className='viwer' onClick={addViwer}>Viwer</button>
               </div>
        </div>
     );
}
 
export default SchedulingPopup;
