import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useLoadScript } from '@react-google-maps/api';
import '../assets/styles/components/mapGoogal.css';

const MapGoogalTwo = ({ inputs, longitude, latitude, name,registrationNumber, OnLocationChange }) => {
  // define default coords
  const [coords] = useState({ lat: parseFloat(latitude), lng: parseFloat(longitude) });

  const [zoom, setZoom] = useState(8);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  // load google map API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAXqrbE_WqGgouE09hnobUk3L-8h3OrmqY", 
  });

  function handleZoomChanged() {
    setZoom(this.getZoom());

    // this refers to Google Map instance
    let newLocation = this.getCenter();
    OnLocationChange({
      ...inputs,
      location: {
        "latitude": newLocation.lat(),
        "longitude": newLocation.lng()
      }
    });
  }

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      {/* check google map is loaded or not */}
      {isLoaded && (
        <GoogleMap
          center={coords}
          zoom={zoom}
          mapContainerClassName="map-container"
          margin={[50, 50, 50, 50]}
          options={{ zoomControl: true }}
          onZoomChanged={handleZoomChanged}
        >
          {coords && (
            <Marker
              position={coords}
              onClick={() => setShowInfoWindow(true)}
            >
              {showInfoWindow && (
                <InfoWindow onCloseClick={() => setShowInfoWindow(false)}>
                <div>
                <p>Name : {name}</p>
                <p>Registration Number :{registrationNumber}</p>
                                                       
                    {/* <p>Latitude: {latitude}</p>
                    <p>Longitude: {longitude}</p> */}
                </div>
                </InfoWindow>
              )}
            </Marker>
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default MapGoogalTwo;

