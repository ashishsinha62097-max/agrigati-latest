import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactSubmission {
    id: bigint;
    orgType: OrganizationType;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export enum OrganizationType {
    FPO = "FPO",
    other = "other",
    buyer = "buyer",
    farmer = "farmer",
    investor = "investor"
}
export interface backendInterface {
    deleteSubmission(id: bigint): Promise<void>;
    getAllSubmissions(): Promise<Array<ContactSubmission>>;
    getSubmission(id: bigint): Promise<ContactSubmission>;
    getVisitCount(): Promise<bigint>;
    incrementVisitCount(): Promise<void>;
    submitContact(name: string, orgType: OrganizationType, email: string, phone: string, message: string): Promise<void>;
}
