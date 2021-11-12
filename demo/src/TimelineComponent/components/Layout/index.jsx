import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import Sidebar from '../Sidebar'
import Timeline from '../Timeline'
import { addListener, removeListener } from '../../utils/events'
import raf from '../../utils/raf'
import getNumericPropertyValue from '../../utils/getNumericPropertyValue'

const noop = () => {}

const Layout = (props) => {

  const {
    isOpen,
    tracks,
    now,
    time,
    timebar,
    toggleTrackOpen,
    sidebarWidth,
    timelineViewportWidth,
    clickElement,
    clickTrackButton,
    enableSticky,
    scrollToNow,
    onLayoutChange
  } = props

  const timeline = useRef()
  const layout = useRef()
  const sidebar = useRef()

  const [isSticky, setIsSticky] = useState(false)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [alreadyScrolled, setAlreadyScrolled] = useState(false);

  const setHeaderHeightState = headerHeight => {
    setHeaderHeight(headerHeight)
  }

  const updateTimelineBodyScroll = () => {
    setScrollLeft(timeline.current.scrollLeft)
  }

  const handleHeaderScrollY = scrollLeft => {
    raf(() => {
      setScrollLeft(scrollLeft)
    })
  }

  const handleScrollX = () => {
    raf(updateTimelineBodyScroll)
  }

  const calculateSidebarWidth = () =>
    sidebar.current.offsetWidth + getNumericPropertyValue(layout.current, 'margin-left')

  const calculateTimelineViewportWidth = () => timeline.current.offsetWidth

  const setScrollToNow = useCallback(() => {
    if (!alreadyScrolled && scrollToNow) {
      if (timelineViewportWidth === -1) {
        timeline.current.scrollLeft = time.toX(now) - 0.5 * timeline.current.offsetWidth
        setAlreadyScrolled(true);
      } else {
        timeline.current.scrollLeft = time.toX(now) - 0.5 * timelineViewportWidth
        setAlreadyScrolled(true);
      }
    }
  },[now, scrollToNow, time, timelineViewportWidth, alreadyScrolled])

  useEffect(() => {

    const handleScrollY = () => {
      raf(() => {
        const markerHeight = 0
        const { top, bottom } = timeline.current.getBoundingClientRect()
        const isSticky = top <= -markerHeight && bottom >= headerHeight
        setIsSticky(isSticky)
      })
    }

    const handleLayoutChange = () => {
      const nextSidebarWidth = calculateSidebarWidth()
      const nextTimelineViewportWidth = calculateTimelineViewportWidth()
      if (nextSidebarWidth !== sidebarWidth || nextTimelineViewportWidth !== timelineViewportWidth) {
        onLayoutChange(
          {
            sidebarWidth: calculateSidebarWidth(),
            timelineViewportWidth: calculateTimelineViewportWidth(),
          }
        )
        setScrollToNow()
      }
    }

    const handleResize = () => handleLayoutChange()

    addListener('resize', handleResize)
    handleLayoutChange(() => setScrollToNow())

    if (enableSticky) {
      addListener('scroll', handleScrollY)
      updateTimelineBodyScroll()
    }

    if (enableSticky && isSticky) {
      updateTimelineBodyScroll()
    }

    if (isOpen) {
      handleLayoutChange()
    }

    return () => {
      removeListener('scroll', handleScrollY)
      removeListener('resize', handleResize)
    }
  },[enableSticky, headerHeight, isOpen, isSticky, onLayoutChange, sidebarWidth, setScrollToNow, timelineViewportWidth])

  return (
    <div className={`rt-layout ${isOpen ? 'rt-is-open' : ''}`} ref={layout}>
      <div className="rt-layout__side" ref={sidebar}>
        <Sidebar
          timebar={timebar}
          tracks={tracks}
          toggleTrackOpen={toggleTrackOpen}
          sticky={{ isSticky, headerHeight, sidebarWidth }}
          clickTrackButton={clickTrackButton}
        />
      </div>
      <div className="rt-layout__main">
        <div className="rt-layout__timeline" ref={timeline} onScroll={isSticky ? handleScrollX : noop}>
          <Timeline
            now={now}
            time={time}
            timebar={timebar}
            tracks={tracks}
            sticky={{
              isSticky,
              setHeaderHeight: setHeaderHeightState,
              viewportWidth: timelineViewportWidth,
              handleHeaderScrollY: handleHeaderScrollY,
              headerHeight,
              scrollLeft,
            }}
            clickElement={clickElement}
          />
        </div>
      </div>
    </div>
  )
}

Layout.propTypes = {
  enableSticky: PropTypes.bool.isRequired,
  timebar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  time: PropTypes.shape({
    toX: PropTypes.func.isRequired,
  }).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  now: PropTypes.instanceOf(Date),
  isOpen: PropTypes.bool,
  toggleTrackOpen: PropTypes.func,
  scrollToNow: PropTypes.bool,
  onLayoutChange: PropTypes.func.isRequired,
  sidebarWidth: PropTypes.number,
  timelineViewportWidth: PropTypes.number,
  clickElement: PropTypes.func,
  clickTrackButton: PropTypes.func,
}

export default Layout
