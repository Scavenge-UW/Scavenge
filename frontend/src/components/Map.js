import React from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { Col, Row, Container } from "react-bootstrap";
//import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';
import Geocoder from "react-map-gl-geocoder";

import { faUser, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/Map.css';
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "60vw",
        height: "80vh",
        latitude: 42.430472,
        longitude: -123.334102,
        zoom: 16
      },
      userLocation: {},
      pantries: [],
      selectedPantry: null
    };
    this.handleViewportChange = this.handleViewportChange.bind(this);
    this.handleGeocoderViewportChange = this.handleGeocoderViewportChange.bind(this);
    this.loadPantryPins = this.loadPantryPins.bind(this);
    this.clickPin = this.clickPin.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.setUserLocation();

    // TODO: Fetch from API
    const pantries = [
      {
        "id": 1,
        "latitude": 43.070910,
        "longitude": -89.399130,
        "color": "green",
        "name": "Pantry 1",
        "address": "Address 1"
      },
      {
        "id": 2,
        "latitude": 43.071694,
        "longitude": -89.408069,
        "color": "red",
        "name": "pantry 2",
        "address": "Address 2"
      },
    ]

    this.setState({pantries: pantries});
  }

  loadPantryPins() {
    return this.state.pantries.map(pantry => {
      return (
        <Marker
          key={pantry.id}
          latitude={parseFloat(pantry.latitude)}
          longitude={parseFloat(pantry.longitude)}
        >
          <FontAwesomeIcon className="pin" icon={faMapMarkerAlt} size="2x" color={pantry.color} onClick={() => this.clickPin(pantry)}/>
        </Marker>
      );
    });
  }

  setUserLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      let setUserLocation = {
          lat: position.coords.latitude,
          long: position.coords.longitude
      };
      let newViewport = {
          width: "60vw",
          height: "80vh",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 12
      };
      this.setState({
          viewport: newViewport,
          userLocation: setUserLocation
      });
    })
  }

  handleViewportChange(newViewport) {
    this.setState(newViewport)
  }

  // Searching for location
  handleGeocoderViewportChange = (newViewport) => {
    const geocoderDefaultOverrides = { transitionDuration: 1000 };
    this.handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
    });
  }

  clickPin(pantry) {
    if (this.state.selectedPantry === null) {
      this.setState({selectedPantry: pantry});
    } else {
      // Pin is already open
      this.closePopup();
    }
  }

  closePopup = () => {
    this.setState({
      selectedPantry: null
    }); 
  };

  render() {
  //   <div className="sidebar">
  //   Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
    // </div>
    return (
      <div className="mapContainer">
        <button className="sidebar" onClick={this.setUserLocation}>My Location</button>
        <ReactMapGL ref={this.mapRef} {...this.state.viewport} onViewportChange={(viewport => this.handleViewportChange({viewport}))} mapStyle="mapbox://styles/mapbox/outdoors-v11" mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}>
          <Geocoder
            mapRef={this.mapRef}
            onViewportChange={(viewport => this.handleGeocoderViewportChange({viewport}))}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            position="top-right"
          />
          {Object.keys(this.state.userLocation).length !== 0 ? (
            <Marker
              latitude={this.state.userLocation.lat}
              longitude={this.state.userLocation.long}
            >
              <FontAwesomeIcon icon={faUser} size="2x" />
            </Marker>
          ) : (
            <div></div>
          )}
          {this.loadPantryPins()}
          {this.state.selectedPantry !== null ? (
            <Popup
              latitude={parseFloat(this.state.selectedPantry.latitude)}
              longitude={parseFloat(this.state.selectedPantry.longitude)}
              onClose={this.closePopup}
            >
              <p><b>Name: </b>{this.state.selectedPantry.name}</p>
              <p><b>Address: </b>{this.state.selectedPantry.address}</p>
            </Popup>
            ) : null}
        </ReactMapGL>
      </div>
    )
  }
}

export default Map;