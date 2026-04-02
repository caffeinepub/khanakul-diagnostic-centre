import { useMutation, useQuery } from "@tanstack/react-query";
import type { Appointment, AppointmentWithId } from "../backend.d";
import { useActor } from "./useActor";

export function useGetServices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetDoctors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoctors();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetHealthPackages() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["healthPackages"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllHealthPackages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookAppointment() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (appointment: Appointment) => {
      if (!actor) throw new Error("Actor not available");
      return actor.bookAppointment(appointment);
    },
  });
}

export function useGetAppointmentsByPhone(phone: string) {
  const { actor, isFetching } = useActor();
  return useQuery<AppointmentWithId[]>({
    queryKey: ["appointmentsByPhone", phone],
    queryFn: async () => {
      if (!actor || !phone) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (actor as any).getAppointmentsByPhone(phone) as Promise<
        AppointmentWithId[]
      >;
    },
    enabled: !!actor && !isFetching && phone.length >= 10,
  });
}
