<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: 'Special Offer'
  },
  description: {
    type: String,
    default: 'Book now and save 15% on your stay!'
  },
  codeLabel: {
    type: String,
    default: 'Use code:'
  },
  promoCode: {
    type: String,
    default: 'PARADISE15'
  },
  expiryDate: {
    type: String,
    default: 'Limited time offer'
  },
  color: {
    type: String,
    default: 'secondary' // primary, secondary, accent, etc.
  },
  outlined: {
    type: Boolean,
    default: false
  }
});

// Banner state
const isVisible = ref(true);

// Close banner
function closeBanner() {
  isVisible.value = false;
}

// Copy promo code to clipboard
function copyPromoCode() {
  navigator.clipboard.writeText(props.promoCode)
    .then(() => {
      alert(`Promo code ${props.promoCode} copied to clipboard!`);
    })
    .catch(err => {
      console.error('Could not copy text: ', err);
    });
}
</script>

<template>
  <div v-if="isVisible" class="special-offer-banner-container mb-6">
    <v-card
      :color="outlined ? undefined : color"
      :variant="outlined ? 'outlined' : 'flat'"
      class="special-offer-banner"
      :class="{ 'text-white': !outlined }"
    >
      <v-card-text class="py-4">
        <v-row align="center">
          <v-col cols="12" sm="auto" class="d-flex align-center">
            <v-icon icon="mdi-tag-outline" size="large" class="mr-2"></v-icon>
            <h3 class="text-h6 font-weight-bold mb-0">{{ title }}</h3>
          </v-col>
          
          <v-col cols="12" sm>
            <p class="mb-0">{{ description }}</p>
          </v-col>
          
          <v-col cols="12" sm="auto" class="d-flex align-center">
            <span class="mr-2">{{ codeLabel }}</span>
            <v-chip
              label
              color="white"
              text-color="secondary"
              class="font-weight-bold"
              @click="copyPromoCode"
            >
              {{ promoCode }}
              <v-icon end icon="mdi-content-copy" size="small"></v-icon>
            </v-chip>
          </v-col>
          
          <v-col cols="12" sm="auto" class="d-flex align-center text-caption">
            {{ expiryDate }}
          </v-col>
          
          <v-col cols="auto">
            <v-btn
              variant="text"
              icon="mdi-close"
              size="small"
              @click="closeBanner"
              :color="outlined ? undefined : 'white'"
            ></v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.special-offer-banner-container {
  width: 100%;
}

.special-offer-banner {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.special-offer-banner:hover {
  transform: translateY(-2px);
}
</style>
