import React, { useState } from "react";
import emailjs from "emailjs-com";

const servicesList = [
  { name: "Balayage", price: 180 },
  { name: "Eyebrows Threading", price: 25 },
  { name: "Hair Styling", price: 60 },
  { name: "Hair Cut", price: 45 },
  { name: "Makeup", price: 120 },
  { name: "Microblading", price: 300 },
  { name: "Perms", price: 140 },
  { name: "Highlight", price: 150 },
  { name: "Hair Color", price: 130 },
  { name: "Keratin", price: 250 },
];

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    services: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (service) => {
    const newServices = formData.services.includes(service)
      ? formData.services.filter((s) => s !== service)
      : [...formData.services, service];
    setFormData({ ...formData, services: newServices });
  };

  const calculateTotal = () => {
    return formData.services.reduce((sum, serviceName) => {
      const service = servicesList.find((s) => s.name === serviceName);
      return sum + (service ? service.price : 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const templateParams = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      services: formData.services.join(", "),
      total: `$${calculateTotal()}`,
    };

    emailjs
      .send(
        "service_jsib11b", 
        "template_ktll0pe",
        templateParams,
        "your_user_id" // replace with your EmailJS public key
      )
      .then(
        (response) => {
          alert("Booking request sent successfully!");
        },
        (error) => {
          alert("Failed to send booking request.");
          console.error(error);
        }
      );
  };

  return (
    <section className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bodonimoda text-center text-[#55203d] mb-6">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          required
          placeholder="Your Name"
          className="w-full border border-gray-300 p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          required
          placeholder="Your Email"
          className="w-full border border-gray-300 p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          required
          placeholder="Phone Number"
          className="w-full border border-gray-300 p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          required
          className="w-full border border-gray-300 p-2 rounded"
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          required
          className="w-full border border-gray-300 p-2 rounded"
          onChange={handleChange}
        />

        <div className="border border-gray-200 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2 text-[#55203d]">Select Services:</h3>
          {servicesList.map((service, index) => (
            <label key={index} className="block">
              <input
                type="checkbox"
                value={service.name}
                checked={formData.services.includes(service.name)}
                onChange={() => handleServiceChange(service.name)}
                className="mr-2"
              />
              {service.name} — ${service.price}
            </label>
          ))}
        </div>

        <div className="text-right text-lg font-bold text-[#55203d]">
          Total: ${calculateTotal()}
        </div>

        <button
          type="submit"
          className="w-full bg-[#eabec5] text-[#55203d] font-semibold py-2 rounded-full hover:bg-pink-600 hover:text-white transition"
        >
          Submit Booking
        </button>
      </form>
    </section>
  );
}