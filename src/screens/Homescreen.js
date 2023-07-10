import React, { useState, useEffect } from 'react'
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from '../components/Error';
import { DatePicker, Space } from 'antd';
import moment from 'moment';



const { RangePicker } = DatePicker;


function Homescreen() {
    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState();
    const [error, seterror] = useState();

    const [fromdate, setfromdate] = useState();
    const [todate, settodate] = useState();
    const [duplicaterooms, setduplicaterooms] = useState([]);

    const[searchkey, setsearchkey] = useState('');
    const[type , settype] = useState('all');

    const getrooms = async () => {
        setloading(true);
        const { data } = await axios.get('/api/rooms/getallrooms');
        setrooms(data);
        setduplicaterooms(data);
        setloading(false);
    }

    useEffect(() => {
        try {

            getrooms(rooms);

        } catch (error) {
            seterror(true);
            console.log(error);
            setloading(false);
        }


    }, []);
    function filterByDate(dates) {

        const from = moment(dates[0].$d);
        const to = moment(dates[1].$d);

        console.log('from', from);
        console.log('to', to);

        setfromdate(from.format('DD-MM-YYYY'));
        settodate(to.format('DD-MM-YYYY'));

        //setfromdate(moment(dates[0].$d).format('DD-MM-YYYY'));
        //settodate(moment(dates[1].$d).format('DD-MM-YYYY'));

        var temprooms = []
        var availability = false
        for (const room of duplicaterooms) {
            if (room.currentBookings.length > 0) {

                for (const booking of room.currentBookings) {
                    console.log('booking.fromdate', booking.fromdate);
                    console.log('booking.todate', booking.todate);
                    if (!from.isBetween(booking.fromdate._i, booking.todate._i)
                        && !to.isBetween(booking.fromdate._i, booking.todate._i)
                    ) {

                        if (
                            from.format('DD-MM-YYYY') !== booking.fromdate._i &&
                            from.format('DD-MM-YYYY') !== booking.todate._i &&
                            to.format('DD-MM-YYYY') !== booking.fromdate._i &&
                            to.format('DD-MM-YYYY') !== booking.todate._i
                        ) {
                            availability = true
                        }
                    }
                }
            }

            if (availability == true || room.currentBookings.length == 0) {
                temprooms.push(room);
            }
            setrooms(temprooms);
        }


    }

    function handleDateRangeChange(dates) {
        filterByDate(dates);
    }

    function filterBySearch(){
        const temprooms = duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()));
        setrooms(temprooms);
    }

    function filterByType(e){
        settype(e);
        if(e !== 'all'){
            const temprooms = duplicaterooms.filter(room=>room.type.toLowerCase()===e.toLowerCase());
            setrooms(temprooms);
        }
        else{
            setrooms(duplicaterooms);
        }
        
    }

    return (
        <div className='container'>
            <div className='row mt-5 bs'>
                <div className='col-md-3'>
                    <RangePicker format='DD-MM-YYYY' onChange={handleDateRangeChange} />

                </div>

                <div className='col-md-5'>
                    <input type="text" className='form-control' placeholder='search rooms' 
                    value = {searchkey} onChange={(e) => {setsearchkey(e.target.value)}} onKeyUp={filterBySearch}
                    />
                </div>

                <div className='col-md-3'>
                    <select className='form-control' value={type} onChange={(e)=>{filterByType(e.target.value)}}>
                        <option value="all">All</option>
                        <option value="delux">Delux</option>
                        <option value="non-delux">Non-Delux</option>
                    </select>
                </div>


            </div>
            <div className="row justify-content-center mt-5">
                {loading ? (<Loader />) : (rooms.map(room => {
                    return <div className="col-md-9 mt-2">
                        <Room room={room} fromdate={fromdate} todate={todate} />
                    </div>;
                }))}

            </div>
        </div>
    );
}

export default Homescreen;