import React from 'react';
import ReactMapGL, {Marker, Popup, GeolocateControl} from 'react-map-gl';
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
import PantryService from '../services/pantry.service';
import { Link } from 'react-router-dom';

const geolocateControlStyle= {
  left: 10,
  top: 10
};

// Initial location is set to Union South
const initialCoords = {
  "lat": 43.071765004664,
  "lon": -89.4076825483728
}

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        width: "60vw",
        height: "80vh",
        latitude: initialCoords['lat'],
        longitude: initialCoords['lon'],
        zoom: 13
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
    PantryService.getPantries()
      .then(pantries => {
        this.setState({
          pantries: Object.values(pantries.result)
        });
      });
  }

  loadPantryPins = () => {
    return this.state.pantries.map(pantry => {
      return (
        <Marker
          style={{width: "100px", height: "100px"}}
          key={pantry.pantry_id}
          latitude={pantry.lat}
          longitude={pantry.lon}
        >
          <FontAwesomeIcon className="pin" icon={faMapMarkerAlt} size="2x" color={pantry.color} onClick={() => this.clickPin(pantry)}/>
        </Marker>
      );
    });
  }

  // Sets location to user's current location
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
    //<button className="sidebar" onClick={this.setUserLocation}>Pantries Near Me</button>
    return (
      <div className="mapContainer">
        <ReactMapGL ref={this.mapRef} {...this.state.viewport} onViewportChange={(viewport => this.handleViewportChange({viewport}))} mapStyle="mapbox://styles/mapbox/outdoors-v11" mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}>
          <GeolocateControl
            style={geolocateControlStyle}
            positionOptions={{enableHighAccuracy: true}}
            trackUserLocation={true}
            auto
            label={"Find pantries near me"}

          />
          <Geocoder
            mapRef={this.mapRef}
            onViewportChange={(viewport => this.handleGeocoderViewportChange({viewport}))}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
            position="top-right"
          />
          {Object.keys(this.state.userLocation).length !== 0 ? (
            // <Marker
            //   latitude={this.state.userLocation.lat}
            //   longitude={this.state.userLocation.long}
            // >
            //   <FontAwesomeIcon icon={faUser} size="2x" />
            // </Marker>
            <div></div>
          ) : (
            <div></div>
          )}
          {this.loadPantryPins()}
          {this.state.selectedPantry !== null ? (
            <Popup
              latitude={parseFloat(this.state.selectedPantry.lat)}
              longitude={parseFloat(this.state.selectedPantry.lon)}
              onClose={this.closePopup}
              closeOnClick={false}
            >
              <p><strong>Name: </strong>{this.state.selectedPantry.name}</p>
              <p><strong>Address: </strong>{this.state.selectedPantry.address}</p>
              <p><Link to={"/pantries/" + this.state.selectedPantry.pantry_id}><strong>Click here for detail</strong></Link></p>
            </Popup>
            ) : null}
        </ReactMapGL>
      </div>
    )
  }
}

export default Map;