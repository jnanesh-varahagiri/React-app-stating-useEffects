import { useRef, useState ,useEffect } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from './loc.js'
const storedIds = JSON.parse(localStorage.getItem('selectedPlaces')) ||[]
const storedPlaces = storedIds.map(id => AVAILABLE_PLACES.find((place)=> place.id==id))
// import Badge from 'react-bootstrap/Badge';
// import Button from 'react-bootstrap/Button';

function App() {
  const selectedPlace = useRef();
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [availablePlaces,setAvailablePlaces] = useState([])
  const [isOpen,setModelIsOpen]= useState(false)
  console.log(availablePlaces)
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition((postion)=>{
      console.log(postion)
      const sortedPlaces =  sortPlacesByDistance(AVAILABLE_PLACES,postion.coords.latitude , postion.coords.longitude)
      setAvailablePlaces(sortedPlaces)
    })

  },[])


  function handleStartRemovePlace(id) {
    console.log(id)
    console.log(modal)
    setModelIsOpen(true)
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModelIsOpen(false)
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });
    const storeIds =  JSON.parse(localStorage.getItem('selectedPlaces'))  || [];
    if(storeIds.indexOf(id)=== -1 ){
      localStorage.setItem('selectedPlaces' , JSON.stringify([id,...storeIds]))

    }   
  }

  function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModelIsOpen(false)

    const storeIds = JSON.parse(localStorage.getItem('selectedPlaces'))  || [];
    localStorage.setItem('selectedPlaces',JSON.stringify(storeIds.filter((id)=> id!==selectedPlace.current )))
  }

  
  return (
    <>
      
      <Modal open={isOpen}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>
      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          places={pickedPlaces}
          fallbackText="Select the places you would like to visit below."
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
