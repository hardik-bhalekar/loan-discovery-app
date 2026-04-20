    import { useEffect, useState } from 'react';
import { User, Calendar, Users, Phone, Mail, MapPin, Briefcase, CheckCircle2 } from 'lucide-react';
import Button from './Button';

const occupations = ['Salaried', 'Self-Employed', 'Student', 'Business Owner', 'Freelancer', 'Retired'];
const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

export default function ProfileForm({ onSubmit, initialProfile }) {
  const [form, setForm] = useState(() => ({
    name: initialProfile?.name ?? 'Rahul Sharma',
    age: initialProfile?.age ?? 30,
    gender: initialProfile?.gender ?? 'Male',
    mobile: initialProfile?.mobile ?? '',
    email: initialProfile?.email ?? '',
    city: initialProfile?.city ?? 'Mumbai',
    occupation: initialProfile?.occupation ?? 'Salaried',
  }));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setForm({
      name: initialProfile?.name ?? 'Rahul Sharma',
      age: initialProfile?.age ?? 30,
      gender: initialProfile?.gender ?? 'Male',
      mobile: initialProfile?.mobile ?? '',
      email: initialProfile?.email ?? '',
      city: initialProfile?.city ?? 'Mumbai',
      occupation: initialProfile?.occupation ?? 'Salaried',
    });
  }, [initialProfile]);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name?.trim()) nextErrors.name = 'Name is required';
    if (form.age < 18 || form.age > 70) nextErrors.age = 'Age must be between 18 and 70';
    if (form.mobile && !/^\d{10}$/.test(form.mobile)) nextErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = 'Enter a valid email address';
    return nextErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitted(true);
    onSubmit?.(form);
  };

  const inputClass = 'w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/25';

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-3xl space-y-6">
      <div className="luxury-panel rounded-[1.4rem] p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <User className="h-4 w-4 text-[var(--accent)]" />
          Personal Details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField label="Name" icon={<User />} error={errors.name}>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              className={inputClass}
              placeholder="Enter full name"
            />
          </InputField>

          <InputField label="Age" icon={<Calendar />} error={errors.age}>
            <input
              type="number"
              min="18"
              max="70"
              value={form.age}
              onChange={(e) => update('age', Number(e.target.value))}
              className={inputClass}
            />
          </InputField>

          <InputField label="Gender" icon={<Users />}>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className={inputClass}>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </InputField>

          <InputField label="Mobile" icon={<Phone />} error={errors.mobile}>
            <input
              type="tel"
              value={form.mobile}
              onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={inputClass}
              placeholder="10-digit mobile"
            />
          </InputField>

          <InputField label="Email" icon={<Mail />} error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              className={inputClass}
              placeholder="name@example.com"
            />
          </InputField>

          <InputField label="City" icon={<MapPin />}>
            <select value={form.city} onChange={(e) => update('city', e.target.value)} className={inputClass}>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </InputField>

          <div className="md:col-span-2">
            <InputField label="Occupation" icon={<Briefcase />}>
              <select value={form.occupation} onChange={(e) => update('occupation', e.target.value)} className={inputClass}>
                {occupations.map((occupation) => (
                  <option key={occupation} value={occupation}>
                    {occupation}
                  </option>
                ))}
              </select>
            </InputField>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit">{submitted ? <><CheckCircle2 className="h-4 w-4" /> Saved</> : 'Save Profile'}</Button>
        {submitted ? <span className="text-sm font-medium text-emerald-600">Profile details saved successfully</span> : null}
      </div>
    </form>
  );
}

function InputField({ label, icon, error, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]">
        <span className="text-[var(--text-faint)] [&_svg]:h-4 [&_svg]:w-4">{icon}</span>
        {label}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}