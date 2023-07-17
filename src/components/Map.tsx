"use client"

import React from "react"
import Script from "next/script"
import Box from "@mui/material/Box"
import Progress from "@mui/material/CircularProgress"

type Props = {
  onLoaded(map: BMapGL.Map): void
}

const Map = (props: Props) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const mapRoot = React.useRef()
  const mapRef = React.useRef()

  const onLoad = async () => {
    // 等待loading结束
    while (!BMapGL || !BMapGL.Map) {
      await new Promise((r) => setTimeout(r, 500))
    }
    // 初始化BMapGL
    const map = new BMapGL.Map(mapRoot.current as any as HTMLElement)
    mapRef.current = map as any
    setIsLoading(false)
    props.onLoaded(map)
  }

  React.useEffect(() => {
    return () => {
      // 销毁BMapGL
      if (mapRef.current) {
        ;(mapRef.current as any).destroy()
      }
    }
  }, [])

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
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
      {/** Map Root */}
      <Box ref={mapRoot} sx={{ width: "100%", height: "100%" }} />
      {/** Map Overlay */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          top: "-100%",
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {isLoading && <Progress sx={{ margin: "auto" }} />}
      </Box>
    </Box>
  )
}

export default Map
