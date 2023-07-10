import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';
import { Divider, Space, Tag } from 'antd';

const { TabPane } = Tabs;

function Profilescreen() {

    const user = JSON.parse(localStorage.getItem("currentUser"))

    useEffect(() => {

        if (!user) {
            window.location.href = '/login'
        }
    }, [])

    return (
        <div className='ml-3 mt-3'>
            <Tabs defaultActiveKey="1" centered>
                <TabPane tab='Profile' key='1'>
                <div className='row'>
                <div className='col-md-6'>
                    <div className='bs'>
                        <h1>My Profile</h1>
                        <br />
                        <h1>Name: {user.data.name} </h1>
                        <h1>Email: {user.data.email} </h1>
                        <h1>isAdmin: {user.isAdmin ? 'YES' : 'NO'} </h1>
                    </div>
                </div>
                </div>

                </TabPane>
                <TabPane tab='Bookings' key='2'>
                    <MyBookings />
                </TabPane>
            </Tabs>



        </div>
    );
}

export default Profilescreen;

export function MyBookings() {

    const [bookings, setbookings] = useState([])
    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("currentUser"));
                setloading(true);
                const response = (await axios.post('/api/bookings/getbookingsbyuserid/', { userid: user.data._id }));
                const rooms = response.data;
                console.log(rooms);
                setbookings(rooms);
                setloading(false);
            } catch (error) {
                console.log(error);
                setloading(false)
                seterror(error);
            }
        };

        fetchData();

    }, [])

    async function cancelbooking(bookingid, roomid) {
        try {
            setloading(true)
            const response = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
            const result = response.data;
            console.log(result);
            setloading(false);
            Swal.fire('Congrats', 'Your booking has been cancelled successfully!', 'success').then(result => {
                window.location.reload()
            })
        } catch (error) {
            console.log(error)
            setloading(false);
            Swal.fire('Oops', 'Something went wrong!', 'error')
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && (<Loader />)}
                    {bookings && (bookings.map(booking => {
                        return <div className='bs'>
                            <h1>{booking.room} </h1>
                            <p><b>BookingId</b> : {booking._id}</p>
                            <p><b>CheckIn</b> : {booking.fromdate}</p>
                            <p><b>Check Out</b> : {booking.todate}</p>
                            <p><b>Amount</b> : {booking.totalamount}</p>
                            <p><b>Status </b>: {booking.status == 'cancelled' ? <Tag color="red">CANCELLED</Tag> : <Tag color="green">CONFIRMED</Tag>}</p>

                            {booking.status !== 'cancelled' && (<div className='text-right'>
                                <button class='btn btn-primary' onClick={() => { cancelbooking(booking._id, booking.roomid) }}>CANCEL BOOKING</button>
                            </div>)}
                        </div>
                    }))}
                </div>
            </div>
        </div>
    )
}
