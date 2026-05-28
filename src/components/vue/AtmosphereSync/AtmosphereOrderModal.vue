<script setup lang="ts">
import OrderForm from "./OrderForm.vue";
const props = defineProps<{
  isOpen: boolean;
  product: string;
  price: string;
  aqiNote: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <div class="modal flow" :class="{ 'is-open': isOpen }">
    <button
      class="modal-close"
      @click="$emit('close')"
      aria-label="Close order panel"
    >
      ×
    </button>
    <div class="card">
      <p class="product">{{ product }}</p>
      <img src="/breezy-concept.png" alt="" width="160" />

      <h4>{{ price }}</h4>
    </div>
    <small>{{ aqiNote }}</small>
    <OrderForm :price="price" />
  </div>
</template>

<style scoped>
.modal {
  position: absolute;
  position-anchor: --modal-anchor;
  anchor-name: --modal-wrapper;
  left: calc(anchor(right) + 1rem);
  top: anchor(top);
  border: 1px solid var(--color-palette-sky-200);
  border-radius: 5px;
  width: 320px;
  padding: 1rem;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 300ms var(--ease-atmospheric),
    visibility 300ms var(--ease-atmospheric);

  .modal-close {
    background-color: var(--color-palette-slate-500);
    color: var(--color-palette-slate-200);
    position-anchor: --modal-wrapper;
    border: none;
    border-radius: 100%;
    width: 32px;
    height: 32px;
    position: absolute;
    right: 10px;
    cursor: pointer;
  }

  .card {
    display: grid;
    grid: auto / 1fr 1fr auto;
    gap: 1rem;
    margin-block-start: 4rem;
    margin-block-end: 2rem;
    text-align: left;

    .product {
      font-weight: 500;
      color: var(--color-palette-sky-500);
      font-size: var(--size-step-0);
      line-height: var(--line-height-flat);
    }
  }
}
.modal.is-open {
  opacity: 1;
  visibility: visible;
}
</style>
