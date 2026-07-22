// src/pages/api/bookings.ts
export const prerender = false;

import type { APIRoute } from "astro";
import { getCurrentUser } from "../../types/auth-server";
import { checkRateLimit, getClientIp } from "../../types/rate-limit";
import {
  isDateHoliday,
  getBookingSettings,
  countBookingsForCourseOnDate,
} from "../../types/loader";

const BASE_API_URL =
  import.meta.env.VITE_STRAPI_BASE_URL ?? "http://localhost:1337";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^98\d{8}$/;

const LICENSE_STATUSES = ["Beginner", "Learner Permit", "Renewal"];
const VEHICLE_PREFERENCES = ["Manual", "Automatic"];

export const POST: APIRoute = async ({ request, cookies }) => {
  const user = await getCurrentUser(cookies);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "You must be logged in to book a course." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const ip = getClientIp(request);
  // Logged-in users only reach this point, so this mainly guards against
  // a compromised/scripted account spamming bookings.
  const rateLimit = checkRateLimit(`bookings:${ip}`, 50, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({ error: "Too many booking attempts. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      }
    );
  }

  const {
    courseDocumentId,
    courseSlug,
    courseTitle,
    coursePrice,
    name,
    firstName,
    lastName,
    email,
    phone,
    notes,
    selectedDate,
    selectedTime,
    availableSlot,
    drivingLicenseStatus,
    preferredVehicle,
    pickupRequired,
    pickupAddress,
  } = await request.json();

  if (!courseDocumentId || !name || !email || !phone) {
    return new Response(
      JSON.stringify({ error: "Missing required booking details." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return new Response(
      JSON.stringify({ error: "Please enter a valid email address." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!PHONE_PATTERN.test(phone)) {
    return new Response(
      JSON.stringify({
        error: "Phone number must be 10 digits and start with 98 (e.g. 9800000000).",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (notes && (typeof notes !== "string" || notes.length > 1000)) {
    return new Response(
      JSON.stringify({ error: "Notes must be under 1000 characters." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // New fields are optional, but if present must be valid — keeps this
  // endpoint backward-compatible with any existing caller that only
  // sends the original fields.
  if (drivingLicenseStatus && !LICENSE_STATUSES.includes(drivingLicenseStatus)) {
    return new Response(
      JSON.stringify({ error: "Invalid driving license status." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (preferredVehicle && !VEHICLE_PREFERENCES.includes(preferredVehicle)) {
    return new Response(
      JSON.stringify({ error: "Invalid preferred vehicle type." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (pickupRequired && !pickupAddress) {
    return new Response(
      JSON.stringify({ error: "Pickup address is required when pickup is requested." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // --- Business rule checks (Phase 3) -----------------------------------

  if (selectedDate) {
    // Block bookings on holidays, even if the frontend calendar somehow
    // let one through (stale cache, direct API call, etc.)
    const holidayCheck = await isDateHoliday(selectedDate);
    if (holidayCheck) {
      return new Response(
        JSON.stringify({ error: "Bookings are not available on this date (holiday)." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Enforce minimum notice / advance booking window from Booking Settings.
    const settings = await getBookingSettings();
    if (settings) {
      const now = new Date();
      const bookingDateTime = new Date(`${selectedDate}T${selectedTime || "00:00"}`);
      const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (typeof settings.minimumNoticeHours === "number" && hoursUntilBooking < settings.minimumNoticeHours) {
        return new Response(
          JSON.stringify({
            error: `Bookings require at least ${settings.minimumNoticeHours} hours' notice.`,
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      if (typeof settings.advanceBookingLimitDays === "number") {
        const daysUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysUntilBooking > settings.advanceBookingLimitDays) {
          return new Response(
            JSON.stringify({
              error: `Bookings can only be made up to ${settings.advanceBookingLimitDays} days in advance.`,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      if (typeof settings.maximumBookingsPerDay === "number") {
        const existingCount = await countBookingsForCourseOnDate(courseDocumentId, selectedDate);
        if (existingCount >= settings.maximumBookingsPerDay) {
          return new Response(
            JSON.stringify({ error: "This course is fully booked for that day. Please choose another date." }),
            { status: 409, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }
  }

  // --- Prevent duplicate booking: same person, same course, same date --
  {
    const dupQuery = new URLSearchParams({
      "filters[course][documentId][$eq]": courseDocumentId,
      "filters[email][$eq]": email,
      "filters[selectedDate][$eq]": selectedDate || "",
      "filters[bookingStatus][$ne]": "Cancelled",
      "pagination[pageSize]": "1",
    });
    const dupRes = await fetch(`${BASE_API_URL}/api/bookings?${dupQuery.toString()}`);
    if (dupRes.ok) {
      const dupData = await dupRes.json();
      if ((dupData?.meta?.pagination?.total ?? 0) > 0) {
        return new Response(
          JSON.stringify({ error: "You already have a booking for this course on this date." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  // If a specific slot was selected, re-check its availability server-side
  // right before booking — prevents a race where two people book the
  // last open seat at nearly the same time.
  if (availableSlot) {
    const slotCheckRes = await fetch(`${BASE_API_URL}/api/available-slots/${availableSlot}`);
    if (slotCheckRes.ok) {
      const slotData = await slotCheckRes.json();
      const slot = slotData?.data;
      if (slot && (slot.slotStatus === "Full" || slot.slotStatus === "Blocked" || slot.slotStatus === "Holiday")) {
        return new Response(
          JSON.stringify({ error: "That time slot is no longer available. Please choose another." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      if (slot && typeof slot.remainingSeats === "number" && slot.remainingSeats <= 0) {
        return new Response(
          JSON.stringify({ error: "That time slot just filled up. Please choose another." }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
    }
  }

  const strapiRes = await fetch(`${BASE_API_URL}/api/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: {
        course: courseDocumentId,
        name,
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone,
        notes: notes || null,
        bookingStatus: "Pending",
        selectedDate: selectedDate || null,
        selectedTime: selectedTime || null,
        availableSlot: availableSlot || null,
        drivingLicenseStatus: drivingLicenseStatus || null,
        preferredVehicle: preferredVehicle || null,
        pickupRequired: !!pickupRequired,
        pickupAddress: pickupAddress || null,
      },
    }),
  });

  const data = await strapiRes.json();

  if (!strapiRes.ok) {
    return new Response(
      JSON.stringify({
        error: data?.error?.message || "Could not create your booking.",
      }),
      { status: strapiRes.status, headers: { "Content-Type": "application/json" } }
    );
  }

  // Decrement the slot's remaining seats now that the booking succeeded.
  if (availableSlot) {
    try {
      const slotRes = await fetch(`${BASE_API_URL}/api/available-slots/${availableSlot}`);
      if (slotRes.ok) {
        const slotJson = await slotRes.json();
        const currentSeats = slotJson?.data?.remainingSeats;
        if (typeof currentSeats === "number" && currentSeats > 0) {
          const newSeats = currentSeats - 1;
          await fetch(`${BASE_API_URL}/api/available-slots/${availableSlot}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              data: {
                remainingSeats: newSeats,
                slotStatus: newSeats <= 0 ? "Full" : "Available",
              },
            }),
          });
        }
      }
    } catch {
      // Non-fatal: booking already succeeded; seat count can be
      // reconciled manually if this secondary update fails.
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      booking: {
        id: data.data.id,
        name,
        email,
        phone,
        courseTitle,
        courseSlug,
        coursePrice,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};