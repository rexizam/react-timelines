import {
  MAX_ELEMENT_GAP,
  MAX_MONTH_SPAN,
  MAX_NUM_OF_SUBTRACKS,
  MAX_TRACK_START_GAP,
  MIN_MONTH_SPAN,
  MONTH_NAMES,
  MONTHS_PER_QUARTER,
  MONTHS_PER_YEAR,
  NUM_OF_MONTHS,
  NUM_OF_YEARS,
  QUARTERS_PER_YEAR,
  START_YEAR,
} from './constants'

import {
  addMonthsToYear,
  addMonthsToYearAsDate,
  colourIsLight,
  fill,
  getEndOfWeek,
  getStartOfWeek,
  getWeeksOfYear,
  hexToRgb,
  nextColor,
  randomTitle
} from './utils'
import moment from "moment"

export const buildQuarterCells = () => {
  const v = []
  for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const quarter = (i % 4) + 1
    const startMonth = i * MONTHS_PER_QUARTER
    const s = addMonthsToYear(START_YEAR, startMonth)
    const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER)
    v.push({
      id: `${s.year}-q${quarter}`,
      title: `Q${quarter} ${s.year}`,
      start: new Date(`${s.year}-${s.month}-01`),
      end: new Date(`${e.year}-${e.month}-01`),
    })
  }
  return v
}

export const buildMonthCells = () => {
  const v = []
  for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
    const startMonth = i
    const start = addMonthsToYearAsDate(START_YEAR, startMonth)
    const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1)
    v.push({
      id: `m${startMonth}`,
      title: MONTH_NAMES[i % 12],
      start,
      end,
    })
  }
  return v
}

//export const buildWeekCells = () => {
//    const v = []
//    for (let i = 1; i < WEEKS_PER_YEAR; i += 1) {
//        const startWeek = i
//        const start = getStartOfWeek(START_YEAR, startWeek)
//        if (start.getFullYear() !== START_YEAR) {
//            const start = getStartOfWeek(START_YEAR, startWeek + 1)
//            const end = getEndOfWeek(start)
//
//            v.push({
//                id: `w${startWeek}`,
//                title: `${i}`,
//                start,
//                end,
//            })
//        }
//        else {
//            const start = getStartOfWeek(START_YEAR, startWeek + 1)
//            const end = getEndOfWeek(start)
//
//            v.push({
//                id: `w${startWeek}`,
//                title: `${i}`,
//                start,
//                end,
//            })
//        }
//    }
//
//    if (NUM_OF_YEARS > 1) {
//        const lastWeekOfYear = v[v.length - 1];
//        const date = moment(new Date(lastWeekOfYear.end));
//        const weeksOfYear = getWeeksOfYear(date);
//        console.log(weeksOfYear);
//        const yearNow = moment.now()
//        const test = getWeeksOfYear(yearNow)
//        console.log(test)
//    }
//
//    return v
//}

export const buildWeekCells = () => {
  const v = [];
  const startYear = moment().utc().year(START_YEAR).day(1);
  //console.log(startYear)
  let iteration = 0;
  let numberOfYears = NUM_OF_YEARS;
  let weeksOfYear;
  let year;

  while (numberOfYears >= 1) {

    if (iteration === 0) {
      weeksOfYear = getWeeksOfYear(startYear);
      //console.log(weeksOfYear)
      year = startYear.year()
      //console.log(year)
    } else if (iteration >= 1) {
      const lastWeekOfYear = v[v.length - 1];
      //console.log(lastWeekOfYear)
      const nextYear = moment(lastWeekOfYear.end).year();
      //console.log(nextYear)
      weeksOfYear = getWeeksOfYear(nextYear);
      //console.log(weeksOfYear)
      const y = moment(startYear).add(iteration, 'year');
      year = y.year();
      //console.log(year)
    }

    for (let i = 1; i <= weeksOfYear; i += 1) {
      const start = getStartOfWeek(year, i);
      const end = getEndOfWeek(start);
      //console.log(year)
      //console.log(start)
      //console.log(end)
      //const found = v.some(el => el.start.getTime() === start.getTime());
      //if (found) {
      //    console.log('found')
      //    start = getStartOfWeek(year, i + 1);
      //    end = getEndOfWeek(start);
      //}

      v.push({
        id: `w-${start}`,
        title: `${i}`,
        start,
        end,
      })
    }

    iteration++;
    numberOfYears--;
  }
  //console.log(getStartOfWeek(year, 2))
  //console.log(moment().isoWeekYear(2021).isoWeek(1).startOf('week'))
  //console.log(v);
  return v
}

export const buildTimebar = () => [
  {
    id: 'quarters',
    title: 'Quarters',
    cells: buildQuarterCells(),
    style: {},
  },
  {
    id: 'months',
    title: 'Months',
    cells: buildMonthCells(),
    style: {},
  },
  {
    id: 'weeks',
    title: 'Weeks',
    cells: buildWeekCells(),
    useAsGrid: true,
    style: {},
  },
]

export const buildElement = ({trackId, start, end, i}) => {
  const bgColor = nextColor()
  const color = colourIsLight(...hexToRgb(bgColor)) ? '#000000' : '#ffffff'
  return {
    id: `t-${trackId}-el-${i}`,
    title: randomTitle(),
    start,
    end,
    style: {
      backgroundColor: `#${bgColor}`,
      color,
      borderRadius: '4px',
      boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
      textTransform: 'capitalize',
    },
  }
}

export const buildTrackStartGap = () => Math.floor(Math.random() * MAX_TRACK_START_GAP)
export const buildElementGap = () => Math.floor(Math.random() * MAX_ELEMENT_GAP)

export const buildElements = trackId => {
  const v = []
  let i = 1
  let month = buildTrackStartGap()

  while (month < NUM_OF_MONTHS) {
    let monthSpan = Math.floor(Math.random() * (MAX_MONTH_SPAN - (MIN_MONTH_SPAN - 1))) + MIN_MONTH_SPAN

    if (month + monthSpan > NUM_OF_MONTHS) {
      monthSpan = NUM_OF_MONTHS - month
    }

    const start = addMonthsToYearAsDate(START_YEAR, month)
    const end = addMonthsToYearAsDate(START_YEAR, month + monthSpan)
    v.push(
      buildElement({
        trackId,
        start,
        end,
        i,
      })
    )
    const gap = buildElementGap()
    month += monthSpan + gap
    i += 1
  }

  return v
}

export const buildSubtrack = (trackId, subtrackId) => ({
  id: `track-${trackId}-${subtrackId}`,
  title: `Subtrack ${subtrackId}`,
  elements: buildElements(subtrackId),
})

export const buildTrack = trackId => {
  const tracks = fill(Math.floor(Math.random() * MAX_NUM_OF_SUBTRACKS) + 1).map(i => buildSubtrack(trackId, i + 1))
  return {
    id: `track-${trackId}`,
    title: `Track ${trackId}`,
    elements: buildElements(trackId),
    tracks,
    // hasButton: true,
    // link: 'www.google.com',
    isOpen: false,
  }
}
