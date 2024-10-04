const Reservation = require("../models/reservations");
const Restaurant = require("../models/restaurant");
const User = require("../models/users");

const createReservation = async (req, res, next) => {
  try {
    const { restaurant, booking_date, time, n_persons } = req.body;
    const user = req.user.id;

    if ((!restaurant, !booking_date, !time, !n_persons)) {
      return res.status(400).json("All fields are required");
    }
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(400).json("This restaurant does not exist");
    }
    const userInfo = await User.findById(user);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    const newReservation = new Reservation({
      user,
      restaurant,
      booking_date,
      time,
      n_persons,
      state: "pending",
    });

    const reservationSaved = await newReservation.save();

    userInfo.reservations.push(reservationSaved._id);
    restaurantDoc.reservations.push(reservationSaved._id);

    await userInfo.save();
    await restaurantDoc.save();
    return res.status(200).json({
      message: "Reserve successfully created",
      reservationSaved,
    });
  } catch (error) {
    return res.status(400).json(500).json("Server error");
  }
};

const getReservationByUser = async (req, res, next) => {
  try {
    const user = req.user.id;
    const reserve = await Reservation.find({ user }).populate(
      "restaurant",
      "name location"
    );
    return res.status(200).json({ reserve });
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

const getReservationsByRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.restaurantId;
    console.log("Restaurant ID:", restaurantId);

    const restaurant = await Restaurant.findOne({ _id: restaurantId });
    console.log("Restaurant:", restaurant);

    const reservations = await Reservation.find({
      restaurant: restaurantId,
    }).populate("user", "userName lastName");
    console.log("Reservations:", reservations);

    if (!reservations || reservations.length === 0) {
      return res.status(404).json("Reservations not found");
    }

    return res.status(200).json({ reservations });
  } catch (error) {
    console.error("Error in fetching reservations:", error);
    return res.status(500).json("Server error");
  }
};

const ReservationState = async (req, res, next) => {
  try {
    const reserveId = req.params.id;

    const reservation = await Reservation.findOne({ _id: reserveId });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    const { state } = req.body;
    reservation.state = state;
    await reservation.save();
    return res
      .status(200)
      .json({ message: `Reservation successfully ${state}`, reservation });
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

module.exports = {
  getReservationByUser,
  getReservationsByRestaurant,
  createReservation,
  ReservationState,
};
