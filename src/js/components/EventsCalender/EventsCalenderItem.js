import React from 'react';
import has from 'lodash/has';
import formatDate from 'date-fns/format';
import Image from '../Image/index';
// import PropTypes from 'prop-types';

function EventsCalenderItem({ part }) {
  const event = part.event;
  /* eslint-disable jsx-a11y/anchor-has-content */
  return (
    <div className="EventsCalender__item">
      <a className="u-faux-link" href={event.link} />
      {has(part, 'event.falmer_event.featured_image.resource')
        ? <div className="EventsCalender__item-image u-responsive-ratio u-responsive-ratio--wide">
            <Image src={event.falmer_event.featured_image.resource} />
          </div>
        : null}
      <div className="EventsCalender__item-container">
        <h2 className="EventsCalender__item-title">
          {event.title}
        </h2>
        <div className="EventsCalender__item-description">
          {event.description}
        </div>
        <div className="EventsCalender__item-meta">
          {formatDate(event.startDate, 'h:ssa')}
          <span> - </span>
          {formatDate(event.endDate, 'h:ssa')}
          <span> / </span>
          {event.location}
        </div>
      </div>
    </div>
  );
  /* eslint-enable jsx-a11y/anchor-has-content */
}

// TODO: Add relative date if near or started and not ended
// const nearDate = addHours(new Date(), 10);
// {isBefore(event.startDate, nearDate)
//   ? <span>
//               {' '}- Starts in {distanceInWordsToNow(event.startDate)}
//             </span>
//   : null}

EventsCalenderItem.PropTypes = {};

export default EventsCalenderItem;