import { useState } from "react";
import toast from "react-hot-toast";
import {
  Bell,
  Clock,
  Globe,
  Languages,
  MapPin,
  PackageCheck,
  RotateCcw,
  Save,
  Store,
  Truck,
} from "lucide-react";

import Button from "../../../../shared/components/ui/button";

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit Baltistan",
  "AJK",
];

const NOTIFICATION_PREFS = [
  {
    key: "newOrders",
    label: "New Order Alerts",
    description: "Get notified when a customer places a new order.",
    defaultOn: true,
  },
  {
    key: "lowStock",
    label: "Low Stock Alerts",
    description: "Warn me when a product is running out of stock.",
    defaultOn: true,
  },
  {
    key: "payoutUpdates",
    label: "Payout Updates",
    description: "Updates on payout requests and settlements.",
    defaultOn: true,
  },
  {
    key: "promoEmails",
    label: "Marketing Emails",
    description: "Occasional tips and feature announcements.",
    defaultOn: false,
  },
];

const DEFAULT_SHIPPING = [
  { id: 1, city: "Lahore", fee: 150, days: "1-2" },
  { id: 2, city: "Karachi", fee: 250, days: "2-3" },
  { id: 3, city: "Islamabad", fee: 200, days: "1-2" },
  { id: 4, city: "Multan", fee: 200, days: "2-4" },
];

const sectionClass =
  "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

const inputClass = (hasError) => `
  mt-2 w-full rounded-xl border p-3 outline-none transition
  ${hasError ? "border-red-500" : "border-gray-300 focus:border-green-600"}
`;

const Toggle = ({ enabled, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={() => onChange(!enabled)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors
      ${enabled ? "bg-green-600" : "bg-gray-200"}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
        ${enabled ? "translate-x-6" : "translate-x-1"}
      `}
    />
  </button>
);

const SectionHeading = ({ icon: Icon, iconBg, title, subtitle }) => (
  <div className="flex items-center gap-3">
    <span
      className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}
    >
      <Icon size={18} />
    </span>

    <div>
      <h2 className="font-bold text-gray-900">{title}</h2>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const ShopSettings = () => {
  const [saving, setSaving] = useState(false);
  const [store, setStore] = useState({
    storeName: "Green Valley Store",
    tagline: "Fresh farm produce delivered daily",
    province: "Punjab",
    city: "Lahore",
    address: "Shop #12, Main Bazaar, Gulberg",
    phone: "0300 1234567",
    email: "store@greenvalley.pk",
    description:
      "We grow and deliver fresh vegetables, fruits and grains straight from our farms in Punjab to your doorstep.",
  });

  const [preferences, setPreferences] = useState({
    currency: "PKR",
    language: "English",
    processingTime: "1-2",
    returnPolicy: "7",
    freeShippingEnabled: true,
    freeShippingThreshold: "5000",
  });

  const [shipping, setShipping] = useState(DEFAULT_SHIPPING);
  const [notifications, setNotifications] = useState(() =>
    NOTIFICATION_PREFS.reduce(
      (acc, pref) => ({ ...acc, [pref.key]: pref.defaultOn }),
      {}
    )
  );

  const updateStore = (field, value) =>
    setStore((prev) => ({ ...prev, [field]: value }));

  const updatePreference = (field, value) =>
    setPreferences((prev) => ({ ...prev, [field]: value }));

  const updateShipping = (id, field, value) =>
    setShipping((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );

  const handleSave = () => {
    setSaving(true);

    setTimeout(() => {
      setSaving(false);
      toast.success("Shop settings saved successfully.");
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
          <Store size={22} />
        </span>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Settings</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Configure your storefront, delivery and preferences.
          </p>
        </div>
      </div>

      {/* ==========================================
          STORE INFORMATION
      ========================================== */}

      <section className={sectionClass}>
        <SectionHeading
          icon={Store}
          iconBg="bg-green-50 text-green-700"
          title="Store Information"
          subtitle="Details shown on your public store page."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="font-medium">Store Name</label>
            <input
              type="text"
              value={store.storeName}
              onChange={(e) => updateStore("storeName", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="font-medium">Tagline</label>
            <input
              type="text"
              value={store.tagline}
              onChange={(e) => updateStore("tagline", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="font-medium">Province</label>
            <select
              value={store.province}
              onChange={(e) => updateStore("province", e.target.value)}
              className={inputClass(false)}
            >
              {PROVINCES.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">City</label>
            <input
              type="text"
              value={store.city}
              onChange={(e) => updateStore("city", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="font-medium">Store Address</label>
            <input
              type="text"
              value={store.address}
              onChange={(e) => updateStore("address", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div>
            <label className="font-medium">Phone</label>
            <input
              type="text"
              value={store.phone}
              onChange={(e) => updateStore("phone", e.target.value)}
              className={inputClass(false)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="font-medium">Store Description</label>
            <textarea
              rows="3"
              value={store.description}
              onChange={(e) => updateStore("description", e.target.value)}
              className={`${inputClass(false)} resize-none`}
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          DELIVERY & SHIPPING
      ========================================== */}

      <section className={sectionClass}>
        <SectionHeading
          icon={Truck}
          iconBg="bg-blue-50 text-blue-600"
          title="Delivery & Shipping"
          subtitle="Set shipping fees for the cities you deliver to."
        />

        <div className="mt-6 space-y-4">
          {shipping.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-1 gap-4 rounded-xl border border-gray-200 p-4 sm:grid-cols-[1fr_150px_130px_40px] sm:items-center"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin size={16} className="text-green-600" />
                {row.city}
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Delivery Fee (PKR)
                </label>
                <input
                  type="number"
                  value={row.fee}
                  onChange={(e) =>
                    updateShipping(row.id, "fee", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-400">
                  Delivery Time (days)
                </label>
                <input
                  type="text"
                  value={row.days}
                  onChange={(e) =>
                    updateShipping(row.id, "days", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setShipping((prev) =>
                    prev.filter((r) => r.id !== row.id)
                  )
                }
                className="flex h-9 w-9 items-center justify-center self-end rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label={`Remove ${row.city}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Free Shipping Over
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Automatically waive delivery fees on orders above this amount.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              disabled={!preferences.freeShippingEnabled}
              value={preferences.freeShippingThreshold}
              onChange={(e) =>
                updatePreference("freeShippingThreshold", e.target.value)
              }
              className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 disabled:bg-gray-100 disabled:text-gray-400"
            />
            <span className="text-sm text-gray-500">PKR</span>

            <Toggle
              enabled={preferences.freeShippingEnabled}
              onChange={(value) =>
                updatePreference("freeShippingEnabled", value)
              }
            />
          </div>
        </div>
      </section>

      {/* ==========================================
          POLICIES & PREFERENCES
      ========================================== */}

      <section className={sectionClass}>
        <SectionHeading
          icon={PackageCheck}
          iconBg="bg-amber-50 text-amber-600"
          title="Policies & Preferences"
          subtitle="Order handling and customer-friendly policies."
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label className="font-medium">Order Processing Time</label>
            <div className="relative mt-2">
              <Clock
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={preferences.processingTime}
                onChange={(e) =>
                  updatePreference("processingTime", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none transition focus:border-green-600"
              >
                <option value="1-2">1 - 2 days</option>
                <option value="2-3">2 - 3 days</option>
                <option value="3-5">3 - 5 days</option>
                <option value="5-7">5 - 7 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium">Return Policy</label>
            <div className="relative mt-2">
              <RotateCcw
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={preferences.returnPolicy}
                onChange={(e) =>
                  updatePreference("returnPolicy", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none transition focus:border-green-600"
              >
                <option value="3">3 days</option>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30">30 days</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium">Currency</label>
            <div className="relative mt-2">
              <Globe
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={preferences.currency}
                onChange={(e) =>
                  updatePreference("currency", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none transition focus:border-green-600"
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-medium">Language</label>
            <div className="relative mt-2">
              <Languages
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={preferences.language}
                onChange={(e) =>
                  updatePreference("language", e.target.value)
                }
                className="w-full rounded-xl border border-gray-300 py-3 pl-9 pr-3 outline-none transition focus:border-green-600"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          NOTIFICATION PREFERENCES
      ========================================== */}

      <section className={sectionClass}>
        <SectionHeading
          icon={Bell}
          iconBg="bg-purple-50 text-purple-600"
          title="Notification Preferences"
          subtitle="Choose what updates you want to receive."
        />

        <div className="mt-6 divide-y divide-gray-100">
          {NOTIFICATION_PREFS.map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {pref.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {pref.description}
                </p>
              </div>

              <Toggle
                enabled={notifications[pref.key]}
                onChange={(value) =>
                  setNotifications((prev) => ({
                    ...prev,
                    [pref.key]: value,
                  }))
                }
              />
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          ACTIONS
      ========================================== */}

      <div className="flex justify-end gap-3">
        <Button
          variant="ghost"
          size="md"
          disabled={saving}
          onClick={() => {
            setStore({
              storeName: "Green Valley Store",
              tagline: "Fresh farm produce delivered daily",
              province: "Punjab",
              city: "Lahore",
              address: "Shop #12, Main Bazaar, Gulberg",
              phone: "0300 1234567",
              email: "store@greenvalley.pk",
              description:
                "We grow and deliver fresh vegetables, fruits and grains straight from our farms in Punjab to your doorstep.",
            });
            setPreferences({
              currency: "PKR",
              language: "English",
              processingTime: "1-2",
              returnPolicy: "7",
              freeShippingEnabled: true,
              freeShippingThreshold: "5000",
            });
            setShipping(DEFAULT_SHIPPING);
            setNotifications(() =>
              NOTIFICATION_PREFS.reduce(
                (acc, pref) => ({
                  ...acc,
                  [pref.key]: pref.defaultOn,
                }),
                {}
              )
            );
            toast("Shop settings reset to defaults.");
          }}
        >
          Reset Defaults
        </Button>

        <Button
          variant="primary"
          size="md"
          className="px-8"
          loading={saving}
          leftIcon={!saving && <Save size={17} />}
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ShopSettings;
