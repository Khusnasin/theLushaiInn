const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

router.post("/bookroom", async (req, res) => {

    const {
        room,
        roomid,
        //userid,
        fromdate,
        todate,
        totalAmount,
        totalDays } = req.body

    console.log("room: ", room.name);
    console.log("room: ", roomid);
    //console.log("userid: ", userid);
    console.log("fromdate: ", fromdate);
    console.log("todate: ", todate);
    console.log("totalamount: ", totalAmount);
    console.log("totaldays: ", totalDays);

    try {
        console.log(room);
        if (!room) {
            throw new Error("room is required");
        }

        const newbooking = new Booking({
            room: room.name,
            roomid : room._id,
            userid: '1234',
            fromdate,
            todate,
            totalAmount,
            totalDays,
            transactionId: '1234'
        })

        console.log("newbooking: ", newbooking);

        await newbooking.save()
        res.send('Room booked successfully!');
    }
    catch (error) {
        console.log(error)
        return res.status(400).json({error: "Failed to book room!"});
    }
});

module.exports = router;