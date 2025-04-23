<template>
  <svg 
    :width="width" 
    :height="height" 
    viewBox="0 0 350 350" 
    xmlns="http://www.w3.org/2000/svg"
    :class="className"
    aria-label="Shangri-La Beach Resort Flower Logo"
    role="img"
  >
    <g :fill="color" :stroke="color" stroke-width="0">
      <!-- Hibiscus Flower Only -->
      <path d="M235.5,178.5c24-30,27-83,25-102s-11-22-15-22s-16-1-24-5s-7-15-25-16s-41,17-48,23c-9,5-25,9-30,21s8,35,10,40s20,30,26,39  c-15-12-37-34-45-40s-29-11-41,10c-28,5-43,19-44,27s7,22,15,30c-6,14-10,22-8,33s13,23,37,25s75-7,87-11c-25,10-60,30-69,37  s-33,39,8,56c0,20,13,38,38,32c8,24,22,34,46,22c16,19,87,53,77-81c35,74,57,67,60,66s15-5,22-3s37,9,54-22c-6-17-8-16-6-26  s6-15,6-29s-16-27-44-34s-41-10-55-19c26,6,132,25,112-45c23-18-3-45-25-47c1-21-40-66-96,33c23-12,42-12,42-12s-36,14-47,23  c20-2,48-14,70-8c-19,7-69,15-79,24c16,5,47-6,66,5c-30-1-73,1-85,18c14,9,60,20,67,44c-26-20-55-30-69-32c6,9,35,31,38,46  c-24-19-25-32-54-44c-11,11-13,40-14,60c-7-21-5-42-3-59c-13,6-38,50-43,64c-1-19,19-58,33-67c-19,0-46,26-57,38c0-22,51-48,59-52  c-15-7-81-31-89-41c21,2,53,21,77,21c-7-15-54-32-68-36c27-6,68,20,77,30c2-16-17-39-28-53c20,12,32,33,37,41c0-18-17-52-30-68  c23,14,36,44,38,61c6-19,2-47-11-73C234.5,117.5,232.5,148.5,235.5,178.5z" />
      <path d="M317.5,48.5c0,0-39,110-90,158c-12,12-7,28,15,8S318.5,87.5,317.5,48.5z" />
      <path d="M338.5,67.5c0,4.97-4.03,9-9,9s-7-4.03-7-9s3.03-6,8-6S338.5,62.53,338.5,67.5z" />
      <ellipse cx="325.5" cy="23.5" rx="8" ry="9" />
      <ellipse cx="287" cy="78" rx="8.5" ry="7.5" />
      <circle cx="327" cy="90" r="7.5" />
      <circle cx="296.5" cy="58.5" r="8" />
      <ellipse cx="305.5" cy="37.5" rx="9" ry="7" />
      <circle cx="334.5" cy="45.5" r="8" />
    </g>
  </svg>
</template>

<script setup>
/**
 * ShangriLaFlower Component
 * 
 * A Vue component that renders just the hibiscus flower part of the 
 * Shangri-La Beach Resort logo, with customizable size and color.
 * 
 * @example
 * <ShangriLaFlower width="100" height="100" color="#00a69c" />
 */

// Define props with default values
defineProps({
  /** Width of the logo in pixels or other CSS units */
  width: {
    type: [Number, String],
    default: 100
  },
  /** Height of the logo in pixels or other CSS units */
  height: {
    type: [Number, String],
    default: 100
  },
  /** Color of the logo - can be any valid CSS color */
  color: {
    type: String,
    default: '#ffffff'
  },
  /** Additional CSS classes to apply to the SVG */
  className: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
svg {
  display: inline-block;
  vertical-align: middle;
  transition: transform 0.3s ease;
}

svg:hover {
  transform: scale(1.05);
}
</style>
