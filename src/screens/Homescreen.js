import React , {useState , useEffect} from 'react'
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import moment from 'moment';



const { RangePicker } = DatePicker;


function Homescreen() {
    const[rooms,setrooms] = useState([]);
    const[loading, setloading] = useState();
    const[error , seterror] = useState();

    const[fromdate, setfromdate] = useState();
    const[todate , settodate] = useState();
    const getrooms = async() => {
        setloading(true);
        const {data} = await axios.get('/api/rooms/getallrooms');
        setrooms(data);
        setloading(false);
    }
    
    useEffect(() => {
        try{
            
            getrooms(rooms);
            
        }catch(error) {
            seterror(true);
            console.log(error);
            setloading(false);
        }
    
    
}, []);
function filterByDate(dates){
    //console.log(dates);
    setfromdate(moment(dates[0].$d).format('DD-MM-YYYY'));
    settodate(moment(dates[1].$d).format('DD-MM-YYYY'));
    
}

function handleDateRangeChange(dates) {
    filterByDate(dates);
  }

    return(
        <div className='container'>
            <div className='row mt-5'>
                <div className='col-md-3'>
                    <RangePicker format='DD-MM-YYYY' onChange={handleDateRangeChange}/>

                </div>
            </div>
            <div className="row justify-content-center mt-5">
            {loading ? (<Loader />): rooms.length>1 ? (rooms.map(room=>{
                return <div className="col-md-9 mt-2">
                        <Room room={room} fromdate={fromdate} todate={todate} />
                </div>;
            })) : (<Error />) }

            </div>
        </div>
    );
}

export default Homescreen;