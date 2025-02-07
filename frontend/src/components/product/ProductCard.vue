<template>
  <div class="card bg-base-100 shadow-xl">
    <figure class="">
      <img
        :src="product.images?.[0]?.url"
        :alt="product.name || 'Product Image'"
        class="w-[300px] h-[300px] object-top object-cover"
      />
    </figure>
    <div class="card-body items-center text-center">
      <h2 class="card-title">{{ product.name }}</h2>
      <p>{{ product.price }}</p>
      <div class="card-actions">
        <button class="btn btn-primary">Buy Now</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
}
</script>
