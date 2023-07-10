import React, { useState, useEffect, Component } from 'react';
import axios from 'axios';
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';
import { Tabs } from 'antd';
import { TabPane } from 'react-bootstrap';

function Adminscreen() {

    useEffect(() => {
        const current_user = JSON.parse(localStorage.getItem('currentUser'));

        console.log(current_user);
        if (current_user.isAdmin) {
            window.location.href = '/admin';
        }

    }, []);
    return (
        <div className='mt-3 ml-3 mr-3 bs'>
            <h1 style={{ fontSize: '30px' }}><b>Admin Panel</b></h1>
            <Tabs defaultActiveKeys='1'>
                <TabPane tab='Bookings' key='1'>
                    <Bookings />
                </TabPane>
                <TabPane tab='Rooms' key='2'>
                    <Rooms />
                </TabPane>
                <TabPane tab='Add Room' key='3'>
                    <Addroom />
                </TabPane>
                <TabPane tab='Users' key='4'>
                    <Users />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default Adminscreen;

//Booking list components

export function Bookings() {

    const [bookings, setbookings] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const fetchBookings = async () => {
        try {
            const response = await axios.get('/api/bookings/getallbookings');
            const data = response.data;
            setbookings(data);
            setloading(false);
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
        }
    };
    useEffect(() => {
        fetchBookings();
    }, [])

    return (
        <div className='row'>
            <div className='col-md-12'>

                <h1>Bookings</h1>
                {loading && <Loader />}
                {bookings.length && <p style={{ fontSize: '20px' }}><b>Total: {bookings.length} Bookings</b></p>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Booking Id</th>
                            <th>User Id</th>
                            <th>Room</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Status</th>
                        </tr>

                    </thead>

                    <tbody>
                        {bookings.length && (bookings.map(booking => {
                            return <tr>
                                <td>{booking._id}</td>
                                <td>{booking.userid}</td>
                                <td>{booking.room}</td>
                                <td>{booking.fromdate}</td>
                                <td>{booking.todate}</td>
                                <td>{booking.status}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

//Room list components

export function Rooms() {

    const [rooms, setrooms] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const fetchRooms = async () => {
        try {
            const response = await axios.get('/api/rooms/getallrooms');
            const data = response.data;
            setrooms(data);
            setloading(false);
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
        }
    };
    useEffect(() => {
        fetchRooms();
    }, [])

    return (
        <div className='row'>
            <div className='col-md-12'>

                <h1>Rooms</h1>
                {loading && <Loader />}
                {rooms.length && <p style={{ fontSize: '20px' }}><b>Total: {rooms.length} Rooms</b></p>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>Room Id</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Rent Per Day</th>
                            <th>Max Count</th>
                            <th>Phone Number</th>
                        </tr>

                    </thead>

                    <tbody>
                        {rooms.length && (rooms.map(room => {
                            return <tr>
                                <td>{room._id}</td>
                                <td>{room.name}</td>
                                <td>{room.type}</td>
                                <td>{room.rentPerDay}</td>
                                <td>{room.maxCount}</td>
                                <td>{room.phoneNumber}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

//users list components

export function Users() {

    const [users, setusers] = useState([]);
    const [loading, setloading] = useState(true);
    const [error, seterror] = useState();

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users/getallusers');
            const data = response.data;
            setusers(data);
            setloading(false);
        } catch (error) {
            console.log(error);
            setloading(false);
            seterror(error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, [])

    return (
        <div className='row'>
            <div className='col-md-12'>

                <h1>Users</h1>
                {loading && <Loader />}
                {users.length && <p style={{ fontSize: '20px' }}><b>Total: {users.length} Users</b></p>}
                <table className='table table-bordered table-dark'>
                    <thead className='bs'>
                        <tr>
                            <th>User Id</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Is Admin</th>
                        </tr>

                    </thead>

                    <tbody>
                        {users.length && (users.map(user => {
                            return <tr>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                            </tr>
                        }))}
                    </tbody>
                </table>


            </div>
        </div>
    )
}

// AddRoom component

export function Addroom() {

    const [loading, setloading] = useState(false);
    const [error, seterror] = useState();

    const[name, setname] = useState('')
    const[rentPerDay, setrentPerDay] = useState()
    const[maxCount, setmaxCount] = useState()
    const[description, setdescription] = useState()
    const[phoneNumber, setphoneNumber] = useState()
    const[Type, setType] = useState()
    const[imageurl1, setimageurl] = useState()
    const[imageurl2, setimageur2] = useState()
    const[imageurl3, setimageur3] = useState()

    async function addRoom(){

        const newroom ={
            name,
            rentPerDay,
            maxCount,
            description,
            phoneNumber,
            Type,
            imageurls : [imageurl1 , imageurl2 , imageurl3]
        }

        try{
            setloading(true);
            const response = await axios.post('/api/rooms/addroom' , newroom)
            const result = response.data;
            console.log(result);
            setloading(false);
            Swal.fire('Congrats' , "Your new room is added successfully!" , 'success').then(result => {
                window.location.href = '/home';
            })
        } catch(error) {
            console.log(error)
            setloading(false);
            Swal.fire('Oops' , "Something went wrong!" , 'error')

        }

    }

    return (
        <div className='row'>
            
            <div className='col-md-5'>
            {loading && <Loader />}
                <input type='text' className='form-control' placeholder='room name' 
                value={name} onChange={(e) => {setname(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='rent per day' 
                value={rentPerDay} onChange={(e) => {setrentPerDay(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='max count' 
                value={maxCount} onChange={(e) => {setmaxCount(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='description' 
                value={description} onChange={(e) => {setdescription(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='phone number' 
                value={phoneNumber} onChange={(e) => {setphoneNumber(e.target.value)}}
                />

            </div>

            <div className='col-md-5'>
                <input type='text' className='form-control' placeholder='type' 
                value={Type} onChange={(e) => {setType(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='image URL 1' 
                value={imageurl1} onChange={(e) => {setimageurl(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='image URL 2' 
                value={imageurl2} onChange={(e) => {setimageur2(e.target.value)}}
                />
                <input type='text' className='form-control' placeholder='image URL 3' 
                value={imageurl3} onChange={(e) => {setimageur3(e.target.value)}}
                />

            <div className='text-right'>

                <button className='btn btn-primary mt-2' onClick={addRoom}>Add Room</button>

            </div>
            </div>

        </div>
    )
}