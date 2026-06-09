import React from "react";
import { useSelector } from "react-redux";
import Events from "../components/Events/Events";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events || { allEvents: [], isLoading: false });

  return (
    <>
      <Header activeHeading={4} />
      {isLoading ? <Loader /> : <Events />}
    </>
  );
};

export default EventsPage;
