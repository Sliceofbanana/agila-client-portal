// src/app/(dashboard)/dashboard/components/CompleteDetailsForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Building2, User, Briefcase, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'client_details_draft';
const COMPLETED_KEY = 'client_details_completed';

const STEPS = [
  { id: 1, label: 'Core Info',  icon: Building2 },
  { id: 2, label: 'Owner Info', icon: User },
  { id: 3, label: 'Operations', icon: Briefcase },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionInfo {
  clientId: string | number | null;
  companyCode: string | null;
  clientNo: string | null;
  businessEntity: string | null;
  branchType: string | null;
}

interface FormData {
  // Step 1 — Core
  portalName: string;
  // Step 2 — Individual
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  civilStatus: string;
  gender: string;
  citizenship: string;
  placeOfBirth: string;
  residentialAddress: string;
  prcLicenseNo: string;
  primaryIdType: string;
  primaryIdNumber: string;
  personalEmail: string;
  mobileNumber: string;
  telephoneNumber: string;
  // Step 2 — Family
  motherFirstName: string;
  motherMiddleName: string;
  motherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  spouseFirstName: string;
  spouseMiddleName: string;
  spouseLastName: string;
  spouseEmploymentStatus: string;
  spouseTin: string;
  spouseEmployerName: string;
  spouseEmployerTin: string;
  // Step 3 — Business
  tradeName: string;
  industry: string;
  lineOfBusiness: string;
  psicCode: string;
  landlineNumber: string;
  faxNumber: string;
  placeType: '' | 'OWNED' | 'RENTED' | 'FREE_USE';
  lessorName: string;
  lessorAddress: string;
  monthlyRent: string;
  propertyOwner: string;
  ownedReason: string;
  noRentReason: string;
}

const INITIAL_FORM: FormData = {
  portalName: '',
  firstName: '', middleName: '', lastName: '',
  dob: '', civilStatus: '', gender: '', citizenship: '', placeOfBirth: '',
  residentialAddress: '', prcLicenseNo: '', primaryIdType: '', primaryIdNumber: '',
  personalEmail: '', mobileNumber: '', telephoneNumber: '',
  motherFirstName: '', motherMiddleName: '', motherLastName: '',
  fatherFirstName: '', fatherMiddleName: '', fatherLastName: '',
  spouseFirstName: '', spouseMiddleName: '', spouseLastName: '',
  spouseEmploymentStatus: '', spouseTin: '', spouseEmployerName: '', spouseEmployerTin: '',
  tradeName: '', industry: '', lineOfBusiness: '', psicCode: '',
  landlineNumber: '', faxNumber: '',
  placeType: '', lessorName: '', lessorAddress: '', monthlyRent: '',
  propertyOwner: '', ownedReason: '', noRentReason: '',
};

interface ClientInfoResponse {
  data?: {
    portalName?: string | null;
    individualDetails?: {
      firstName?: string | null; middleName?: string | null; lastName?: string | null;
      dob?: string | null; civilStatus?: string | null; gender?: string | null;
      citizenship?: string | null; placeOfBirth?: string | null; residentialAddress?: string | null;
      prcLicenseNo?: string | null; primaryIdType?: string | null; primaryIdNumber?: string | null;
      personalEmail?: string | null; mobileNumber?: string | null; telephoneNumber?: string | null;
      motherFirstName?: string | null; motherMiddleName?: string | null; motherLastName?: string | null;
      fatherFirstName?: string | null; fatherMiddleName?: string | null; fatherLastName?: string | null;
      spouseFirstName?: string | null; spouseMiddleName?: string | null; spouseLastName?: string | null;
      spouseEmploymentStatus?: string | null; spouseTin?: string | null;
      spouseEmployerName?: string | null; spouseEmployerTin?: string | null;
    } | null;
    businessDetails?: {
      tradeName?: string | null; industry?: string | null; lineOfBusiness?: string | null;
      psicCode?: string | null; landlineNumber?: string | null; faxNumber?: string | null;
      placeType?: string | null; lessorName?: string | null; lessorAddress?: string | null;
      monthlyRent?: number | null; propertyOwner?: string | null;
      ownedReason?: string | null; noRentReason?: string | null;
    } | null;
  };
}

function mapResponseToForm(res: ClientInfoResponse): FormData {
  const d = res.data;
  if (!d) return { ...INITIAL_FORM };
  const ind = d.individualDetails;
  const biz = d.businessDetails;
  return {
    portalName: d.portalName ?? '',
    firstName: ind?.firstName ?? '', middleName: ind?.middleName ?? '', lastName: ind?.lastName ?? '',
    dob: ind?.dob ? ind.dob.substring(0, 10) : '',
    civilStatus: ind?.civilStatus ?? '', gender: ind?.gender ?? '',
    citizenship: ind?.citizenship ?? '', placeOfBirth: ind?.placeOfBirth ?? '',
    residentialAddress: ind?.residentialAddress ?? '', prcLicenseNo: ind?.prcLicenseNo ?? '',
    primaryIdType: ind?.primaryIdType ?? '', primaryIdNumber: ind?.primaryIdNumber ?? '',
    personalEmail: ind?.personalEmail ?? '', mobileNumber: ind?.mobileNumber ?? '',
    telephoneNumber: ind?.telephoneNumber ?? '',
    motherFirstName: ind?.motherFirstName ?? '', motherMiddleName: ind?.motherMiddleName ?? '',
    motherLastName: ind?.motherLastName ?? '',
    fatherFirstName: ind?.fatherFirstName ?? '', fatherMiddleName: ind?.fatherMiddleName ?? '',
    fatherLastName: ind?.fatherLastName ?? '',
    spouseFirstName: ind?.spouseFirstName ?? '', spouseMiddleName: ind?.spouseMiddleName ?? '',
    spouseLastName: ind?.spouseLastName ?? '', spouseEmploymentStatus: ind?.spouseEmploymentStatus ?? '',
    spouseTin: ind?.spouseTin ?? '', spouseEmployerName: ind?.spouseEmployerName ?? '',
    spouseEmployerTin: ind?.spouseEmployerTin ?? '',
    tradeName: biz?.tradeName ?? '', industry: biz?.industry ?? '',
    lineOfBusiness: biz?.lineOfBusiness ?? '', psicCode: biz?.psicCode ?? '',
    landlineNumber: biz?.landlineNumber ?? '', faxNumber: biz?.faxNumber ?? '',
    placeType: (biz?.placeType as FormData['placeType']) ?? '',
    lessorName: biz?.lessorName ?? '', lessorAddress: biz?.lessorAddress ?? '',
    monthlyRent: biz?.monthlyRent != null ? String(biz.monthlyRent) : '',
    propertyOwner: biz?.propertyOwner ?? '', ownedReason: biz?.ownedReason ?? '',
    noRentReason: biz?.noRentReason ?? '',
  };
}

// ─── Shared field styles ──────────────────────────────────────────────────────

const inputCls = [
  'w-full rounded-lg border border-border bg-background px-3 py-2',
  'text-sm text-foreground placeholder:text-muted-foreground',
  'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition',
].join(' ');

const selectCls = `${inputCls} appearance-none cursor-pointer`;

const readonlyCls = [
  'w-full rounded-lg border border-border bg-muted px-3 py-2',
  'text-sm text-muted-foreground font-mono tracking-wider select-all',
].join(' ');

// ─── Field wrapper ────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}

function Field({ label, children, required }: FieldProps): React.ReactElement {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}{required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Step props ───────────────────────────────────────────────────────────────

interface StepProps {
  data: FormData;
  set: (field: keyof FormData, value: string) => void;
  session: SessionInfo;
}

// ─── Step 1: Core Information ─────────────────────────────────────────────────

function Step1({ data, set, session }: StepProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Core Information</p>

      <Field label="Portal Display Name" required>
        <input
          type="text"
          value={data.portalName}
          onChange={e => set('portalName', e.target.value)}
          placeholder="Name shown throughout this portal"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Company Code">
          <div className={readonlyCls}>{session.companyCode ?? '—'}</div>
        </Field>
        <Field label="Client Number">
          <div className={readonlyCls}>{session.clientNo ?? '—'}</div>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Business Entity">
          <div className={readonlyCls}>{session.businessEntity ?? '—'}</div>
        </Field>
        <Field label="Branch Type">
          <div className={readonlyCls}>{session.branchType ?? '—'}</div>
        </Field>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-700">
        Company Code, Client Number, Business Entity, and Branch Type are managed by Agila and cannot be edited here. Contact your Account Officer for corrections.
      </div>
    </div>
  );
}

// ─── Step 2: Owner / Individual Information ───────────────────────────────────

function Step2({ data, set }: StepProps): React.ReactElement {
  return (
    <div className="space-y-6">

      {/* Personal Info */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Owner / Individual Information</p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="First Name" required>
            <input type="text" value={data.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First" className={inputCls} />
          </Field>
          <Field label="Middle Name">
            <input type="text" value={data.middleName} onChange={e => set('middleName', e.target.value)} placeholder="Middle" className={inputCls} />
          </Field>
          <Field label="Last Name" required>
            <input type="text" value={data.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth" required>
            <input type="date" value={data.dob} onChange={e => set('dob', e.target.value)} className={inputCls} />
          </Field>
          <Field label="Civil Status">
            <select value={data.civilStatus} onChange={e => set('civilStatus', e.target.value)} className={selectCls}>
              <option value="">Select status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Legally Separated">Legally Separated</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Gender">
            <select value={data.gender} onChange={e => set('gender', e.target.value)} className={selectCls}>
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Citizenship">
            <input type="text" value={data.citizenship} onChange={e => set('citizenship', e.target.value)} placeholder="e.g. Filipino" className={inputCls} />
          </Field>
        </div>

        <Field label="Place of Birth">
          <input type="text" value={data.placeOfBirth} onChange={e => set('placeOfBirth', e.target.value)} placeholder="City / Municipality, Province" className={inputCls} />
        </Field>

        <Field label="Residential Address">
          <input type="text" value={data.residentialAddress} onChange={e => set('residentialAddress', e.target.value)} placeholder="Full residential address" className={inputCls} />
        </Field>

        <Field label="PRC License No.">
          <input type="text" value={data.prcLicenseNo} onChange={e => set('prcLicenseNo', e.target.value)} placeholder="If applicable" className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary ID Type">
            <select value={data.primaryIdType} onChange={e => set('primaryIdType', e.target.value)} className={selectCls}>
              <option value="">Select ID type</option>
              <option value="Passport">Passport</option>
              <option value="Driver's License">Driver&apos;s License</option>
              <option value="SSS ID">SSS ID</option>
              <option value="GSIS ID">GSIS ID</option>
              <option value="UMID">UMID</option>
              <option value="PhilSys ID">PhilSys ID</option>
              <option value="Voter's ID">Voter&apos;s ID</option>
              <option value="PRC ID">PRC ID</option>
            </select>
          </Field>
          <Field label="Primary ID Number">
            <input type="text" value={data.primaryIdNumber} onChange={e => set('primaryIdNumber', e.target.value)} placeholder="ID number" className={inputCls} />
          </Field>
        </div>

        <Field label="Personal Email" required>
          <input type="email" value={data.personalEmail} onChange={e => set('personalEmail', e.target.value)} placeholder="personal@email.com" className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobile Number" required>
            <input type="tel" value={data.mobileNumber} onChange={e => set('mobileNumber', e.target.value)} placeholder="+63 9XX XXX XXXX" className={inputCls} />
          </Field>
          <Field label="Telephone Number">
            <input type="tel" value={data.telephoneNumber} onChange={e => set('telephoneNumber', e.target.value)} placeholder="(032) XXX XXXX" className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Family Background */}
      <div className="space-y-4 border-t border-border pt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Family Background</p>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Mother's First Name">
            <input type="text" value={data.motherFirstName} onChange={e => set('motherFirstName', e.target.value)} placeholder="First" className={inputCls} />
          </Field>
          <Field label="Mother's Middle Name">
            <input type="text" value={data.motherMiddleName} onChange={e => set('motherMiddleName', e.target.value)} placeholder="Middle" className={inputCls} />
          </Field>
          <Field label="Mother's Last Name">
            <input type="text" value={data.motherLastName} onChange={e => set('motherLastName', e.target.value)} placeholder="Maiden last name" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Father's First Name">
            <input type="text" value={data.fatherFirstName} onChange={e => set('fatherFirstName', e.target.value)} placeholder="First" className={inputCls} />
          </Field>
          <Field label="Father's Middle Name">
            <input type="text" value={data.fatherMiddleName} onChange={e => set('fatherMiddleName', e.target.value)} placeholder="Middle" className={inputCls} />
          </Field>
          <Field label="Father's Last Name">
            <input type="text" value={data.fatherLastName} onChange={e => set('fatherLastName', e.target.value)} placeholder="Last name" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Field label="Spouse First Name">
            <input type="text" value={data.spouseFirstName} onChange={e => set('spouseFirstName', e.target.value)} placeholder="First" className={inputCls} />
          </Field>
          <Field label="Spouse Middle Name">
            <input type="text" value={data.spouseMiddleName} onChange={e => set('spouseMiddleName', e.target.value)} placeholder="Middle" className={inputCls} />
          </Field>
          <Field label="Spouse Last Name">
            <input type="text" value={data.spouseLastName} onChange={e => set('spouseLastName', e.target.value)} placeholder="Last name" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Spouse Employment Status">
            <input type="text" value={data.spouseEmploymentStatus} onChange={e => set('spouseEmploymentStatus', e.target.value)} placeholder="Employed / Self-employed / etc." className={inputCls} />
          </Field>
          <Field label="Spouse TIN">
            <input type="text" value={data.spouseTin} onChange={e => set('spouseTin', e.target.value)} placeholder="000-000-000-000" className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Spouse Employer Name">
            <input type="text" value={data.spouseEmployerName} onChange={e => set('spouseEmployerName', e.target.value)} placeholder="Employer or business name" className={inputCls} />
          </Field>
          <Field label="Spouse Employer TIN">
            <input type="text" value={data.spouseEmployerTin} onChange={e => set('spouseEmployerTin', e.target.value)} placeholder="000-000-000-000" className={inputCls} />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Business Operations ──────────────────────────────────────────────

function Step3({ data, set }: StepProps): React.ReactElement {
  return (
    <div className="space-y-6">

      {/* Business Operations */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Business Operations</p>

        <Field label="Trade Name">
          <input type="text" value={data.tradeName} onChange={e => set('tradeName', e.target.value)} placeholder="Registered trade name (if different from business name)" className={inputCls} />
        </Field>

        <Field label="Industry" required>
          <select value={data.industry} onChange={e => set('industry', e.target.value)} className={selectCls}>
            <option value="">Select industry</option>
            <option value="Agriculture, Forestry & Fishing">Agriculture, Forestry &amp; Fishing</option>
            <option value="Mining & Quarrying">Mining &amp; Quarrying</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Construction">Construction</option>
            <option value="Wholesale & Retail Trade">Wholesale &amp; Retail Trade</option>
            <option value="Transportation & Storage">Transportation &amp; Storage</option>
            <option value="Accommodation & Food Services">Accommodation &amp; Food Services</option>
            <option value="Information & Communication Technology">Information &amp; Communication Technology</option>
            <option value="Financial & Insurance Activities">Financial &amp; Insurance Activities</option>
            <option value="Real Estate Activities">Real Estate Activities</option>
            <option value="Professional, Scientific & Technical">Professional, Scientific &amp; Technical</option>
            <option value="Administrative & Support Services">Administrative &amp; Support Services</option>
            <option value="Education">Education</option>
            <option value="Human Health & Social Work">Human Health &amp; Social Work</option>
            <option value="Arts, Entertainment & Recreation">Arts, Entertainment &amp; Recreation</option>
            <option value="Other Service Activities">Other Service Activities</option>
          </select>
        </Field>

        <Field label="Line of Business" required>
          <input type="text" value={data.lineOfBusiness} onChange={e => set('lineOfBusiness', e.target.value)} placeholder="Describe your primary business activity" className={inputCls} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="PSIC Code">
            <input type="text" value={data.psicCode} onChange={e => set('psicCode', e.target.value)} placeholder="Philippine Standard Industrial Classification" className={inputCls} />
          </Field>
          <Field label="Landline Number">
            <input type="tel" value={data.landlineNumber} onChange={e => set('landlineNumber', e.target.value)} placeholder="(032) XXX XXXX" className={inputCls} />
          </Field>
        </div>

        <Field label="Fax Number">
          <input type="tel" value={data.faxNumber} onChange={e => set('faxNumber', e.target.value)} placeholder="(032) XXX XXXX" className={inputCls} />
        </Field>
      </div>

      {/* Place of Business */}
      <div className="space-y-4 border-t border-border pt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Place of Business</p>

        <Field label="Place Type" required>
          <select value={data.placeType} onChange={e => set('placeType', e.target.value)} className={selectCls}>
            <option value="">Select place type</option>
            <option value="RENTED">Rented</option>
            <option value="OWNED">Owned</option>
            <option value="FREE_USE">Free Use</option>
          </select>
        </Field>

        {data.placeType === 'RENTED' && (
          <>
            <Field label="Lessor Name" required>
              <input type="text" value={data.lessorName} onChange={e => set('lessorName', e.target.value)} placeholder="Full name of property owner / lessor" className={inputCls} />
            </Field>
            <Field label="Lessor Address">
              <input type="text" value={data.lessorAddress} onChange={e => set('lessorAddress', e.target.value)} placeholder="Address of lessor" className={inputCls} />
            </Field>
            <Field label="Monthly Rent (PHP)">
              <input type="number" min="0" value={data.monthlyRent} onChange={e => set('monthlyRent', e.target.value)} placeholder="0.00" className={inputCls} />
            </Field>
          </>
        )}

        {data.placeType === 'OWNED' && (
          <>
            <Field label="Property Owner" required>
              <input type="text" value={data.propertyOwner} onChange={e => set('propertyOwner', e.target.value)} placeholder="Name of property owner" className={inputCls} />
            </Field>
            <Field label="Reason / Basis of Ownership">
              <input type="text" value={data.ownedReason} onChange={e => set('ownedReason', e.target.value)} placeholder="e.g. Title under name, inherited, etc." className={inputCls} />
            </Field>
          </>
        )}

        {data.placeType === 'FREE_USE' && (
          <Field label="Reason for Free Use" required>
            <input type="text" value={data.noRentReason} onChange={e => set('noRentReason', e.target.value)} placeholder="e.g. Owned by parent, covered by agreement, etc." className={inputCls} />
          </Field>
        )}

        {data.placeType === '' && (
          <p className="text-xs text-muted-foreground italic">Select a place type above to see additional fields.</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CompleteDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
  session: SessionInfo;
}

export function CompleteDetailsForm({
  isOpen,
  onClose,
  onCompleted,
  session,
}: CompleteDetailsFormProps): React.ReactNode {
  const { success, error } = useToast();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  // Reset step and done when form opens (adjust state during render)
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setStep(1);
      setDone(false);
    }
  }

  // When form opens: fetch existing data from API, overlay any saved draft
  /* eslint-disable react-hooks/set-state-in-effect -- Fetching existing client data from API when form opens */
  useEffect(() => {
    if (!isOpen || !session.clientId) return;

    void (async () => {
      try {
        const res = await fetch(`/api/clients/${session.clientId}/info`, { credentials: 'include' });
        const json = await res.json() as ClientInfoResponse;
        const apiData = mapResponseToForm(json);

        // Overlay any saved draft so user does not lose unsaved edits
        const draftRaw = localStorage.getItem(DRAFT_KEY);
        if (draftRaw) {
          try {
            const draft = JSON.parse(draftRaw) as Partial<FormData>;
            setFormData({ ...apiData, ...draft });
            return;
          } catch {
            // Ignore corrupted draft
          }
        }

        setFormData(apiData);
      } catch {
        // Silently fall through — form stays at INITIAL_FORM
      }
    })();
  }, [isOpen, session.clientId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Auto-save draft to localStorage every 5 seconds while form is open
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }, 5000);
    return () => clearTimeout(t);
  }, [formData, isOpen]);

  if (!isOpen) return null;

  function set(field: keyof FormData, value: string): void {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  function saveAndClose(): void {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    onClose();
  }

  async function handleSubmit(): Promise<void> {
    if (!session.clientId) {
      error('Session error', 'Client ID not found. Please refresh and try again.');
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        core: { portalName: formData.portalName || undefined },
        individualDetails: {
          firstName: formData.firstName || undefined,
          middleName: formData.middleName || undefined,
          lastName: formData.lastName || undefined,
          dob: formData.dob || undefined,
          civilStatus: formData.civilStatus || undefined,
          gender: formData.gender || undefined,
          citizenship: formData.citizenship || undefined,
          placeOfBirth: formData.placeOfBirth || undefined,
          residentialAddress: formData.residentialAddress || undefined,
          prcLicenseNo: formData.prcLicenseNo || undefined,
          primaryIdType: formData.primaryIdType || undefined,
          primaryIdNumber: formData.primaryIdNumber || undefined,
          personalEmail: formData.personalEmail || undefined,
          mobileNumber: formData.mobileNumber || undefined,
          telephoneNumber: formData.telephoneNumber || undefined,
          motherFirstName: formData.motherFirstName || undefined,
          motherMiddleName: formData.motherMiddleName || undefined,
          motherLastName: formData.motherLastName || undefined,
          fatherFirstName: formData.fatherFirstName || undefined,
          fatherMiddleName: formData.fatherMiddleName || undefined,
          fatherLastName: formData.fatherLastName || undefined,
          spouseFirstName: formData.spouseFirstName || undefined,
          spouseMiddleName: formData.spouseMiddleName || undefined,
          spouseLastName: formData.spouseLastName || undefined,
          spouseEmploymentStatus: formData.spouseEmploymentStatus || undefined,
          spouseTin: formData.spouseTin || undefined,
          spouseEmployerName: formData.spouseEmployerName || undefined,
          spouseEmployerTin: formData.spouseEmployerTin || undefined,
        },
        businessDetails: {
          tradeName: formData.tradeName || undefined,
          industry: formData.industry || undefined,
          lineOfBusiness: formData.lineOfBusiness || undefined,
          psicCode: formData.psicCode || undefined,
          landlineNumber: formData.landlineNumber || undefined,
          faxNumber: formData.faxNumber || undefined,
          placeType: formData.placeType || undefined,
          lessorName: formData.lessorName || undefined,
          lessorAddress: formData.lessorAddress || undefined,
          monthlyRent: formData.monthlyRent || undefined,
          propertyOwner: formData.propertyOwner || undefined,
          ownedReason: formData.ownedReason || undefined,
          noRentReason: formData.noRentReason || undefined,
        },
      };

      const res = await fetch(`/api/clients/${session.clientId}/info`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.json() as { error?: string };
        error('Failed to save', errBody.error ?? 'An error occurred. Please try again.');
        return;
      }

      localStorage.setItem(COMPLETED_KEY, 'true');
      localStorage.removeItem(DRAFT_KEY);
      success('Details saved', 'Your business profile has been updated successfully.');
      setDone(true);
    } catch {
      error('Network error', 'Could not reach the server. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleDone(): void {
    setStep(1);
    setFormData(INITIAL_FORM);
    setDone(false);
    onCompleted();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={saveAndClose} />

      {/* Panel */}
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl" style={{ maxHeight: '90vh' }}>

        {done ? (
          /* Thank You */
          <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Check className="text-emerald-600" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground">Thank You!</h2>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Your details have been saved successfully. Your profile is now up to date.
              </p>
            </div>
            <button
              onClick={handleDone}
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-[0.97]"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="shrink-0 border-b border-border px-6 pb-4 pt-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Complete Your Profile</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Step {step} of 3 &middot; Progress auto-saved
                  </p>
                </div>
                <button
                  onClick={saveAndClose}
                  className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Step indicator */}
              <div className="flex items-center">
                {STEPS.map((s, i) => {
                  const Icon = s.icon;
                  const isCompleted = step > s.id;
                  const isCurrent = step === s.id;
                  return (
                    <React.Fragment key={s.id}>
                      <div className="flex shrink-0 items-center gap-2">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-blue-600 text-white'
                            : isCurrent
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                        </div>
                        <span className={`hidden whitespace-nowrap text-xs font-semibold sm:block ${
                          isCurrent ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`mx-2 h-px flex-1 rounded-full transition-colors sm:mx-3 ${
                          step > s.id ? 'bg-blue-600' : 'bg-border'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Scrollable form body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {step === 1 && <Step1 data={formData} set={set} session={session} />}
              {step === 2 && <Step2 data={formData} set={set} session={session} />}
              {step === 3 && <Step3 data={formData} set={set} session={session} />}
            </div>

            {/* Footer */}
            <div className="shrink-0 flex items-center justify-between border-t border-border px-6 py-4">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                Back
              </button>
              <button
                onClick={step < 3 ? () => setStep(s => s + 1) : () => { void handleSubmit(); }}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {step === 3 ? (submitting ? 'Saving...' : 'Submit') : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
