<template>
  <div class="empty-avatar" :style="{ backgroundColor: bgColor }">
    {{ initials }}
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    default: 40
  }
});

// Generate initials from name
const initials = computed(() => {
  if (!props.name) return '?';
  
  // Split the name and get the first letter of each part
  const parts = props.name.split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

// Generate a color based on the name
const bgColor = computed(() => {
  if (!props.name) return '#cccccc';
  
  // Predefined colors that look good as avatar backgrounds
  const colors = [
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#F44336', // Red
    '#FF9800', // Orange
    '#00BCD4', // Cyan
    '#3F51B5', // Indigo
    '#009688', // Teal
    '#E91E63', // Pink
    '#607D8B'  // Blue Grey
  ];
  
  // Hash the name to generate a consistent color index
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use the hash to pick a color from the predefined list
  const colorIndex = Math.abs(hash) % colors.length;
  return colors[colorIndex];
});
</script>

<style scoped>
.empty-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  color: white;
  width: v-bind(size + 'px');
  height: v-bind(size + 'px');
  font-size: calc(v-bind(size / 2.2) + 'px');
  user-select: none;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}
</style>