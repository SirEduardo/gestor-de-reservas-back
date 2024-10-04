const { isAuth } = require("../../middlewares/auth");
const {
  getReservationByUser,
  getReservationsByRestaurant,
  createReservation,
  ReservationState,
} = require("../controllers/reservations");

const reservationRoutes = require("express").Router();

reservationRoutes.get("/my-reservation", [isAuth], getReservationByUser);
reservationRoutes.get(
  "/restaurant/:restaurantId",
  [isAuth],
  getReservationsByRestaurant
);
reservationRoutes.post("/:id", [isAuth], createReservation);
reservationRoutes.put("/:id/state", [isAuth], ReservationState);

module.exports = reservationRoutes;
