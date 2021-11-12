import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import Timebar from './Timebar'

const noop = () => {}

const Header = (props) => {

  const {
    time,
    onMove,
    onEnter,
    onLeave,
    width,
    timebar: rows,
    sticky,
    sticky: { isSticky, headerHeight, viewportWidth } = {},
  } = props

  const scroll = useRef();
  const timebar = useRef();

  useEffect(() => {
    if (sticky) {
      sticky.setHeaderHeight(timebar.current.offsetHeight)
      const { scrollLeft, isSticky } = sticky
      if (isSticky) {
        scroll.current.scrollLeft = scrollLeft
      }
    }
  },[sticky])

  const handleScroll = () => {
    sticky.handleHeaderScrollY(scroll.current.scrollLeft)
  }

  return (
    <div
      style={isSticky ? { paddingTop: headerHeight } : {}}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        className={`rt-timeline__header ${isSticky ? 'rt-is-sticky' : ''}`}
        style={isSticky ? { width: viewportWidth, height: headerHeight } : {}}
      >
        <div className="rt-timeline__header-scroll" ref={scroll} onScroll={isSticky ? handleScroll : noop}>
          <div ref={timebar} style={isSticky ? { width } : {}}>
            <Timebar time={time} rows={rows} />
          </div>
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  time: PropTypes.shape({}).isRequired,
  timebar: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
    }).isRequired
  ).isRequired,
  onMove: PropTypes.func.isRequired,
  onEnter: PropTypes.func.isRequired,
  onLeave: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
  sticky: PropTypes.shape({
    isSticky: PropTypes.bool.isRequired,
    setHeaderHeight: PropTypes.func.isRequired,
    viewportWidth: PropTypes.number.isRequired,
    handleHeaderScrollY: PropTypes.func.isRequired,
    scrollLeft: PropTypes.number.isRequired,
  }),
}

export default Header
