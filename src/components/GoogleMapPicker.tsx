import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

interface GoogleMapPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

export function GoogleMapPicker({ onLocationSelect }: GoogleMapPickerProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [marker, setMarker] = useState<google.maps.Marker | null>(null)
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [center, setCenter] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    //Removed the script injection as we are using @react-google-maps/api
    //The initMap function is no longer needed.

    return () => {
      //Removed the script removal as we are using @react-google-maps/api
    }
  }, [])

  const handleSearch = () => {
    setIsLoading(true)
    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ address }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      setIsLoading(false)
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location
        setCenter(location)

        if (marker) {
          marker.setMap(null)
        }

        onLocationSelect({
          address: results[0].formatted_address,
          lat: location.lat(),
          lng: location.lng(),
        })
      } else {
        alert("No se pudo encontrar la ubicación")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Ingrese la dirección"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? <Loader className="animate-spin" /> : "Buscar"}
        </Button>
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "300px" }}
          center={center}
          zoom={15}
          onClick={(e) => {
            if (marker) {
              marker.setMap(null)
            }
            const newMarker = new window.google.maps.Marker({
              position: e.latLng,
              map: map,
            })
            setMarker(newMarker)
            const geocoder = new window.google.maps.Geocoder()
            geocoder.geocode({ location: e.latLng }, (results, status) => {
              if (status === "OK" && results[0]) {
                onLocationSelect({
                  address: results[0].formatted_address,
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                })
              }
            })
          }}
        >
          {marker && <Marker position={center} />}
        </GoogleMap>
      </LoadScript>
    </div>
  )
}

