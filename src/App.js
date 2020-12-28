import { useState } from 'react';
import { MapContainer, TileLayer, LayerGroup, Circle } from 'react-leaflet'

import 'leaflet/dist/leaflet.css';
import './App.css';
import { LatLng } from 'leaflet';

export default function App() {
    const [markers, setmarkers] = useState([])
    const [names, setnames] = useState([])

    const roshHaayinCenter = [32.094013, 34.958110]

    const mouseMove = (e) => {
        const from = e.latlng
        let newNames = []
        markers.forEach(marker => {
            const dist = from.distanceTo(marker.latlng)
            if (dist < 1000) newNames.push(marker.name)
        })
        setnames(newNames)
    }

    return (
        <div id='mainContainer'>
            <SearchBox onResult={res => setmarkers([...markers].concat([res]))} />

            <MapContainer center={roshHaayinCenter} zoom={15} scrollWheelZoom>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LayerGroup>
                    {markers.map(marker => (
                        <MyMarker key={marker.name} marker={marker} onMouseMove={mouseMove} />
                    ))}
                </LayerGroup>
            </MapContainer>

            <Names names={names} />

            <style jsx>{`
                #mainContainer{
                    display:grid;
                    place-items:center;
                    height:100vh;
                    background:lightslategray;
                    position:relative;
                }
            `}</style>
        </div>
    )
}

function MyMarker(props) {
    return (
        <>
            <Circle eventHandlers={{ mousemove: (e) => props.onMouseMove(e) }} radius={1000} stroke={false}
                center={props.marker.latlng} pathOptions={{ fillColor: 'black' }} />
            <Circle center={props.marker.latlng} pathOptions={{ fillColor: 'blue', fillOpacity: 0.8 }} radius={25} stroke={false} />

        </>
    )
}


function Names(props) {
    return (
        <div id='namesContainer'>
            {props.names.map(name => (
                <div>{name}</div>
            ))}

            <style jsx>{`
                #namesContainer {
                    border: none;
                    border-radius: 1em;
                    padding: 1em;
                    box-shadow: rgba(0, 0, 0, 0.2) 4px 4px 4px;
                    margin: 0 1em;
                    font-family: sans-serif;
                    font-size: medium;
                    position: absolute;
                    z-index: 1000;
                    right: 8vw;
                    background:white;
                    top:20vh;
                }
            `}</style>
        </div>
    )
}


function SearchBox(props) {
    const [name, setname] = useState('שם')
    const [query, setquery] = useState('כתובת')

    const search = async (q) => {
        let res = await fetch(`https://nominatim.openstreetmap.org/search?q=${q + ' ראש העין'}&format=geojson`)
        res = await res.json()
        if (res.features.length > 0) {
            const coordinates = res.features[0].geometry.coordinates
            props.onResult({
                name: name,
                latlng: new LatLng(coordinates[1], coordinates[0])
            })
        }
    }

    return (
        <div id='searchContainer'>
            <input type='text' id='nameBox' onChange={e => setname(e.target.value)} value={name} />
            <input type='text' id='searchBox' onChange={e => setquery(e.target.value)} value={query} />
            <button id='searchBtn' onClick={(e) => search(query)}>חיפוש</button>

            <style jsx>{`
                input{
                    border: none;
                    border-radius: 999px;
                    padding: 1em;
                    box-shadow: rgba(0, 0, 0, 0.2) 4px 4px 4px;
                    margin: 0 1em;
                    font-family: sans-serif;
                    font-size: medium;
                    outline:none;
                }
                #searchBox {
                    min-width: 20vw;
                }

                #searchContainer {
                    position: absolute;
                    z-index: 1000;
                    top: 8vh;
                    right: 15vw;
                }

                #searchBtn {
                    width: 4em;
                    height: 4em;
                    border: none;
                    border-radius: 999px;
                    box-shadow: rgba(0,0,0,0.2) 4px 4px 6px;
                    background: coral;
                    color: white;
                    cursor:pointer;
                    outline:none;
                }
                #searchBtn:hover {
                    background: orange;
                }
            `}</style>
        </div>
    )
}