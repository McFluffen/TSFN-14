import './schedulingPopup.css';
import React, {useState} from 'react';
import axios from 'axios';
import Select from 'react-select';

function SchedulingPopup({formattedDate}) {
  const roles = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Editor', label: 'Editor' },
    { value: 'viewer', label: 'viewer' },
  ];

  let userEmail = [];
  axios.get(`http://localhost:3001/api/users`)
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

    const [selectedUserRole, setselectedUserRole] = useState([]);

    const [textAgenda, setTextAgenda] = useState('');
    const handleChangeAgenda = (e) =>{
        setTextAgenda(e.target.value);
    }

    const [UserRoles, setUserRoles] = useState('');
    const handleUserRoles = (e) =>{
      setUserRoles(e.target.value);
    }

    const [textAtendee, setTextAtendee] = useState('');
    const handleAtendee = (e) =>{
      setTextAtendee(e.target.value);
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

    const AddEvent = () =>{
      console.log(selectedAtendees);

        if(!(TimeHour < 25 && TimeHour > -1 && TimeHour !== "" && TimeMin < 61 && TimeMin > -1 && TimeMin !== ""))
        {
          alert("Wrong input")
          return -1;
        }

        const time = TimeHour + ':' + TimeMin;
        //const atendees = userEmails;
        const newEventData = {
          email: 'samuel.leyonberg@gmail.com',
          eventName: textEventName,
          date: formattedDate,
          time: time,
          location: textLocation,
          agenda: textAgenda,
          atendees: selectedAtendees.map(selectedAtendees => selectedAtendees.value),
          userRole: ['1','2']
        };

        console.log(newEventData);
          axios.get(`http://localhost:3001/api/events/samuel.leyonberg@gmail.com/${formattedDate}/${time}`)
          .then(response => {
            console.log(response);
            if(response.status !== 202 )
            {
                alert("There is already an event for this time");
                console.log("not added")
                console.log(response);
            }
            else{

                axios.post('http://localhost:3001/api/events/', newEventData)
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
        email: 'samuel.leyonberg@gmail.com',
        eventName: textEventName,
        date: formattedDate,
        time: time,
        location: textLocation,
        agenda: textAgenda,
        atendees: ['1','2'],
        userRole: ['1','2']
      };
          
      axios.get(`http://localhost:3001/api/events/samuel.leyonberg@gmail.com/${formattedDate}/${time}`)
      .then(response => {
        if(response.status === 202)
        {
            alert("There is no an event for this time");
            console.log("not updated")
            console.log(response);
        }
        else{
            axios.patch(`http://localhost:3001/api/events/samuel.leyonberg@gmail.com/${formattedDate}/${time}`, newUpdatedEvent)
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
      axios.get(`http://localhost:3001/api/events/samuel.leyonberg@gmail.com/${formattedDate}/${time}`)
      .then(response => {
        if(response.status === 202)
        {
            alert("There is no an event for this time");
            console.log(response);
        }
        else{
          console.log(response);
            axios.delete(`http://localhost:3001/api/events/samuel.leyonberg@gmail.com/${formattedDate}/${time}`)
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
                  onChange={setselectedAtendees}
                  />
                  </div>
                  <div className="multi-choice-dropdown">
                  <Select
                  options={roles}
                  isMulti
                  isSearchable
                  closeMenuOnSelect={false}
                  placeholder="UserRole"
                  className="multi-choice-dropdown-select"
                  onChange={setselectedUserRole}
                  />
              </div>
        </div>
     );
}
 
export default SchedulingPopup;