// server/email/BookingConfirmation.jsx
import { Html, Head, Preview, Body, Container, Text, Heading } from "@react-email/components";

export default function BookingConfirmation({ name, date, time, services, total }) {
  return (
    <Html>
      <Head />
      <Preview>Your Booking Confirmation – ELIKA Beauty</Preview>
      <Body style={{ backgroundColor: "#fff", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "24px" }}>
          <Heading as="h2">Hi {name},</Heading>
          <Text>Thank you for booking with <strong>ELIKA Beauty</strong>! Here’s your appointment summary:</Text>
          <Text>
            📅 <strong>Date:</strong> {date}<br />
            ⏰ <strong>Time:</strong> {time}<br />
            💅 <strong>Services:</strong> {services.join(", ")}<br />
            💲 <strong>Total:</strong> ${total}
          </Text>
          <Text>We’re excited to see you soon! 💜</Text>
          <Text style={{ fontSize: "12px", color: "#999" }}>ELIKA Beauty • (604) 438-3727</Text>
        </Container>
      </Body>
    </Html>
  );
}
