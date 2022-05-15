import axios from "axios";
import * as Const from "../constants";

const semiEndpoint = Const.semiEndpoint;

export function getPriceEstimate(dataJson) {
  return axios.post(semiEndpoint + "/bookings/get-estimate", dataJson);
}

export function confirmBooking(roomId, dataJson) {
  return axios.post(semiEndpoint + "/bookings/rooms/" + roomId, dataJson);
}

export function getBookings(userId, dataJson) {
  return axios.post(semiEndpoint + "/bookings/" + userId, dataJson);
}
