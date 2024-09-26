const Reservation = require("../models/reservations");
const Restaurant = require("../models/restaurant");

const createReservation = async (req, res, next) => {
  try {
    const { restaurant, booking_date, time, n_persons } = req.body;
    const user = req.user.id;
    if ((!restaurant, booking_date, time, n_persons)) {
      return res.status(400).json("All fields are required");
    }
    const restaurantExists = await Restaurant.findById(restaurant);
    if (!restaurantExists) {
      return res.status(400).json("This restaurant does not exist");
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
    return res
      .status(200)
      .json({ message: "Reserve successfully created", reservationSaved });
  } catch (error) {
    return res.status(400).json(500).json("Server error");
  }
};

const getReservationByUser = async (req, res, next) => {
  try {
    const user = req.user.id;
    const reserve = await Reservation.find({ user }).populate(
      "restaurants",
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
    const user = req.user.id;

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: user,
    });
    if (!restaurant) {
      return res
        .status(403)
        .json(
          "You do not have permission to view this restaurant's reservations"
        );
    }
    const reservations = await Reservation.find({
      restaurant: restaurantId,
    }).populate("users", "userName email");
    return res.status(200).json({ reservations });
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

const cancelReservation = async (req, res, next) => {
  try {
    const reserveId = req.params.id;
    const user = req.params.id;

    const reservation = await Reservation.findOne({ _id: reserveId, user });
    if (!reservation) {
      return res
        .status(404)
        .json("Booking not found or you do not have permission to cancel it");
    }
    reservation.state = "canceled";
    await reservation.save();
    return res
      .status(200)
      .json({ message: "Reservation successfully cancelled", reservation });
  } catch (error) {
    return res.status(500).json("Server error");
  }
};

module.exports = {
  getReservationByUser,
  getReservationsByRestaurant,
  createReservation,
  cancelReservation,
};
