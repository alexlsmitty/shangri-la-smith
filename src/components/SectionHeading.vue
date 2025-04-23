<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  centered: {
    type: Boolean,
    default: true,
  },
  lightText: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="section-heading my-6"
    :class="{
      'text-center': centered,
      'light-text': lightText,
    }"
  >
    <h2 class="text-h4 font-weight-bold">{{ title }}</h2>
    <div v-if="subtitle" class="subtitle-line"></div>
    <p v-if="subtitle" class="text-subtitle-1 mt-2">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  position: relative;
}

.light-text {
  color: white;
}

.light-text .subtitle-line {
  background-color: rgba(255, 255, 255, 0.6);
}

.subtitle-line {
  height: 2px;
  width: 80px;
  background-color: var(--v-primary-base);
  margin: 16px auto;
  background-color: #00695c;
}

.section-heading.text-center .subtitle-line {
  margin: 16px auto;
}

.section-heading:not(.text-center) .subtitle-line {
  margin: 16px 0;
}
</style>
