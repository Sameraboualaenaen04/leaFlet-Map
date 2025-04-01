import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.jsx';
import './App.css'

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: '300px', height: '300px',marginTop:'100px', overflowX:'hidden', marginLeft:'50px' }}
      ref={containerRef}
    />
  );
}
