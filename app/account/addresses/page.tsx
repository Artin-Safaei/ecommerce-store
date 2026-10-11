"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPin, Plus, Trash2, Loader2 } from "lucide-react";

type Address = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

const emptyForm = {
  firstName: "",
  lastName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function loadAddresses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/addresses");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load addresses.");
      }

      setAddresses(data);
    } catch (error) {
      console.error(error);

      setError("Failed to load your addresses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create address."
        );
      }

      setAddresses((current) => [
        data.address,
        ...current,
      ]);

      setForm(emptyForm);
      setShowForm(false);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create address."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`/api/addresses/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete address."
        );
      }

      setAddresses((current) =>
        current.filter((address) => address.id !== id)
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16">

        {/* Header */}
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-500">
              Account
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Your addresses
            </h1>

            <p className="mt-3 text-zinc-500">
              Manage your shipping addresses.
            </p>
          </div>

          <button
            onClick={() => {
              setShowForm((current) => !current);
              setError("");
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            <Plus className="h-4 w-4" />
            Add address
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <h2 className="text-lg font-semibold">
              Add new address
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input
                name="firstName"
                label="First name"
                value={form.firstName}
                onChange={handleChange}
                required
              />

              <Input
                name="lastName"
                label="Last name"
                value={form.lastName}
                onChange={handleChange}
                required
              />

              <Input
                name="phone"
                label="Phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

              <Input
                name="city"
                label="City"
                value={form.city}
                onChange={handleChange}
                required
              />

              <Input
                name="postalCode"
                label="Postal code"
                value={form.postalCode}
                onChange={handleChange}
                required
              />

              <Input
                name="country"
                label="Country"
                value={form.country}
                onChange={handleChange}
                required
              />

              <div className="sm:col-span-2">
                <Input
                  name="address"
                  label="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-6 flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {saving ? "Saving..." : "Save address"}
            </button>
          </form>
        )}

        {/* Addresses */}
        <div className="mt-8">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-zinc-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 px-6 py-16 text-center">
              <MapPin className="mx-auto h-8 w-8 text-zinc-600" />

              <h2 className="mt-4 font-semibold">
                No addresses yet
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Add an address to make checkout faster.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-800">
                        <MapPin className="h-5 w-5 text-zinc-300" />
                      </div>

                      <div>
                        <h2 className="font-semibold">
                          {address.firstName}{" "}
                          {address.lastName}
                        </h2>

                        <p className="mt-1 text-sm text-zinc-500">
                          {address.phone}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleDelete(address.id)
                      }
                      disabled={
                        deletingId === address.id
                      }
                      className="rounded-lg p-2 text-zinc-600 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                    >
                      {deletingId === address.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="mt-5 border-t border-zinc-800 pt-5 text-sm leading-6 text-zinc-400">
                    <p>{address.address}</p>
                    <p>
                      {address.city}, {address.postalCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Input({
  name,
  label,
  value,
  onChange,
  required,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
      />
    </div>
  );
}