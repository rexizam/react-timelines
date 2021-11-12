import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import Controls from './components/Controls'
import Layout from './components/Layout'
import createTime from './utils/time'

const UNKNOWN_WIDTH = -1

const Timeline = (props) => {

  const {
    scale,
    scale: { zoom, zoomMin, zoomMax },
    isOpen = true,
    toggleOpen,
    zoomIn,
    zoomOut,
    tracks,
    now,
    timebar,
    toggleTrackOpen,
    enableSticky = false,
    scrollToNow,
    clickElement,
    clickTrackButton
  } = props

  const [timelineViewportWidth, setTimelineViewportWidth] = useState(UNKNOWN_WIDTH);
  const [sidebarWidth, setSidebarWidth] = useState(UNKNOWN_WIDTH);
  const [time, setTime] = useState(createTime({ ...scale, viewportWidth: timelineViewportWidth }))

  useEffect(() => {
    const time = createTime({
      ...scale,
      viewportWidth: timelineViewportWidth
    })
    setTime(time);
  },[scale, timelineViewportWidth])

  const handleLayoutChange = useCallback(({ sidebarWidth, timelineViewportWidth }) => {
    const time = createTime({
      ...scale,
      viewportWidth: timelineViewportWidth,
    })

    setTime(time)
    setTimelineViewportWidth(timelineViewportWidth)
    setSidebarWidth(sidebarWidth)
  },[scale])

  return (
    <div className="rt">
      <Controls
        isOpen={isOpen}
        toggleOpen={toggleOpen}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        zoom={zoom}
        zoomMin={zoomMin}
        zoomMax={zoomMax}
      />
      <Layout
        enableSticky={enableSticky}
        now={now}
        tracks={tracks}
        timebar={timebar}
        toggleTrackOpen={toggleTrackOpen}
        scrollToNow={scrollToNow}
        time={time}
        isOpen={isOpen}
        onLayoutChange={handleLayoutChange}
        timelineViewportWidth={timelineViewportWidth}
        sidebarWidth={sidebarWidth}
        clickElement={clickElement}
        clickTrackButton={clickTrackButton}
      />
    </div>
  )
}

Timeline.propTypes = {
  scale: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
    zoom: PropTypes.number.isRequired,
    zoomMin: PropTypes.number,
    zoomMax: PropTypes.number,
    minWidth: PropTypes.number,
  }),
  isOpen: PropTypes.bool,
  toggleOpen: PropTypes.func,
  zoomIn: PropTypes.func,
  zoomOut: PropTypes.func,
  clickElement: PropTypes.func,
  clickTrackButton: PropTypes.func,
  timebar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  now: PropTypes.instanceOf(Date),
  toggleTrackOpen: PropTypes.func,
  enableSticky: PropTypes.bool,
  scrollToNow: PropTypes.bool,
}

export default Timeline
