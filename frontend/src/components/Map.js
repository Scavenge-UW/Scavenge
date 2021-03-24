import React from 'react';
import ReactMapGL from 'react-map-gl';
import { Col, Row, Container } from "react-bootstrap";
import '../css/Map.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    // this.state = {
    //   viewport: {
    //     width: "100vw",
    //     height: "100vh",
    //     latitude: 42.430472,
    //     longitude: -123.334102,
    //     zoom: 16
    //   }
    // };

    this.state = {
      lng: -70.9,
      lat: 42.35,
      zoom: 9
      };
    this.mapContainer = React.createRef();
  }

  componentDidMount() {
    const { lng, lat, zoom } = this.state;
    const map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('move', () => {
      this.setState({
      lng: map.getCenter().lng.toFixed(4),
      lat: map.getCenter().lat.toFixed(4),
      zoom: map.getZoom().toFixed(2)
      });
    });
  }
  

//   setUserLocation = () => {
//     navigator.geolocation.getCurrentPosition(position => {
//         let newViewport = {
//             height: "100vh",
//             width: "100vw",
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//             zoom: 12
//         }
//         this.setState({
//             viewport: newViewport
//         })
//     })
// }

  render() {
  //  <button onClick={this.setUserLocation}>My Location</button>
    mapboxgl.workerClass = MapboxWorker;
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    const { lng, lat, zoom } = this.state;
    return (
      <div>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={this.mapContainer} className="map-container" />
      </div>
    )
  }
}

export default Map;