# Khanakul Diagnostic Centre

## Current State
BookAppointmentSection has 3 tabs: Book Appointment, Test Prices, My Appointments. Backend has getAllAppointments (admin-only) and isCallerAdmin methods.

## Requested Changes (Diff)

### Add
- 4th tab "Admin View" in BookAppointmentSection
- useGetAllAppointments and useIsCallerAdmin hooks in useQueries.ts
- AdminAppointmentsTab: checks isCallerAdmin, shows all appointments with search/filter, delete button per entry

### Modify
- BookAppointmentSection.tsx: add 4th tab, change grid-cols-3 to grid-cols-4
- useQueries.ts: add new hooks

### Remove
- Nothing

## Implementation Plan
1. Add useGetAllAppointments, useIsCallerAdmin, useDeleteAppointment hooks to useQueries.ts
2. Create AdminAppointmentsTab in BookAppointmentSection.tsx
3. Add 4th tab trigger and content, update grid-cols-4
4. Validate
