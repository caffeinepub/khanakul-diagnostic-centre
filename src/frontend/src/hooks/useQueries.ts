import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAppointments(enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["allAppointments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppointments();
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useGetAllAppointmentsByPassword(
  password: string,
  enabled: boolean,
) {
  const { actor, isFetching } = useActor();
  return useQuery<AppointmentWithId[]>({
    queryKey: ["allAppointmentsByPassword", password],
    queryFn: async () => {
      if (!actor || !password) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (actor as any).getAllAppointmentsByAdminPassword(
        password,
      );
      if (result && "ok" in result) return result.ok as AppointmentWithId[];
      throw new Error(result?.err ?? "Invalid password");
    },
    enabled: !!actor && !isFetching && enabled && password.length > 0,
    retry: false,
  });
}

export function useDeleteAppointment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteAppointment(appointmentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allAppointments"] });
    },
  });
}
