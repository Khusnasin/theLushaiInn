import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";

import Swal from 'sweetalert2';

function Bookingscreen({ }) {
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();
    const [room, setroom] = useState();

    const { roomid, fromdate, todate } = useParams();

    const fromDate = moment(fromdate, 'DD-MM-YYYY');
    const toDate = moment(todate, 'DD-MM-YYYY');
    const totaldays = moment.duration(toDate.diff(fromDate)).asDays() + 1;

    const [totalamount, settotalamount] = useState();

    const getroom = async () => {
        if (!localStorage.getItem('currentUser')){
            window.location.href = '/login';
        }
        try {
            setloading(true);
            const { data } = await axios.post('/api/rooms/getroombyid', { roomid: roomid });
            settotalamount(data.rentPerDay * totaldays);
            setroom(data);
            setloading(false);
            
        } catch (error) {
            console.log(error);
            seterror(true);
            setloading(false);
        }
    }



    useEffect(() => {


        getroom(room);


    }, [])

    
    async function onToken(token) {
        console.log(token);
        const userData = JSON.parse(localStorage.getItem('currentUser'));
        const { _id, name, imageUrls, rentPerDay, maxCount } = room;
        const bookingDetails = {
            room: {
                _id,
                name,
                imageUrls,
                rentPerDay,
                maxCount,
              },
              userid: userData.data._id,
              fromdate,
              todate,
              totalamount,
              totaldays,
              token,
            };

        try {
            setloading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails)
            setloading(false);
            Swal.fire('Congratulations' , 'Payment Successful! Your room in successfully booked' , 'success').then(result=>{
                window.location.href = '/bookings'
            });
        }
        catch (error) {
            console.log(error)
            setloading(false);
            Swal.fire('oops' , 'Something went wrong' , 'error');
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
                            <p>Name : {JSON.parse(localStorage.getItem('currentUser')).data.name} </p>
                            <p>From Date : {fromdate} </p>
                            <p>To Date : {todate} </p>
                            <p>Max Count : {room.maxCount}</p>
                        </b>
                        <div>
                            <b>
                                <h1>Amount</h1>
                                <hr />
                                <p>Total days : {totaldays} </p>
                                <p>Rent per day : {room.rentPerDay}</p>
                                <p>Total Amount : {totalamount} </p>
                            </b>
                        </div>
                        <div style={{ float: 'right' }}>
                           

                            
                                <button className="btn btn-primary" onClick={() => onToken()}>Pay Now{" "}</button>
                         
                        </div>
                    </div>
                </div>

            </div>) : (<Error />)}
        </div>
    );
}
export default Bookingscreen;