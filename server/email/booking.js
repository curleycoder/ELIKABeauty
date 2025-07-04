// server/email/BookingConfirmation.jsx
import { Html, Head, Preview, Body, Container, Text, Heading } from "@react-email/components";

export default function BookingConfirmation({ name, date, time, services, total }) {
  return (
    <Html>
      <Head />
      <Preview>Your Booking Confirmation – Beauty Shohre Studio</Preview>
      <Body style={{ backgroundColor: "#fff", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ padding: "24px" }}>
          <Heading as="h2">Hi {name},</Heading>
          <Text>Thank you for booking with <strong>Beauty Shohre Studio</strong>! Here’s your appointment summary:</Text>
          <Text>
            📅 <strong>Date:</strong> {date}<br />
            ⏰ <strong>Time:</strong> {time}<br />
            💅 <strong>Services:</strong> {services.join(", ")}<br />
            💲 <strong>Total:</strong> ${total}
          </Text>
          <Text>We’re excited to see you soon! 💜</Text>
          <Text style={{ fontSize: "12px", color: "#999" }}>Beauty Shohre Studio • (778) 513-9006</Text>
        </Container>
      </Body>
    </Html>
  );
}
