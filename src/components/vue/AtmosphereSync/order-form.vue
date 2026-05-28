<template>
  <div class="billing-container">
    <form
      v-if="!isSubmitted"
      class="billing-form"
      @submit.prevent="handleSubmit"
    >
      <h2>Billing Information</h2>

      <ul class="form-list">
        <!-- Full Name -->
        <li class="form-row">
          <label for="card-name">Name on Card</label>
          <input
            type="text"
            id="card-name"
            v-model="form.cardName"
            required
            autocomplete="cc-name"
            placeholder="Johnathan Doe"
          />
        </li>

        <!-- Card Number -->
        <li class="form-row">
          <label for="card-number">Card Number</label>
          <input
            type="text"
            id="card-number"
            v-model="form.cardNumber"
            required
            autocomplete="cc-number"
            inputmode="numeric"
            pattern="[0-9]{13,19}"
            placeholder="0000 0000 0000 0000"
          />
        </li>

        <!-- Expiry & CVV Grouped -->
        <li class="form-row form-group">
          <div class="field-half">
            <label for="card-expiry">Expiration Date</label>
            <input
              type="text"
              id="card-expiry"
              v-model="form.cardExpiry"
              required
              autocomplete="cc-exp"
              placeholder="MM / YY"
            />
          </div>
          <div class="field-half">
            <label for="card-cvv">Security Code (CVV)</label>
            <input
              type="text"
              id="card-cvv"
              v-model="form.cardCvv"
              required
              autocomplete="cc-csc"
              inputmode="numeric"
              pattern="[0-9]{3,4}"
              placeholder="000"
            />
          </div>
        </li>

        <!-- Street Address -->
        <li class="form-row">
          <label for="billing-address">Street Address</label>
          <input
            type="text"
            id="billing-address"
            v-model="form.billingAddress"
            required
            autocomplete="billing address-line1"
            placeholder="123 Altitude Way, Apt 4B"
          />
        </li>

        <!-- City & State Grouped -->
        <li class="form-row form-group">
          <div class="field-half">
            <label for="billing-city">City</label>
            <input
              type="text"
              id="billing-city"
              v-model="form.billingCity"
              required
              autocomplete="billing address-level2"
            />
          </div>
          <div class="field-half">
            <label for="billing-state">State / Province</label>
            <input
              type="text"
              id="billing-state"
              v-model="form.billingState"
              required
              autocomplete="billing address-level1"
            />
          </div>
        </li>

        <!-- Postal Code & Country Grouped -->
        <li class="form-row form-group">
          <div class="field-half">
            <label for="billing-zip">ZIP / Postal Code</label>
            <input
              type="text"
              id="billing-zip"
              v-model="form.billingZip"
              required
              autocomplete="billing postal-code"
            />
          </div>
          <div class="field-half">
            <label for="billing-country">Country</label>
            <input
              type="text"
              id="billing-country"
              v-model="form.billingCountry"
              required
              autocomplete="billing country-name"
              placeholder="United States"
            />
          </div>
        </li>

        <!-- Submit Button dynamically shows item price -->
        <li class="form-row form-actions">
          <button type="submit" class="btn-submit">
            Authorize Payment — {{ props.price }}
          </button>
        </li>
      </ul>
    </form>

    <!-- Success Feedback State -->
    <div v-else class="success-message">
      <p>Your order is placed</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Define the incoming prop interface
interface Props {
  price?: string;
}

// Set up props with a default value matching your base collection price
const props = withDefaults(defineProps<Props>(), {
  price: "$99.00",
});

const isSubmitted = ref(false);

const form = ref({
  cardName: "",
  cardNumber: "",
  cardExpiry: "",
  cardCvv: "",
  billingAddress: "",
  billingCity: "",
  billingState: "",
  billingZip: "",
  billingCountry: "",
});

const handleSubmit = () => {
  isSubmitted.value = true;
};
</script>

<style scoped>
.billing-container {
  width: 100%;
}

.billing-form {
  background: transparent;
  font-family: var(--font-family-base);
  max-width: 480px;
  width: 100%;
}

.billing-form h2 {
  font-family: inherit;
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
  margin-bottom: 32px;
  text-transform: uppercase;
}

.form-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.form-row {
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  gap: 16px;
}

.field-half {
  flex: 1;
}

label {
  color: var(--text-muted);
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  text-transform: uppercase;
}

input[type="text"] {
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0px;
  box-sizing: border-box;
  color: var(--text-main);
  font-size: 0.9rem;
  padding: 12px 16px;
  transition: border-color 0.2s ease;
  width: 100%;
}

input[type="text"]:focus {
  border-color: var(--focus-ring);
  outline: none;
}

input::placeholder {
  color: #cccccc;
}

.btn-submit {
  background-color: var(--color-palette-sky-500);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  margin-top: 12px;
  padding: 16px;
  text-transform: uppercase;
  transition: opacity 0.2s ease;
  width: 100%;
}

.btn-submit:hover {
  opacity: 0.9;
}

.success-message {
  align-items: center;
  display: flex;
  font-family: var(--font-family-base);
  justify-content: flex-start;
  min-height: 200px;
}

.success-message p {
  color: var(--text-main);
  font-size: 1rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
