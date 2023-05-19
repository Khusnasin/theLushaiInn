import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

function Bookingscreen({}) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();
    
    const { roomid, fromdate, todate } = useParams();
    
    const fromDate = moment(fromdate, 'DD-MM-YYYY');
    const toDate = moment(todate, 'DD-MM-YYYY');
    const totalDays = moment.duration(toDate.diff(fromDate)).asDays() + 1;

    const totalAmount = room ? totalDays * room.rentPerDay : 0;

    const getroom = async () => {
        setloading(true);
        const { data } = await axios.post('/api/rooms/getroombyid', { roomid: roomid });
        setroom(data);
        setloading(false);
    }

    useEffect(() => {
        try {

            getroom(room);

        } catch (error) {
            seterror(true);
            setloading(false);
        }
    }, [])

    async function bookRoom(){

        const bookingDetails = {
            room, 
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromdate,
            todate,
            totalAmount,
            totalDays

        }

        try{
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
        }
        catch (error){

        }
    }

    return (
        <div className="m-5">
            {loading ? (<Loader />) : room ? (<div>
                <div className="row justify-content-center mt-5 bs">
                    <div className="col-md-5">
                        <h1>{room.name}</h1>
                        <img src={room.imageUrls[0]} className="bigimg" />

                    </div>
                    <div className="col-md-5">
                        <h1>Booking Details</h1>
                        <hr />

                        <b>
                            <p>Name : </p>
                            <p>From Date : {fromdate} </p>
                            <p>To Date : {todate} </p>
                            <p>Max Count : {room.maxCount}</p>
                        </b>
                        <div>
                            <b>
                                <h1>Amount</h1>
                                <hr />
                                <p>Total days : {totalDays} </p>
                                <p>Rent per day : {room.rentPerDay}</p>
                                <p>Total Amount : {totalAmount} </p>
                            </b>
                        </div>
                        <div style={{ float: 'right' }}>
                            <button className="btn btn-primary" onClick={bookRoom}>Pay Now</button>
                        </div>
                    </div>
                </div>

            </div>) : (<Error />)}
        </div>
    )
}
export default Bookingscreen;