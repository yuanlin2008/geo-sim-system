"use client"

import React from "react"
import Script from "next/script"
import { CircularProgress } from "@mui/material"
import Box from "@mui/material/Box"

const MapContext = React.createContext<null | BMapGL.Map>(null)

export function useMap() {
  return React.useContext(MapContext)
}

interface Props {}

const Map = (props: Props) => {
  const [loaded, setLoaded] = React.useState<boolean>(false)
  const rootElem = React.useRef()
  const mapRef = React.useRef()
  const onLoad = async () => {
    while (!BMapGL || !BMapGL.Map) {
      await new Promise((r) => setTimeout(r, 500))
    }
    // 初始化BMapGL
    const map = new BMapGL.Map(rootElem.current as any as HTMLElement)
    mapRef.current = map as any
    setLoaded(true)
  }
  React.useEffect(() => {
    return () => {
      // 销毁BMapGL
      if (mapRef.current) {
        console.log("Destroy BMapGL")
        ;(mapRef.current as any).destroy()
      }
    }
  }, [])

  return (
    <>
      <Script
        strategy="afterInteractive"
        onLoad={onLoad}
        src={
          // 加了callback参数后，返回的代码从document.write改成了正常dom操作!!!
          // 这应该是baidu的bug
          `//api.map.baidu.com/api?
          type=webgl&
          v=1.0&
          ak=pkevxFrKTPXfOe63ldisep93QyM8C8nZ&
          callback=aaaa`
        }
      />
      <Box ref={rootElem} sx={{ flex: "flex", height: "100%" }}>
        {!loaded && <div>loading...</div>}
      </Box>
    </>
  )
}

export default Map
