import React from 'react';
import { useSelector } from 'react-redux';
import EventCard from "./EventCard";
import { BsCalendarEvent } from 'react-icons/bs';

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events || []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-yellow-500/10 rounded-2xl">
                <BsCalendarEvent className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Featured Events
            </h2>
            <p className="text-gray-400 text-lg">
              Exclusive deals and limited-time offers
            </p>
          </div>
        </div>

        {/* Events Content */}
        <div className="w-full">
          {allEvents.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              <EventCard data={allEvents[0]} />
            </div>
          ) : (
            <div className="bg-gray-800 rounded-2xl p-12 text-center border border-gray-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gray-700/50 mb-6">
                <BsCalendarEvent className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                No Active Events
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Stay tuned! We're preparing some exciting deals and special offers for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;