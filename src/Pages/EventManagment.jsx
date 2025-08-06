import {
  useEffect,
  useState,
  useCallback
} from 'react';
import {
  Calendar,
  dateFnsLocalizer
} from 'react-big-calendar';
import {
  Select,
  Option,
  Card,
  Typography,
  Avatar
} from "@material-tailwind/react";
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  FixedSizeList as List
} from 'react-window';
import moment from 'moment';
import axios from 'axios';
import { ClockIcon } from '@heroicons/react/24/solid';
import { FaFilter } from "react-icons/fa";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SidebarLayout from '../Component/SidebarLayout'; 

const locales = {
  'en-US': ('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const PAGE_SIZE = 10;

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date(2025, 6, 1));

  const transformEventData = useCallback((apiData) => {
    return apiData.map(event => {
      const eventDate = new Date(`${event.date}T${event.time}:00`);
      return {
        title: event.meeting_title,
        start: eventDate,
        end: new Date(eventDate.getTime() + 60 * 60 * 1000),
        status: event.status,
        department: event.department,
        time: event.time,
        participant: event.name,
        image: event.image
      };
    });
  }, []);

  const filteredEvents = filter === 'All'
    ? events
    : events.filter(e => e.status === filter);

  const loadMoreEvents = useCallback(() => {
    if (!hasMore) return;

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const nextEvents = filteredEvents.slice(start, end);

    setDisplayedEvents(prev => [...prev, ...nextEvents]);
    setPage(prev => prev + 1);
    setHasMore(end < filteredEvents.length);
  }, [filteredEvents, page, hasMore]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('https://mocki.io/v1/fd64ca2b-38e4-49f7-a4d3-d6d125d377a1');
        if (res.data.error_code === 200) {
          const data = res.data.data;
          setEvents(data);
          setDisplayedEvents(data.slice(0, PAGE_SIZE));
          setHasMore(data.length > PAGE_SIZE);
        }
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    setDisplayedEvents(filteredEvents.slice(0, PAGE_SIZE));
    setPage(1);
    setHasMore(filteredEvents.length > PAGE_SIZE);
  }, [filter, filteredEvents]);

  const eventStyleGetter = (event) => {
    const colors = {
      Completed: '#4CAF50',
      Scheduled: '#2196F3',
      Pending: '#FF9800',
      Cancelled: '#FF0000'
    };

    return {
      style: {
        backgroundColor: colors[event.status] || '#9E9E9E',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  const EventRow = ({ index, style }) => {
    const event = displayedEvents[index];
    return (
      <div style={style}>
        <Card className="p-4 mb-4 mx-2 shadow hover:shadow-md transition-shadow">
          <div className="flex gap-4 items-start">
            <div className="w-14 p-2 rounded-sm bg-[#d6c6e1] text-[#672d91] text-center">
              <Typography variant="h6">
                {moment(event.start).format("MMM Do")}
              </Typography>
            </div>
            <div className="flex-1">
              <Typography variant="h6" className="font-semibold">
                {event.meeting_title}
              </Typography>
              <div className="flex items-center gap-1 mt-1">
                <ClockIcon className="h-4 w-4 text-gray-600" />
                <Typography variant="small">{event.time}</Typography>
              </div>
              <div className="flex gap-2 items-center mt-3">
                <Avatar src={event.image} alt={event.name} size="sm" />
                <div>
                  <Typography variant="small">{event.name}</Typography>
                  <Typography variant="small" className="text-gray-600">{event.department}</Typography>
                </div>
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  event.status === "Completed"
                    ? "bg-[#d6c6e1] text-[#672d91]"
                    : event.status === "Pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : event.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-800"
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          </div>
        </Card>
        {index === displayedEvents.length - 1 && hasMore && (
          <div className="flex justify-center p-4">
            <button onClick={loadMoreEvents} className="bg-blue-500 text-white px-4 py-2 rounded">
              Load More
            </button>
          </div>
        )}
      </div>
    );
  };

  if (isLoading || error) {
    return (
      <SidebarLayout>
        <div className="p-8">
          <Typography variant="h5" color={error ? "red" : "gray"}>
            {error || "Loading events..."}
          </Typography>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Typography variant="h4" className="mb-6 text-[#672d91]">
          My Calendar
        </Typography>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <Select
                  label="Filter"
                  value={filter}
                  onChange={(val) => setFilter(val)}
                  icon={<FaFilter className="h-5 w-5" />}
                >
                  <Option value="All">All</Option>
                  <Option value="Scheduled">Scheduled</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </div>
              <Card className="p-4" style={{ height: '500px' }}>
                <Typography variant="h6" className="mb-2">Upcoming Events</Typography>
                {filteredEvents.length > 0 ? (
                  <AutoSizer>
                    {({ height, width }) => (
                      <List
                        height={height}
                        itemCount={displayedEvents.length}
                        itemSize={180}
                        width={width}
                        onItemsRendered={({ visibleStopIndex }) => {
                          if (visibleStopIndex === displayedEvents.length - 1 && hasMore) {
                            loadMoreEvents();
                          }
                        }}
                      >
                        {EventRow}
                      </List>
                    )}
                  </AutoSizer>
                ) : (
                  <Typography variant="small" className="text-gray-600">
                    No events found for this filter.
                  </Typography>
                )}
              </Card>
            </div>
          </div>
          <div className="lg:col-span-8">
            <Card className="p-4 h-full">
              <Calendar
                localizer={localizer}
                events={transformEventData(filteredEvents)}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '500px' }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                eventPropGetter={eventStyleGetter}
              />
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default EventManagement;
