"use client";

import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { Spinner, Button } from "react-bootstrap";
import { CreateActivityPopup } from "../components/CreateActivityPopup";
import { Eventos } from "../components/Eventos";

export const MapView = () => {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newMarker, setNewMarker] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ lat: 40.4168, lng: -3.7038 });
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const fetchActivities = async () => {
    const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/activities`);
    const data = await resp.json();
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleMarkerClick = (e) => {
    setShowPopup(true);
    setNewMarker({
      latitude: e.latLng.lat(),
      longitude: e.latLng.lng(),
    });
  };

  const handleGetUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no permite geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userPos = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserLocation(userPos);
        setCurrentPosition(userPos);
      },
      () => alert("Activa la geolocalización."),
      { enableHighAccuracy: true }
    );
  };

  if (!isLoaded)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="dark" />
      </div>
    );

  return (
    <>
      {/* GÓRNY UKŁAD – FORMULARZ LEWO, MAPA PRAWO */}
      <div className="row text-center gx-3 gy-4">

        <div
          className="col-12 col-lg-6 position-relative mt-4"
          style={{ height: "80vh", overflowY: "auto" }}
        >
          <Eventos />
        </div>

        <div
          className="col-12 col-lg-6 position-relative"
          style={{
            height: "80vh",
            padding: "10px",
            border: "2px solid #EE6C4D",
            borderTop: "6px solid #E3FE18",
            boxShadow: "0 5px 15px #817DF9",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={currentPosition}
            zoom={12}
            onClick={handleMarkerClick}
            options={{ disableDefaultUI: true }}
          >
            {activities
              .filter((a) => a.latitude && a.longitude)
              .map((a) => (
                <Marker
                  key={a.id}
                  position={{ lat: a.latitude, lng: a.longitude }}
                  onClick={(e) => {
                    e.domEvent.preventDefault();
                    e.domEvent.stopPropagation();
                    setSelected(a);
                  }}
                />
              ))}

            {newMarker && (
              <Marker
                position={{ lat: newMarker.latitude, lng: newMarker.longitude }}
              />
            )}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
              />
            )}

            {selected && (
              <InfoWindow
                position={{ lat: selected.latitude, lng: selected.longitude }}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <h6>{selected.name}</h6>
                  <p>{selected.sport}</p>
                  <small>{new Date(selected.date).toLocaleString()}</small>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          <Button
            variant="dark"
            className="position-absolute"
            style={{ bottom: "20px", right: "70px", zIndex: 10, padding: "20px" }}
            onClick={() => setShowPopup(true)}
          >
            Crear actividad deportiva
          </Button>

          {showPopup && (
            <CreateActivityPopup
              show={showPopup}
              handleClose={() => setShowPopup(false)}
              coordinates={newMarker}
              onActivityCreated={() => {
                fetchActivities();
                setShowPopup(false);
              }}
            />
          )}
        </div>
      </div>




      <hr style={{ border: "1px solid #817DF9", margin: "40px 0" }} />


      <div
        className="container mt-5 mb-5 actividades-box"
      >
        <h3 className="text-center fw-bold mb-3 actividades-title">
          Actividades a las que quizá quieras unirte
        </h3>

        <div className="event-scroll-wrapper">
          <div className="event-scroll-container">
            {activities.length === 0 ? (
              <div className="text-muted">No hay actividades todavía.</div>
            ) : (
              activities.slice(0, 10).map((ev) => (
                <div key={ev.id} className="event-card-scroll">
                  <h5>{ev.title}</h5>
                  <p className="text-muted">{ev.sport}</p>
                  <p style={{ fontSize: "0.9rem" }}>
                    {ev.description?.slice(0, 60)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-center mt-3">
          <a href="/events" className="btn btn-dark px-4 py-2">
            Ver todos los eventos →
          </a>
        </div>
      </div>

    </>
  );
};
