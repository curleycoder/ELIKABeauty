import React from "react";
import { useAuth } from "../context/AuthContext";
import BookingForm from "../components/BookingForm"; // your form component
import Login from "../components/Login"; // already created
import Signup from "../components/Signup"; // already created

export default function Booking() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {currentUser ? (
        <BookingForm />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Login />
          <Signup />
        </div>
      )}
    </div>
  );
}
