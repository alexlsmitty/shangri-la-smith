<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: 'We are currently using cached data due to a temporary connection issue. Some features may be limited.'
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  timeout: {
    type: Number,
    default: 0 // 0 means no auto-dismiss
  }
});

const emit = defineEmits(['dismiss']);

const visible = ref(props.show);
let dismissTimer = null;

// Handle auto-dismiss if timeout is set
onMounted(() => {
  if (props.timeout > 0 && props.show) {
    dismissTimer = setTimeout(() => {
      dismissNotification();
    }, props.timeout);
  }
});

// Clean up timers if component is unmounted
onUnmounted(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
});

// Watch for changes to show prop
watch(() => props.show, (newValue) => {
  visible.value = newValue;
  
  // Reset timer if needed
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  
  if (newValue && props.timeout > 0) {
    dismissTimer = setTimeout(() => {
      dismissNotification();
    }, props.timeout);
  }
});

// Handle manual dismiss
const dismissNotification = () => {
  visible.value = false;
  emit('dismiss');
};
</script>

<template>
  <div v-if="visible" class="fallback-notification">
    <v-alert
      type="warning"
      variant="tonal"
      border="start"
      closable
      :close-label="dismissible ? 'Dismiss' : ''"
      @click:close="dismissible ? dismissNotification() : null"
    >
      <div class="d-flex align-center">
        <v-icon icon="mdi-cloud-off-outline" size="24" class="mr-3"></v-icon>
        <div>
          <p class="text-body-1 mb-0">{{ message }}</p>
          <p class="text-caption mt-1">
            <slot name="sub-message">Please check your connection and try again later.</slot>
          </p>
        </div>
      </div>
    </v-alert>
  </div>
</template>

<style scoped>
.fallback-notification {
  position: fixed;
  bottom: 24px;
  left: 24px;
  right: 24px;
  z-index: 1000;
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .fallback-notification {
    bottom: 16px;
    left: 16px;
    right: 16px;
  }
}
</style>
