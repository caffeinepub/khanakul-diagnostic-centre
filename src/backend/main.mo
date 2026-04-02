import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Access control state and inclusion
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Shared Types
  type DoctorId = Nat;
  type ServiceId = Nat;
  type PackageId = Nat;
  type AppointmentId = Nat;

  // Appointment related types and data
  public type Appointment = {
    patientName : Text;
    phone : Text;
    email : Text;
    serviceType : Text;
    preferredDate : Text;
    message : Text;
    bookingTime : Int;
  };

  var nextAppointmentId = 1;
  let appointments = Map.empty<AppointmentId, Appointment>();

  // Stable doctors list
  public type Doctor = {
    name : Text;
    specialty : Text;
    qualification : Text;
    availabilityDays : [Text];
  };

  let doctors = Map.empty<DoctorId, Doctor>();

  // Stable service list
  public type Service = {
    name : Text;
    description : Text;
    icon : Text;
  };

  let services = Map.empty<ServiceId, Service>();

  // Stable health package list
  public type HealthPackage = {
    name : Text;
    price : Nat;
    includedTests : [Text];
  };

  let healthPackages = Map.empty<PackageId, HealthPackage>();

  // Stable contact info
  public type ContactInfo = {
    address : Text;
    phone : Text;
    email : Text;
  };
  var contactInfo : ContactInfo = {
    address = "Default Address";
    phone = "0000000000";
    email = "default@email.com";
  };

  // Admin only: Add doctor
  public shared ({ caller }) func addDoctor(doctor : Doctor) : async DoctorId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add doctors");
    };
    let id = doctors.size();
    doctors.add(id, doctor);
    id;
  };

  // Get all doctors - public access
  public query func getAllDoctors() : async [Doctor] {
    doctors.values().toArray();
  };

  // Admin only: Add service
  public shared ({ caller }) func addService(service : Service) : async ServiceId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };
    let id = services.size();
    services.add(id, service);
    id;
  };

  // Get all services - public access
  public query func getAllServices() : async [Service] {
    services.values().toArray();
  };

  // Admin only: Add health package
  public shared ({ caller }) func addHealthPackage(healthPackage : HealthPackage) : async PackageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add health packages");
    };
    let id = healthPackages.size();
    healthPackages.add(id, healthPackage);
    id;
  };

  // Get all health packages - public access
  public query func getAllHealthPackages() : async [HealthPackage] {
    healthPackages.values().toArray();
  };

  // Public: Book appointment
  public shared func bookAppointment(appointment : Appointment) : async AppointmentId {
    let id = nextAppointmentId;
    let appointmentWithId : Appointment = {
      appointment with bookingTime = Time.now();
    };
    appointments.add(id, appointmentWithId);
    nextAppointmentId += 1;
    id;
  };

  // Public: Get appointments by phone number
  public type AppointmentWithId = {
    id : AppointmentId;
    appointment : Appointment;
  };

  public query func getAppointmentsByPhone(phone : Text) : async [AppointmentWithId] {
    appointments.entries()
      .filter(func((_, a) : (AppointmentId, Appointment)) : Bool { a.phone == phone })
      .map(func((id, a) : (AppointmentId, Appointment)) : AppointmentWithId { { id = id; appointment = a } })
      .toArray();
  };

  // Admin only: Get all appointments
  public query ({ caller }) func getAllAppointments() : async [Appointment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view appointments");
    };
    appointments.values().toArray();
  };

  // Admin only: Update contact info
  public shared ({ caller }) func updateContactInfo(contactInfo1 : ContactInfo) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Only admins can update contact info!");
    };
    contactInfo := contactInfo1;
  };

  // Get contact info - public access
  public query func getContactInfo() : async ContactInfo {
    contactInfo;
  };

  // Admin only: Delete appointment
  public shared ({ caller }) func deleteAppointment(appointmentId : AppointmentId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete appointments");
    };
    if (not appointments.containsKey(appointmentId)) {
      Runtime.trap("Appointment not found");
    };
    appointments.remove(appointmentId);
  };

  // Admin only: Delete doctor
  public shared ({ caller }) func deleteDoctor(doctorId : DoctorId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete doctors");
    };
    if (not doctors.containsKey(doctorId)) {
      Runtime.trap("Doctor not found");
    };
    doctors.remove(doctorId);
  };

  // Admin only: Delete service
  public shared ({ caller }) func deleteService(serviceId : ServiceId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    if (not services.containsKey(serviceId)) {
      Runtime.trap("Service not found");
    };
    services.remove(serviceId);
  };

  // Admin only: Delete health package
  public shared ({ caller }) func deleteHealthPackage(packageId : PackageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete health packages");
    };
    if (not healthPackages.containsKey(packageId)) {
      Runtime.trap("Health package not found");
    };
    healthPackages.remove(packageId);
  };

  // Admin only: Update doctor
  public shared ({ caller }) func updateDoctor(doctorId : DoctorId, doctor : Doctor) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update doctors");
    };
    if (not doctors.containsKey(doctorId)) {
      Runtime.trap("Doctor not found");
    };
    doctors.add(doctorId, doctor);
  };

  // Admin only: Update service
  public shared ({ caller }) func updateService(serviceId : ServiceId, service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    if (not services.containsKey(serviceId)) {
      Runtime.trap("Service not found");
    };
    services.add(serviceId, service);
  };

  // Admin only: Update health package
  public shared ({ caller }) func updateHealthPackage(packageId : PackageId, healthPackage : HealthPackage) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update health packages");
    };
    if (not healthPackages.containsKey(packageId)) {
      Runtime.trap("Health package not found");
    };
    healthPackages.add(packageId, healthPackage);
  };
};
