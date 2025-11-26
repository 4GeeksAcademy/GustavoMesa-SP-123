import React, { useState, useEffect } from 'react';
import { user } from '../jsApiComponents/user';
import { useNavigate } from 'react-router-dom';
import EventInfo from './EventInfo';

export default function JoinedEvents() {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const response = await user();
      if (response.ok) {
        setJoinedEvents(response.data.joined);
      } else if (response.status === 401) {
        alert("Tu sesión ha caducado!");
        return navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container py-4 text-light">
      <h3 className="mb-3"><i className="fa-solid fa-flag-checkered"></i> Eventos a los que me he unido</h3>

      {joinedEvents.length === 0 && <p>No te has unido a ningún evento todavía.</p>}

      {joinedEvents.map(event => (
        <div key={event.id} className="card p-3 mb-3 bg-secondary text-light shadow-sm custom-overflow">
          <h5><i className="fa-solid fa-magnifying-glass"></i> {event.title}</h5>
          <p><strong>Deporte:</strong> {event.sport}</p>
          <p><strong>Fecha:</strong> {event.date}</p>
          <p><strong>Descripción:</strong> {event.description}</p>
          <p><strong>Organizado por:</strong> {event.creator_name}</p>
          <p><strong>Participantes:</strong> {event.participants.length}/{event.max_participants}</p>

          <a
            href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
            target="_blank"
            rel="noreferrer"
            className="mf-neon-btn d-block mt-2 text-center"
          >
            Ver en Google Maps <i className="fa-solid fa-location-dot"></i>
          </a>

          <div className="mt-2">
            <EventInfo event={event} />
          </div>
        </div>
      ))}
    </div>
  );
}
