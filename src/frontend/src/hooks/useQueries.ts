import { useMutation, useQuery } from "@tanstack/react-query";
import type { Appointment } from "../backend.d";
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
