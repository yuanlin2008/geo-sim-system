"use client"

import Box from "@mui/material/Box"

import Map from "@/components/Map"

const Game = () => {
  async function onMapLoaded(map: BMapGL.Map) {
    map.centerAndZoom(new BMapGL.Point(116.404449, 39.914889), 5)
    map.enableScrollWheelZoom()
    map.setMinZoom(3)
    map.setMaxZoom(8)
    ;(map as any).setDisplayOptions({
      poiText: false,
      poiIcon: false,
    })
    map.setMapStyleV2({ styleId: "9c8d04152da2c4dcb9034a18700d50b9" })
  }
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Map onLoaded={onMapLoaded} />
    </Box>
  )
}
export default Game
