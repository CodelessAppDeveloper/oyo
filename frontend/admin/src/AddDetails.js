import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddDetails.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
function AddDetails() {
  var [price, setPrice] = useState("");
  var [roomType, setRoomType] = useState("");
  var [roomFacility, setRoomFacility] = useState("");
  var [roomImage, setRoomImage] = useState("");
  var [facility, setFacility] = useState("");
  var [facility_details, setFacilityDetails] = useState([]);
  var fetchRoomfacilities = "http://localhost:8000/facilities";
  var [uploadPercentage, setPercent] = useState(0);

  async function addfacility() {
    var request = await axios.post("http://localhost:8000/addfacility", {
      facility: facility,
      facility_cost: price,
    });
    setFacility("");
    setPrice("");
    ToastsStore.success(`New Facility added successfully`);
  }

  async function addnewroom() {
    var request = await axios.post("http://localhost:8000/addnewroom", {
      roomtype: roomType,
      roomimage: roomImage,
      roomfacility: roomFacility,
      hotelid: 1,
      statusid: 2,
    });
    ToastsStore.success(`Room Added Successfully ${request.data}!`);
  }

  var uploadFile = ({ target: { files } }) => {
    let data = new FormData();
    data.append("profile", files[0]);

    const options = {
      onUploadProgress: (progressEvent) => {
        console.log(progressEvent);
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(percent);
        if (percent < 100) {
          setPercent(percent);
        }
      },
    };

    axios.post("http://localhost:8000/upload", data, options).then((res) => {
      console.log(res.data.profile_url);
      setRoomImage(res.data.profile_url);
      setPercent(100);
      setTimeout(() => {
        setPercent(0);
      }, 2000);
      ToastsStore.success(`Image Upload Successful`);
    });
  };

  useEffect(() => {
    async function fetchFacility() {
      var request = await axios.get(fetchRoomfacilities);
      setFacilityDetails(request.data);
    }
    fetchFacility();
  }, [fetchRoomfacilities, addfacility]);

  return (
    <div className="container">
      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_CENTER}
      />
      <h4>Add New Hotel </h4>
      <br></br>
      <div className="add" style={{ marginTop: "15px", width: "56%" }}>
        <label
          className="label"
          style={{ paddingLeft: "0px", fontWeight: "bold" }}
        >
          Name:
        </label>
        <input
          type="text"
          className="p_input"
          value={facility}
          onChange={(e) => {
            setFacility(e.target.value);
          }}
        />

        <label
          className="label"
          style={{ paddingLeft: "0px", fontWeight: "bold" }}
        >
          Cost:
        </label>
        <input
          type="text"
          className="p_input"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />

        <button
          style={{
            backgroundColor: "#392F5A",
            color: "white",
            padding: "3px 15px",
            marginLeft: "10px",
          }}
          onClick={addfacility}
        >
          Add
        </button>
      </div>
      <br />

      <br></br>
      <div className="container-fluid add">
        <h2
          style={{
            textAlign: "center",
            fontSize: "16px",
            borderBottom: "2px sollid lightgrey",
            marginBottom: "10px",
          }}
        >
          Add New Room
        </h2>
        <label style={{ fontWeight: "bold" }}>Room Type:</label>
        <br></br>
        <select onChange={(e) => setRoomType(parseInt(e.target.value))}>
          <option value={1}>A/C</option>
          <option value={2}>Non A/C</option>
        </select>
        <br /> <br />
        <label style={{ fontWeight: "bold" }}>Room Facilities:</label>
        <br></br>
        <select
          onChange={(e) => {
            setRoomFacility(parseInt(e.target.value));
          }}
        >
          {facility_details.map((item) => (
            <option value={item.facility_id}>{item.facility}</option>
          ))}
        </select>
        <br></br>
        <button
          onClick={addnewroom}
          style={{
            background: "#392F5A",
            color: "white",
            padding: "5px 15px",
          }}
        >
          Add Room
        </button>
      </div>
    </div>
  );
}

export default AddDetails;
