'use client';

import { useMemo, useState } from 'react';
import { urlFor } from '@/sanity/lib/image';
import Image from 'next/image';
import Link from 'next/link';

import type { Performance } from '@/types/performance';
import type { Artist } from '@/types/artist';

import './PerformanceCalendar.scss';

interface PerformanceCalendarProps {
  performances: Performance[];
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function PerformanceCalendar({
  performances,
}: PerformanceCalendarProps) {
  const today = new Date();

  const todayKey =
    `${today.getFullYear()}-` +
    `${String(today.getMonth() + 1).padStart(2, '0')}-` +
    `${String(today.getDate()).padStart(2, '0')}`;

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // 선택된 날짜
  const [selectedDate, setSelectedDate] = useState(todayKey);

  // ==================================================
  // Date Helpers
  // ==================================================

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatSelectedDate = (dateKey: string) => {
    const [year, month, day] = dateKey
      .split('-')
      .map(Number);

    const date = new Date(year, month - 1, day);

    return {
      year,
      month,
      day,
      weekday: WEEKDAYS[date.getDay()],
    };
  };

  // ==================================================
  // Month
  // ==================================================

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );

  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  const firstDayIndex = firstDayOfMonth.getDay();
  const lastDate = lastDayOfMonth.getDate();

  // ==================================================
  // Calendar Days
  // ==================================================

  const calendarDays = useMemo(() => {
    const days: Array<Date | null> = [];

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let date = 1; date <= lastDate; date++) {
      days.push(
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          date
        )
      );
    }

    while (days.length % 7 !== 0) {
      days.push(null);
    }

    return days;
  }, [
    currentDate,
    firstDayIndex,
    lastDate,
  ]);

  // ==================================================
  // Performances By Date
  // ==================================================

  const performancesByDate = useMemo(() => {
    const grouped: Record<string, Performance[]> = {};

    performances.forEach((performance) => {
      if (!performance.date) return;

      const dateKey = performance.date.slice(0, 10);

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }

      grouped[dateKey].push(performance);
    });

    return grouped;
  }, [performances]);

  // ==================================================
  // Selected Performances
  // ==================================================

  const selectedPerformances =
    performancesByDate[selectedDate] ?? [];

  const selectedDateInfo =
    formatSelectedDate(selectedDate);

  // ==================================================
  // Month Navigation
  // ==================================================

  const handlePreviousMonth = () => {
    const previousMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );

    const currentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    // 현재 달보다 이전 달로 이동하지 않음
    if (previousMonth < currentMonth) {
      return;
    }

    setCurrentDate(previousMonth);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
  };

  const handleToday = () => {
    setCurrentDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setSelectedDate(todayKey);
  };

  // ==================================================
  // Select Date
  // ==================================================

  const handleSelectDate = (date: Date) => {
    const dateKey = formatDateKey(date);

    // 오늘 이전 날짜 선택 불가
    if (dateKey < todayKey) {
      return;
    }

    setSelectedDate(dateKey);
  };

  const monthTitle =
    `${currentDate.getFullYear()}년 ` +
    `${currentDate.getMonth() + 1}월`;

  return (
    <div className="sub-page-section performance-calendar">
      <div className="inner">
        {/* ==================================================
            Calendar Header
        ================================================== */}

        <div className="calendar-header">

          <div className="calendar-title">
            <h2>{monthTitle}</h2>
          </div>

          <div className="calendar-controls">

            <button
              type="button"
              onClick={handlePreviousMonth}
              disabled={
                currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth()
              }
              aria-label="이전 달"
            >
              <span className="material-symbols-rounded">keyboard_arrow_left</span>
            </button>

            <button
              type="button"
              className="today-button"
              onClick={handleToday}
            >
              오늘
            </button>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="다음 달"
            >
              <span className="material-symbols-rounded">keyboard_arrow_right</span>
            </button>

          </div>

        </div>

        {/* ==================================================
            Weekdays
        ================================================== */}

        <div className="calendar-weekdays">
          {WEEKDAYS.map((weekday) => (
            <div
              key={weekday}
              className="calendar-weekday"
            >
              {weekday}
            </div>
          ))}
        </div>

        {/* ==================================================
            Calendar
        ================================================== */}

        <div className="calendar-grid">

          {calendarDays.map((date, index) => {

            if (!date) {
              return (
                <div
                  key={`empty-${index}`}
                  className="calendar-day is-empty"
                />
              );
            }

            const dateKey = formatDateKey(date);

            const dayPerformances =
              performancesByDate[dateKey] ?? [];

            const isToday =
              dateKey === todayKey;

            const isSelected =
              dateKey === selectedDate;

            const isPast =
              dateKey < todayKey;

            return (
              <button
                key={dateKey}
                type="button"
                disabled={isPast}
                className={[
                  'calendar-day',
                  isToday ? 'is-today' : '',
                  isSelected ? 'is-selected' : '',
                  isPast ? 'is-past' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleSelectDate(date)}
              >
                <div className="calendar-date">
                  <span>
                    {date.getDate()}
                  </span>
                </div>

                {!isPast && dayPerformances.length > 0 && (
                  <div className="calendar-performance-indicator">
                    <span />

                    {dayPerformances.length > 1 && (
                      <small>
                        {dayPerformances.length}
                      </small>
                    )}
                  </div>
                )}
              </button>
            );
                    })}

        </div>

        {/* ==================================================
            Selected Date
        ================================================== */}

        <div className="selected-date-performance">

          <div className="selected-date-header">

            <div>
              <p>SELECTED DATE</p>

              <h3>
                {selectedDateInfo.month}.
                {String(selectedDateInfo.day).padStart(2, '0')}
                {' '}
                <span>
                  {selectedDateInfo.weekday}요일
                </span>
              </h3>
            </div>

            <span className="selected-performance-count">
              공연 {selectedPerformances.length}
            </span>

          </div>

          {selectedPerformances.length > 0 ? (

            <div className="selected-performance-list">

              {selectedPerformances.map(
                (performance) => {

                  const slug =
                    performance.slug?.current;

                  const content = (
                    <>
                      <div className="selected-performance-time">
                        {performance.startTime || '--:--'}
                      </div>

                      <div className="selected-performance-poster">
                        {performance.poster?.asset && (
                          <Image
                            src={urlFor(performance.poster)
                              .width(300)
                              .height(400)
                              .url()}
                            alt={performance.title}
                            width={300}
                            height={400}
                          />
                        )}
                      </div>

                      <div className="selected-performance-info">

                        <strong>
                          {performance.title}
                        </strong>

                        {performance.artists &&
                          performance.artists.length > 0 && (
                            <span>
                              {performance.artists
                                .map((artist) => artist.name)
                                .join(' · ')}
                            </span>
                        )}

                      </div>

                      <span className="selected-performance-arrow">
                        →
                      </span>
                    </>
                  );

                  if (!slug) {
                    return (
                      <div
                        key={performance._id}
                        className="selected-performance-item"
                      >
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={performance._id}
                      href={`/performances/${slug}`}
                      className="selected-performance-item"
                    >
                      {content}
                    </Link>
                  );
                }
              )}

            </div>

          ) : (

            <div className="no-performance">
              <p>
                선택한 날짜에는 예정된 공연이 없습니다.
              </p>
            </div>

          )}

        </div>

        {/* ==================================================
              Upcoming
          ================================================== */}

          <div className="upcoming-performances">

            <div className="upcoming-header">
              <p>UPCOMING PERFORMANCE</p>
              <h3>다가오는 공연</h3>
            </div>

            <div className="upcoming-list">

              {performances
                .filter((performance) => {
                  if (!performance.date) {
                    return false;
                  }

                  return (
                    performance.date.slice(0, 10) >=
                    todayKey
                  );
                })
                .slice(0, 5)
                .map((performance) => {

                  const slug =
                    performance.slug?.current;

                  const date = new Date(
                    performance.date
                  );

                  const month =
                    date.getMonth() + 1;

                  const day =
                    date.getDate();

                  const weekday =
                    WEEKDAYS[date.getDay()];

                  const content = (
                    <>
                      <div className="upcoming-date">

                        <strong>
                          {month}.
                          {String(day).padStart(2, '0')}
                        </strong>

                        <span>
                          {weekday} {performance.startTime}
                        </span>

                      </div>

                      <div className="upcoming-poster">
                        {performance.poster?.asset && (
                          <Image
                            src={urlFor(performance.poster)
                              .width(300)
                              .height(400)
                              .url()}
                            alt={performance.title}
                            width={300}
                            height={400}
                          />
                        )}
                      </div>


                      <div className="upcoming-info">

                        <strong>
                          {performance.title}
                        </strong>

                        {performance.artists &&
                          performance.artists.length > 0 && (
                            <span>
                              {performance.artists
                                .map((artist) => artist.name)
                                .join(' · ')}
                            </span>
                        )}

                      </div>

                      <span className="upcoming-arrow">
                        →
                      </span>
                    </>
                  );

                  if (!slug) {
                    return (
                      <div
                        key={performance._id}
                        className="upcoming-item"
                      >
                        {content}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={performance._id}
                      href={`/performances/${slug}`}
                      className="upcoming-item"
                    >
                      {content}
                    </Link>
                  );
                })}

            </div>

          </div>
      </div>
    </div>
  );
}
