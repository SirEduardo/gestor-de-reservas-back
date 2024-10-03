const { isAuth } = require("../../middlewares/auth");
const {
  getReservationByUser,
  getReservationsByRestaurant,
  createReservation,
  cancelReservation,
} = require("../controllers/reservations");

const reservationRoutes = require("express").Router();

reservationRoutes.get("/my-reservation", [isAuth], getReservationByUser);
reservationRoutes.get(
  "/restaurant/:restaurantId",
  [isAuth],
  getReservationsByRestaurant
);
reservationRoutes.post("/:id", [isAuth], createReservation);
reservationRoutes.put("/:id/cancel", [isAuth], cancelReservation);

module.exports = reservationRoutes;
