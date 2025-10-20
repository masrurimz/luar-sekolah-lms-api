import { createFileRoute } from '@tanstack/react-router';

import { useAppForm } from './-hooks/form';

// Regex patterns defined at module level for performance
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const ZIP_CODE_REGEX = /^\d{5}(-\d{4})?$/;
const PHONE_REGEX = /^(\+\d{1,3})?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export const Route = createFileRoute('/demo/form/address')({
  component: AddressForm,
});

function AddressForm() {
  const form = useAppForm({
    defaultValues: {
      fullName: '',
      email: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      phone: '',
    },
    validators: {
      onBlur: ({ value }) => {
        const errors = {
          fields: {},
        } as {
          fields: Record<string, string>;
        };
        if (value.fullName.trim().length === 0) {
          errors.fields.fullName = 'Full name is required';
        }
        return errors;
      },
    },
    onSubmit: ({ value }) => {
      // biome-ignore lint/suspicious/noConsole: need for demo purpose
      console.log(value);
      // Show success message
      alert('Form submitted successfully!');
    },
  });

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4 text-white"
      style={{
        backgroundImage:
          'radial-gradient(50% 50% at 5% 40%, #f4a460 0%, #8b4513 70%, #1a0f0a 100%)',
      }}
    >
      <div className="w-full max-w-2xl rounded-xl border-8 border-black/10 bg-black/50 p-8 shadow-xl backdrop-blur-md">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppField name="fullName">
            {(field) => <field.TextField label="Full Name" />}
          </form.AppField>

          <form.AppField
            name="email"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Email is required';
                }
                if (!EMAIL_REGEX.test(value)) {
                  return 'Invalid email address';
                }
                return;
              },
            }}
          >
            {(field) => <field.TextField label="Email" />}
          </form.AppField>

          <form.AppField
            name="address.street"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Street address is required';
                }
                return;
              },
            }}
          >
            {(field) => <field.TextField label="Street Address" />}
          </form.AppField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <form.AppField
              name="address.city"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'City is required';
                  }
                  return;
                },
              }}
            >
              {(field) => <field.TextField label="City" />}
            </form.AppField>
            <form.AppField
              name="address.state"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'State is required';
                  }
                  return;
                },
              }}
            >
              {(field) => <field.TextField label="State" />}
            </form.AppField>
            <form.AppField
              name="address.zipCode"
              validators={{
                onBlur: ({ value }) => {
                  if (!value || value.trim().length === 0) {
                    return 'Zip code is required';
                  }
                  if (!ZIP_CODE_REGEX.test(value)) {
                    return 'Invalid zip code format';
                  }
                  return;
                },
              }}
            >
              {(field) => <field.TextField label="Zip Code" />}
            </form.AppField>
          </div>

          <form.AppField
            name="address.country"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Country is required';
                }
                return;
              },
            }}
          >
            {(field) => (
              <field.Select
                label="Country"
                placeholder="Select a country"
                values={[
                  { label: 'United States', value: 'US' },
                  { label: 'Canada', value: 'CA' },
                  { label: 'United Kingdom', value: 'UK' },
                  { label: 'Australia', value: 'AU' },
                  { label: 'Germany', value: 'DE' },
                  { label: 'France', value: 'FR' },
                  { label: 'Japan', value: 'JP' },
                ]}
              />
            )}
          </form.AppField>

          <form.AppField
            name="phone"
            validators={{
              onBlur: ({ value }) => {
                if (!value || value.trim().length === 0) {
                  return 'Phone number is required';
                }
                if (!PHONE_REGEX.test(value)) {
                  return 'Invalid phone number format';
                }
                return;
              },
            }}
          >
            {(field) => (
              <field.TextField label="Phone" placeholder="123-456-7890" />
            )}
          </form.AppField>

          <div className="flex justify-end">
            <form.AppForm>
              <form.SubscribeButton label="Submit" />
            </form.AppForm>
          </div>
        </form>
      </div>
    </div>
  );
}
