import React, {useState} from "react"
import moment from 'moment'
import Timeline from './TimelineComponent'
import {START_YEAR, NUM_OF_YEARS, NUM_OF_TRACKS} from "./constants"
import {buildTimebar, buildTrack} from "./builders"
import {fill} from "./utils"
import './TimelineComponent/scss/style.scss'

const App = () => {

  const MIN_ZOOM = 2
  const MAX_ZOOM = 20

  const tracksById = fill(NUM_OF_TRACKS).reduce((acc, i) => {
    const track = buildTrack(i + 1)
    acc[track.id] = track
    return acc
  }, {})

  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(6)
  const [tracks, setTracks] = useState(Object.values(tracksById))
  const [tracksByIdList, setTracksByIdList] = useState(tracksById)

  const start = new Date(`${START_YEAR}`)
  const end = new Date(`${START_YEAR + NUM_OF_YEARS}`)
  const now = new Date(moment.now())
  const timeBar = buildTimebar()

  const handleToggleOpen = () => {
    setOpen(!open)
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 1, MAX_ZOOM))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 1, MIN_ZOOM))
  }

  const handleToggleTrackOpen = track => {

    const updatedTracksById = {
      ...tracksByIdList,
      [track.id]: {
        ...track,
        isOpen: !track.isOpen
      }
    }

    setTracksByIdList(updatedTracksById)
    setTracks(Object.values(updatedTracksById))
  }

  const clickElement = element => alert(`Clicked element\n${JSON.stringify(element, null, 2)}`)

  return (
    <div className="app">
      <h1 className="title">Test Component</h1>
      <Timeline
        scale={{
          start,
          end,
          zoom,
          zoomMin: MIN_ZOOM,
          zoomMax: MAX_ZOOM
        }}
        isOpen={open}
        toggleOpen={handleToggleOpen}
        zoomIn={handleZoomIn}
        zoomOut={handleZoomOut}
        clickElement={clickElement}
        clickTrackButton={track => {
          alert(JSON.stringify(track))
        }}
        timebar={timeBar}
        tracks={tracks}
        toggleTrackOpen={handleToggleTrackOpen}
        enableSticky
        scrollToNow
        now={now}
      />
    </div>
  )
}

export default App
