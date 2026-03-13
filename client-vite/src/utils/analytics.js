export function trackBookingConfirmed() {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "book_appointment", {
      event_category: "booking",
      event_label: "booking_confirmed",
      value: 1,
      currency: "CAD"
    });
  }
}