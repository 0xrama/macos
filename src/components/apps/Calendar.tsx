import React, { useState, useMemo } from "react";
import type { FC } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  addDays,
  differenceInDays
} from "date-fns";

interface CalendarEvent {
  id: string;
  date: Date;
  endDate?: Date;
  title: string;
  time?: string;
  type: "work" | "personal" | "holiday" | "reminder";
  color: string;
  description?: string;
}

type ViewType = "month" | "week" | "day";

const Calendar: FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<ViewType>("month");
  const [showSidebar, setShowSidebar] = useState(true);

  // Calendar events
  const events: CalendarEvent[] = [];

  // Get calendar grid days (including days from prev/next month)
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Get week days for week view
  const weekDays = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  }, [currentDate]);

  const prevPeriod = (): void => {
    if (viewType === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewType === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(addDays(currentDate, -1));
    }
  };

  const nextPeriod = (): void => {
    if (viewType === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewType === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const goToToday = (): void => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    return events
      .filter((event) => differenceInDays(event.date, today) >= 0)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [events]);

  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate, events]);

  const getHeaderText = (): string => {
    if (viewType === "month") {
      return format(currentDate, "MMMM yyyy");
    } else if (viewType === "week") {
      const weekStart = startOfWeek(currentDate);
      const weekEnd = addDays(weekStart, 6);
      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "d, yyyy")}`;
      }
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return format(currentDate, "EEEE, MMMM d, yyyy");
  };

  // Hours for day/week view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="h-full flex bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-gray-800 dark:text-white overflow-hidden">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700/50 bg-gray-50/80 dark:bg-gray-800/50 flex flex-col">
          {/* Mini Calendar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">
                {format(currentDate, "MMMM yyyy")}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs"
                >
                  <span className="i-fa-solid:chevron-left text-[10px]" />
                </button>
                <button
                  onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs"
                >
                  <span className="i-fa-solid:chevron-right text-[10px]" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[10px]">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                <div key={i} className="text-center text-gray-500 font-medium py-1">
                  {day}
                </div>
              ))}
              {calendarDays.slice(0, 42).map((date, i) => {
                const hasEvents = getEventsForDate(date).length > 0;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedDate(date);
                      setCurrentDate(date);
                    }}
                    className={`
                      text-center py-1 rounded-full text-[11px] relative transition-all
                      ${!isSameMonth(date, currentDate) ? "text-gray-400 dark:text-gray-600" : ""}
                      ${isToday(date) ? "bg-red-500 text-white font-bold" : ""}
                      ${isSameDay(date, selectedDate) && !isToday(date) ? "bg-blue-500 text-white" : ""}
                      ${!isToday(date) && !isSameDay(date, selectedDate) ? "hover:bg-gray-200 dark:hover:bg-gray-700" : ""}
                    `}
                  >
                    {format(date, "d")}
                    {hasEvents && !isToday(date) && !isSameDay(date, selectedDate) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Upcoming
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => {
                    setSelectedDate(event.date);
                    setCurrentDate(event.date);
                  }}
                  className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-2">
                    <div
                      className="w-1 h-full min-h-[2rem] rounded-full flex-shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{event.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isToday(event.date) ? "Today" : format(event.date, "EEE, MMM d")}
                        {event.time && ` · ${event.time}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendars Legend */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Calendars
            </h3>
            <div className="space-y-1.5">
              {[
                { name: "Work", color: "#3b82f6" },
                { name: "Personal", color: "#10b981" },
                { name: "Reminders", color: "#f59e0b" },
                { name: "Holidays", color: "#ec4899" }
              ].map((cal) => (
                <div key={cal.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: cal.color }}
                  />
                  <span>{cal.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={showSidebar ? "Hide sidebar" : "Show sidebar"}
            >
              <span className="i-fa-solid:bars text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={prevPeriod}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="i-fa-solid:chevron-left text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={nextPeriod}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <span className="i-fa-solid:chevron-right text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <h2 className="text-xl font-semibold">{getHeaderText()}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="px-4 py-1.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors"
            >
              Today
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {(["day", "week", "month"] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setViewType(view)}
                  className={`
                    px-3 py-1 text-sm font-medium rounded-md capitalize transition-all
                    ${
                      viewType === view
                        ? "bg-white dark:bg-gray-700 shadow-sm"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto">
          {viewType === "month" && (
            <div className="h-full flex flex-col p-4">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday"
                ].map((day) => (
                  <div
                    key={day}
                    className="p-2 text-xs font-semibold text-gray-500 dark:text-gray-400 text-center uppercase tracking-wider"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex-1 grid grid-cols-7 grid-rows-6">
                {calendarDays.map((date, i) => {
                  const dayEvents = getEventsForDate(date);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        border-b border-r border-gray-100 dark:border-gray-800 p-1 min-h-[80px] cursor-pointer transition-colors
                        ${!isCurrentMonth ? "bg-gray-50 dark:bg-gray-900/50" : ""}
                        ${isSameDay(date, selectedDate) ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"}
                      `}
                    >
                      <div className="flex justify-center mb-1">
                        <span
                          className={`
                            w-7 h-7 flex items-center justify-center rounded-full text-sm
                            ${isToday(date) ? "bg-red-500 text-white font-bold" : ""}
                            ${!isCurrentMonth ? "text-gray-400 dark:text-gray-600" : ""}
                          `}
                        >
                          {format(date, "d")}
                        </span>
                      </div>
                      <div className="space-y-0.5 overflow-hidden">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={event.id}
                            className="text-[10px] px-1.5 py-0.5 rounded truncate text-white font-medium"
                            style={{ backgroundColor: event.color }}
                            title={`${event.title}${event.time ? ` - ${event.time}` : ""}`}
                          >
                            {event.time && (
                              <span className="opacity-80">
                                {event.time.split(" ")[0]}{" "}
                              </span>
                            )}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-[10px] px-1.5 text-gray-500 dark:text-gray-400">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewType === "week" && (
            <div className="h-full flex flex-col">
              {/* Week header */}
              <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <div className="p-2 border-r border-gray-200 dark:border-gray-700" />
                {weekDays.map((date, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      p-2 text-center cursor-pointer border-r border-gray-200 dark:border-gray-700
                      ${isSameDay(date, selectedDate) ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800"}
                    `}
                  >
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {format(date, "EEE")}
                    </div>
                    <div
                      className={`
                        text-lg font-semibold mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full
                        ${isToday(date) ? "bg-red-500 text-white" : ""}
                      `}
                    >
                      {format(date, "d")}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-8">
                  {/* Time labels */}
                  <div className="border-r border-gray-200 dark:border-gray-700">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-12 border-b border-gray-100 dark:border-gray-800 text-[10px] text-gray-500 dark:text-gray-400 text-right pr-2 pt-0.5"
                      >
                        {hour === 0 ? "" : format(new Date().setHours(hour, 0), "h a")}
                      </div>
                    ))}
                  </div>
                  {/* Day columns */}
                  {weekDays.map((date, dayIdx) => (
                    <div
                      key={dayIdx}
                      className="border-r border-gray-200 dark:border-gray-700 relative"
                    >
                      {hours.map((hour) => (
                        <div
                          key={hour}
                          className="h-12 border-b border-gray-100 dark:border-gray-800"
                        />
                      ))}
                      {/* Events */}
                      {getEventsForDate(date).map((event) => {
                        const timeMatch = event.time?.match(/(\d+):?(\d*)\s*(AM|PM)?/i);
                        let topOffset = 9 * 48; // Default 9 AM
                        if (timeMatch) {
                          let hour = parseInt(timeMatch[1]);
                          const ampm = timeMatch[3]?.toUpperCase();
                          if (ampm === "PM" && hour !== 12) hour += 12;
                          if (ampm === "AM" && hour === 12) hour = 0;
                          topOffset = hour * 48;
                        }
                        return (
                          <div
                            key={event.id}
                            className="absolute left-0.5 right-0.5 p-1 rounded text-white text-[10px] overflow-hidden"
                            style={{
                              backgroundColor: event.color,
                              top: `${topOffset}px`,
                              height: "44px"
                            }}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="opacity-80">{event.time}</div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewType === "day" && (
            <div className="h-full flex">
              {/* Day schedule */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex">
                  {/* Time labels */}
                  <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-14 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 text-right pr-2 pt-1"
                      >
                        {hour === 0 ? "" : format(new Date().setHours(hour, 0), "h a")}
                      </div>
                    ))}
                  </div>
                  {/* Day content */}
                  <div className="flex-1 relative">
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-14 border-b border-gray-100 dark:border-gray-800"
                      />
                    ))}
                    {/* Current time indicator */}
                    {isToday(currentDate) && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-red-500 z-10"
                        style={{
                          top: `${(new Date().getHours() + new Date().getMinutes() / 60) * 56}px`
                        }}
                      >
                        <div className="w-3 h-3 bg-red-500 rounded-full -mt-1.5 -ml-1.5" />
                      </div>
                    )}
                    {/* Events */}
                    {getEventsForDate(currentDate).map((event) => {
                      const timeMatch = event.time?.match(/(\d+):?(\d*)\s*(AM|PM)?/i);
                      let topOffset = 9 * 56;
                      if (timeMatch) {
                        let hour = parseInt(timeMatch[1]);
                        const minutes = parseInt(timeMatch[2] || "0");
                        const ampm = timeMatch[3]?.toUpperCase();
                        if (ampm === "PM" && hour !== 12) hour += 12;
                        if (ampm === "AM" && hour === 12) hour = 0;
                        topOffset = (hour + minutes / 60) * 56;
                      }
                      return (
                        <div
                          key={event.id}
                          className="absolute left-2 right-2 p-2 rounded-lg text-white shadow-md"
                          style={{
                            backgroundColor: event.color,
                            top: `${topOffset}px`,
                            height: "52px"
                          }}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm opacity-80">{event.time}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected date events panel */}
              <div className="w-72 border-l border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 p-4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-1">
                  {format(currentDate, "EEEE")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {format(currentDate, "MMMM d, yyyy")}
                </p>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No events scheduled
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getEventsForDate(currentDate).map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-1 h-full min-h-[3rem] rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color }}
                          />
                          <div>
                            <p className="font-medium">{event.title}</p>
                            {event.time && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {event.time}
                              </p>
                            )}
                            {event.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
