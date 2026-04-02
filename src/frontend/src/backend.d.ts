import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ServiceId = bigint;
export type DoctorId = bigint;
export type PackageId = bigint;
export interface Service {
    icon: string;
    name: string;
    description: string;
}
export interface Doctor {
    name: string;
    specialty: string;
    availabilityDays: Array<string>;
    qualification: string;
}
export type AppointmentId = bigint;
export interface HealthPackage {
    name: string;
    includedTests: Array<string>;
    price: bigint;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface Appointment {
    serviceType: string;
    email: string;
    message: string;
    preferredDate: string;
    bookingTime: bigint;
    patientName: string;
    phone: string;
}
export interface AppointmentWithId {
    id: bigint;
    appointment: Appointment;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDoctor(doctor: Doctor): Promise<DoctorId>;
    addHealthPackage(healthPackage: HealthPackage): Promise<PackageId>;
    addService(service: Service): Promise<ServiceId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookAppointment(appointment: Appointment): Promise<AppointmentId>;
    deleteAppointment(appointmentId: AppointmentId): Promise<void>;
    deleteDoctor(doctorId: DoctorId): Promise<void>;
    deleteHealthPackage(packageId: PackageId): Promise<void>;
    deleteService(serviceId: ServiceId): Promise<void>;
    getAllAppointments(): Promise<Array<Appointment>>;
    getAllDoctors(): Promise<Array<Doctor>>;
    getAllHealthPackages(): Promise<Array<HealthPackage>>;
    getAllServices(): Promise<Array<Service>>;
    getAppointmentsByPhone(phone: string): Promise<Array<AppointmentWithId>>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo>;
    isCallerAdmin(): Promise<boolean>;
    updateContactInfo(contactInfo1: ContactInfo): Promise<void>;
    updateDoctor(doctorId: DoctorId, doctor: Doctor): Promise<void>;
    updateHealthPackage(packageId: PackageId, healthPackage: HealthPackage): Promise<void>;
    updateService(serviceId: ServiceId, service: Service): Promise<void>;
}
