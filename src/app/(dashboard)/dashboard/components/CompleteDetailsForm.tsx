// src/app/(dashboard)/dashboard/components/CompleteDetailsForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Building2, User, Briefcase } from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────

const DRAFT_KEY = 'client_details_draft';
const COMPLETED_KEY = 'client_details_completed';

// Placeholder generated values — replace with session data when API is ready
const COMPANY_CODE = 'ACP-2026-0042';
const CLIENT_NUMBER = 'CLT-00421';

const STEPS = [
  { id: 1, label: 'Core Info',  icon: Building2 },
  { id: 2, label: 'Owner Info', icon: User },
  { id: 3, label: 'Operations', icon: Briefcase },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  businessName: string;
  businessEntity: string;
  branchType: string;
  // Step 2 — Individual
  fullName: string;
  dateOfBirth: string;
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
  // Step 3 — Family
  mothersName: string;
  fathersName: string;
  spouseName: string;
  spouseEmployment: string;
  spouseTin: string;
  // Step 4
  tradeName: string;
  industry: string;
  lineOfBusiness: string;
  psicCode: string;
  businessArea: string;
  placeType: string;
}

const INITIAL_FORM: FormData = {
  businessName: '', businessEntity: '', branchType: '',
  fullName: '',   dateOfBirth: '', civilStatus: '', gender: '', citizenship: '', placeOfBirth: '',
  residentialAddress: '', prcLicenseNo: '', primaryIdType: '', primaryIdNumber: '',
  personalEmail: '', mobileNumber: '', telephoneNumber: '',
  mothersName: '', fathersName: '', spouseName: '', spouseEmployment: '', spouseTin: '',
  tradeName: '', industry: '', lineOfBusiness: '', psicCode: '', businessArea: '', placeType: '',
};

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
}

// ─── Step 1: Core Information ─────────────────────────────────────────────────

function Step1({ data, set }: StepProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Core Information</p>

      <Field label="Business Name" required>
        <input
          type="text"
          value={data.businessName}
          onChange={e => set('businessName', e.target.value)}
          placeholder="Enter your registered business name"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Company Code">
          <div className={readonlyCls}>{COMPANY_CODE}</div>
        </Field>
        <Field label="Client Number">
          <div className={readonlyCls}>{CLIENT_NUMBER}</div>
        </Field>
      </div>

      <Field label="Business Entity" required>
        <select
          value={data.businessEntity}
          onChange={e => set('businessEntity', e.target.value)}
          className={selectCls}
        >
          <option value="">Select entity type</option>
          <option value="sole_proprietorship">Sole Proprietorship</option>
          <option value="one_person_corporation">One Person Corporation (OPC)</option>
          <option value="partnership">Partnership</option>
          <option value="corporation">Corporation</option>
          <option value="cooperative">Cooperative</option>
          <option value="ngo">NGO / Non-Profit</option>
        </select>
      </Field>

      <Field label="Branch Type" required>
        <select
          value={data.branchType}
          onChange={e => set('branchType', e.target.value)}
          className={selectCls}
        >
          <option value="">Select branch type</option>
          <option value="main">Main</option>
          <option value="branch">Branch</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Step 2: Owner / Individual Information ────────────────────────────────────

function Step2({ data, set }: StepProps): React.ReactElement {
  return (
    <div className="space-y-6">

      {/* Owner Info */}
      <div className="space-y-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Owner / Individual Information</p>

        <Field label="Full Name" required>
          <input
            type="text"
            value={data.fullName}
            onChange={e => set('fullName', e.target.value)}
            placeholder="Last Name, First Name Middle Name"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date of Birth" required>
            <input
              type="date"
              value={data.dateOfBirth}
              onChange={e => set('dateOfBirth', e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Civil Status">
            <select value={data.civilStatus} onChange={e => set('civilStatus', e.target.value)} className={selectCls}>
              <option value="">Select status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Legally Separated</option>
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Gender">
            <select value={data.gender} onChange={e => set('gender', e.target.value)} className={selectCls}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </Field>
          <Field label="Citizenship">
            <input
              type="text"
              value={data.citizenship}
              onChange={e => set('citizenship', e.target.value)}
              placeholder="e.g. Filipino"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Place of Birth">
          <input
            type="text"
            value={data.placeOfBirth}
            onChange={e => set('placeOfBirth', e.target.value)}
            placeholder="City / Municipality, Province"
            className={inputCls}
          />
        </Field>

        <Field label="Residential Address">
          <input
            type="text"
            value={data.residentialAddress}
            onChange={e => set('residentialAddress', e.target.value)}
            placeholder="Full residential address"
            className={inputCls}
          />
        </Field>

        <Field label="PRC License No.">
          <input
            type="text"
            value={data.prcLicenseNo}
            onChange={e => set('prcLicenseNo', e.target.value)}
            placeholder="If applicable"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary ID Type">
            <select value={data.primaryIdType} onChange={e => set('primaryIdType', e.target.value)} className={selectCls}>
              <option value="">Select ID type</option>
              <option value="passport">Passport</option>
              <option value="drivers_license">Driver&apos;s License</option>
              <option value="sss">SSS ID</option>
              <option value="gsis">GSIS ID</option>
              <option value="umid">UMID</option>
              <option value="philsys">PhilSys ID</option>
              <option value="voters_id">Voter&apos;s ID</option>
              <option value="prc">PRC ID</option>
            </select>
          </Field>
          <Field label="Primary ID Number">
            <input
              type="text"
              value={data.primaryIdNumber}
              onChange={e => set('primaryIdNumber', e.target.value)}
              placeholder="ID number"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Personal Email" required>
          <input
            type="email"
            value={data.personalEmail}
            onChange={e => set('personalEmail', e.target.value)}
            placeholder="personal@email.com"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobile Number" required>
            <input
              type="tel"
              value={data.mobileNumber}
              onChange={e => set('mobileNumber', e.target.value)}
              placeholder="+63 9XX XXX XXXX"
              className={inputCls}
            />
          </Field>
          <Field label="Telephone Number">
            <input
              type="tel"
              value={data.telephoneNumber}
              onChange={e => set('telephoneNumber', e.target.value)}
              placeholder="(032) XXX XXXX"
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      {/* Family Background */}
      <div className="space-y-4 border-t border-border pt-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Family Background</p>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Mother's Name">
            <input
              type="text"
              value={data.mothersName}
              onChange={e => set('mothersName', e.target.value)}
              placeholder="Full maiden name"
              className={inputCls}
            />
          </Field>
          <Field label="Father's Name">
            <input
              type="text"
              value={data.fathersName}
              onChange={e => set('fathersName', e.target.value)}
              placeholder="Full name"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Spouse Name">
          <input
            type="text"
            value={data.spouseName}
            onChange={e => set('spouseName', e.target.value)}
            placeholder="Full name (if applicable)"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Spouse Employment">
            <input
              type="text"
              value={data.spouseEmployment}
              onChange={e => set('spouseEmployment', e.target.value)}
              placeholder="Employer or business name"
              className={inputCls}
            />
          </Field>
          <Field label="Spouse TIN">
            <input
              type="text"
              value={data.spouseTin}
              onChange={e => set('spouseTin', e.target.value)}
              placeholder="000-000-000-000"
              className={inputCls}
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Business Operations ──────────────────────────────────────────────

function Step3({ data, set }: StepProps): React.ReactElement {
  return (
    <div className="space-y-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">Business Operations</p>

      <Field label="Trade Name">
        <input
          type="text"
          value={data.tradeName}
          onChange={e => set('tradeName', e.target.value)}
          placeholder="Registered trade name (if different from business name)"
          className={inputCls}
        />
      </Field>

      <Field label="Industry" required>
        <select value={data.industry} onChange={e => set('industry', e.target.value)} className={selectCls}>
          <option value="">Select industry</option>
          <option value="agriculture">Agriculture, Forestry &amp; Fishing</option>
          <option value="mining">Mining &amp; Quarrying</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="construction">Construction</option>
          <option value="wholesale_retail">Wholesale &amp; Retail Trade</option>
          <option value="transportation">Transportation &amp; Storage</option>
          <option value="accommodation">Accommodation &amp; Food Services</option>
          <option value="ict">Information &amp; Communication Technology</option>
          <option value="financial">Financial &amp; Insurance Activities</option>
          <option value="real_estate">Real Estate Activities</option>
          <option value="professional">Professional, Scientific &amp; Technical</option>
          <option value="admin">Administrative &amp; Support Services</option>
          <option value="education">Education</option>
          <option value="health">Human Health &amp; Social Work</option>
          <option value="arts">Arts, Entertainment &amp; Recreation</option>
          <option value="other_services">Other Service Activities</option>
        </select>
      </Field>

      <Field label="Line of Business" required>
        <input
          type="text"
          value={data.lineOfBusiness}
          onChange={e => set('lineOfBusiness', e.target.value)}
          placeholder="Describe your primary business activity"
          className={inputCls}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="PSIC Code">
          <input
            type="text"
            value={data.psicCode}
            onChange={e => set('psicCode', e.target.value)}
            placeholder="Philippine Standard Industrial Classification"
            className={inputCls}
          />
        </Field>
        <Field label="Business Area (sqm)">
          <input
            type="number"
            min="0"
            value={data.businessArea}
            onChange={e => set('businessArea', e.target.value)}
            placeholder="Floor area in sqm"
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Place Type" required>
        <select value={data.placeType} onChange={e => set('placeType', e.target.value)} className={selectCls}>
          <option value="">Select place type</option>
          <option value="commercial">Commercial</option>
          <option value="residential">Residential</option>
          <option value="industrial">Industrial</option>
          <option value="mixed_use">Mixed Use</option>
        </select>
      </Field>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface CompleteDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleted: () => void;
}

export function CompleteDetailsForm({ isOpen, onClose, onCompleted }: CompleteDetailsFormProps): React.ReactNode {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);

  // Hydrate draft from localStorage on mount
  /* eslint-disable react-hooks/set-state-in-effect -- Hydration-safe: must read localStorage after mount */
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      setFormData(prev => ({ ...prev, ...(JSON.parse(raw) as Partial<FormData>) }));
    } catch {
      // Ignore corrupted draft
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Auto-save draft with 5-second debounce
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
    // Immediate save so no data is lost when closing mid-form
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    onClose();
  }

  function handleSubmit(): void {
    localStorage.setItem(COMPLETED_KEY, 'true');
    localStorage.removeItem(DRAFT_KEY);
    setDone(true);
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
          /* ── Thank You ─────────────────────────────────────────── */
          <div className="flex flex-col items-center justify-center gap-6 px-8 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
              <Check className="text-emerald-600" size={40} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-foreground">Thank You!</h2>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Your details have been submitted successfully. Our team will review your information and get back to you shortly.
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
            {/* ── Header ──────────────────────────────────────────── */}
            <div className="shrink-0 border-b border-border px-6 pb-4 pt-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-foreground">Complete Your Profile</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Step {step} of 3 · Progress auto-saved
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
                          isCurrent
                            ? 'text-foreground'
                            : 'text-muted-foreground'
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

            {/* ── Scrollable form content ──────────────────────────── */}
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              {step === 1 && <Step1 data={formData} set={set} />}
              {step === 2 && <Step2 data={formData} set={set} />}
              {step === 3 && <Step3 data={formData} set={set} />}
            </div>

            {/* ── Footer ──────────────────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between border-t border-border px-6 py-4">
              <button
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
              >
                Back
              </button>
              <button
                onClick={step < 3 ? () => setStep(s => s + 1) : handleSubmit}
                className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.97]"
              >
                {step === 3 ? 'Submit' : 'Next'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
