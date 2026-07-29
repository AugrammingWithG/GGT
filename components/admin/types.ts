export type EnquiryStatus = "new" | "confirmed" | "handled";

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  tourName: string;
  guests: number;
  preferredDate: string;
  /** Compass region for private-tour enquiries; blank for other enquiry sources. */
  region: string;
  addOns: { id: string; name: string; price: number }[];
  /** Third-party extras the guest pays direct — outside `total`. */
  payOnDayAddOns: { id: string; name: string; price: number }[];
  total: number;
  tourDate: string | null;
  status: EnquiryStatus;
  createdAt: string | null;
};
