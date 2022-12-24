
import './App.css';
import {useState, useEffect} from "react";
import Axios from "axios";
//calendar stuff
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import {isAfter, isBefore, isEqual, parseISO, add, isPast, sub} from "date-fns";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import DatePicker from "react-datepicker";




const locales = {
  "en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
})


function App() {
  const [listOfLimitations, setListOfLimitations] = useState([]);
  const [title, setTitle] = useState("");
  const [current, setCurrent] = useState(0);
  const [total, setTotal] = useState(0);
  const [kind, setKind] = useState("Daily");
  //dates
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [selDate, setSelDate] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/getLimitations").then((response) => {
      setListOfLimitations(response.data);
    })

    //checks to see if current has been now set to the same or more as total
    //will also check to see if its end date has passed.
    listOfLimitations.map((val)=>{
      if ((val.current >= val.total) || isPast(parseISO(val.end))){
        deleteLimitation(val._id)
      }
    })

    
  }, [listOfLimitations]);

  const createLimitation = () => {
    var tempDate = start;
    var tempDur = start;
    var curKind = kind;

    if (curKind === "Daily"){
      tempDur = add(tempDur, {
        days: 1
      })
      while(isAfter(end, tempDate)){
        Axios.post("http://localhost:3001/createLimitation", {title: title, current: 0, total: total, kind: kind, start: tempDate, end: tempDur}).then((response) =>{
        setListOfLimitations([...listOfLimitations, {_id: response.data._id, title: title, current: current, total: total, kind: kind, start: start, end: end}])
        });
        tempDate = add(tempDate, {
          days: 1
        })
        tempDur = add(tempDur, {
          days: 1
        })
      }
    }
    
    if (curKind === "Weekly"){
      tempDur = add(tempDur, {
        days: 7
      })

      while((isAfter(end, tempDur) || isEqual(end, tempDur))){
        Axios.post("http://localhost:3001/createLimitation", {title: title, current: 0, total: total, kind: kind, start: tempDate, end: tempDur}).then((response) =>{
        setListOfLimitations([...listOfLimitations, {_id: response.data._id, title: title, current: current, total: total, kind: kind, start: start, end: end}])
        });
        tempDate = add(tempDate, {
          days: 7
        })
        tempDur = add(tempDur, {
          days: 7
        })
      }
    }

    if (curKind === "Monthly"){
      tempDur = add(tempDur, {
        days: 30
      })

      while((isAfter(end, tempDur) || isEqual(end, tempDur))){
        Axios.post("http://localhost:3001/createLimitation", {title: title, current: 0, total: total, kind: kind, start: tempDate, end: tempDur}).then((response) =>{
        setListOfLimitations([...listOfLimitations, {_id: response.data._id, title: title, current: current, total: total, kind: kind, start: start, end: end}])
        });
        tempDate = add(tempDate, {
          days: 30
        })
        tempDur = add(tempDur, {
          days: 30
        })
      }
    }

    if (curKind === "Once"){
      Axios.post("http://localhost:3001/createLimitation", {title: title, current: 0, total: total, kind: kind, start: start, end: end}).then((response) =>{
      setListOfLimitations([...listOfLimitations, {_id: response.data._id, title: title, current: current, total: total, kind: kind, start: start, end: end}])
      });
    }
  };

  const updateLimitation = (id) => {
    const newCurrent = prompt("Enter updated amount: ");

    Axios.put("http://localhost:3001/updateLimitation", { newCurrent: newCurrent, id: id}).then(()=> {
      setListOfLimitations(listOfLimitations.map((val)=>{
        return val._id === id ? {_id: id, title: val.title, current: newCurrent, total: val.total, kind: val.kind, start: val.start, end: val.end} : val
      }))
    })
    
  };

  const deleteLimitation = (id) =>{
    Axios.delete(`http://localhost:3001/deleteLimitation/${id}`).then(()=> {
      setListOfLimitations(listOfLimitations.filter((val)=> {
        return val._id !== id;
      }))
    })
  }

  const deleteSameLimitations = (title) =>{
    let mes = "Are you sure?\nClick Ok to confirm.";
    if (window.confirm(mes) === true) {
      Axios.delete(`http://localhost:3001/deleteSameLimitations/${title}`).then(()=> {
      setListOfLimitations(listOfLimitations.filter((val)=> {
        return val.title !== title;
      }))
    })
    } else {
      return console.log("canceled");
    }
  }

  
  const moveLeft = () =>{
    var least = new Date();
    var tempDate = new Date();
    if (selDate === ""){
      return console.log("empty")
    }

    else {
      if (isAfter(selDate, least)){
        tempDate = sub(selDate, {
          days: 1
        });
        setSelDate(tempDate);
        return console.log("day before");
      }
    }
  }

  const moveRight = () =>{
    var most = new Date(2023, 11, 31);
    var tempDate = new Date();
    if (selDate === ""){
      return console.log("empty")
    }

    else {
      if (isAfter(most, selDate)){
        tempDate = add(selDate, {
          days: 1
        });
        setSelDate(tempDate);
        return console.log("day after");
      }
    }
  }

  return (

    <div className="App">
      <link rel="stylesheet"  href="https://cdnjs.cloudflare.com/ajax/libs/react-datepicker/2.14.1/react-datepicker.min.css" />
      <div className='container'>
        <div className='limitationsDisplay'>
          <h1 id='listTitle'>List</h1>
          <div className='dateSel'>
            <h2>Date</h2>
            <button id='left' onClick={() => {moveLeft("left")}}>{`<-`}</button>
            <DatePicker placeholderText='View Date' style={{marginRight: "10px"}} 
            selected={selDate} onChange={date => setSelDate(date)} 
            minDate={new Date()} isClearable={false} includeTimes={false} maxDate={new Date(2023, 11, 31)}
            ></DatePicker>
            <button id='right' onClick={() => {moveRight("right")}}>{`->`}</button>
          </div>

          {listOfLimitations.map((limitation) =>{
            if ((isAfter(parseISO(limitation.end), selDate)) &&
             (isBefore(parseISO(limitation.start), selDate) || isEqual(parseISO(limitation.start), selDate))){
              
              return <div className='limitationBox'>
                <div className='limitation'>
                  <h3 id='limitationTitle'>Title: {limitation.title}</h3>
                  <h3>Current: {limitation.current}</h3>
                  <h3>Total: {limitation.total}</h3>
                  <h3>Kind: {limitation.kind}</h3>
                  <h3>Start: {limitation.start.toString().slice(5, 10)}</h3>
                  <h3>End: {limitation.end.toString().slice(5, 10)}</h3>
                </div>
                <button onClick={() => {updateLimitation(limitation._id)}}>Update</button>
                <button id='remove' onClick={() => {deleteLimitation(limitation._id)}}>Delete</button>
                <br></br>
                <button id='removeAll' onClick={() => {deleteSameLimitations(limitation.title)}}>Delete All</button>
              </div>
            }
          })}
        </div>

        <div className='calendar'>
          <h1 id='calendarTitle'>Calendar</h1>
          <Calendar style={{height: "600px", right: "10vw", position: "relative", zIndex: 1, backgroundColor: "#E7EFC5"}} 
          localizer={localizer} events={[...listOfLimitations]} startAccessor="start" endAccessor="end" views={['month', 'agenda']}
          ></Calendar>
        </div>

        <div className='limitationInput'>
          <h1 id='inputTitle'>Create Limitation</h1>
          <input type="text" placeholder='Title...' onChange={(event) => {setTitle(event.target.value)}}></input>
          <input type="number" placeholder='Total...' onChange={(event) => {setTotal(event.target.value)}}></input>
          <select id={kind} onChange={(event) => {setKind(event.target.value)}}>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Once">Once</option>
          </select>
          
          <DatePicker placeholderText='Start Date' style={{marginRight: "10px"}} 
            selected={start} onChange={date => setStart(date)} 
            minDate={new Date()} isClearable={true} includeTimes={false} maxDate={new Date(2023, 11, 31)}
            ></DatePicker>
          <DatePicker placeholderText='End Date'  
            selected={end} onChange={date => setEnd(date)} 
            isClearable={true} includeTimes={false} minDate={new Date()} maxDate={new Date(2023, 11, 31)}
            ></DatePicker>
          <button onClick={createLimitation} id='createButton'> Create Limitation </button>
        </div>
      </div>
    </div>
  );
}

export default App;
