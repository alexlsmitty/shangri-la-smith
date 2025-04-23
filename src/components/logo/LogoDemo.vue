<template>
  <div class="logo-demo">
    <h2>Shangri-La Logo Demo</h2>
    
    <div class="logo-section">
      <h3>Default Logo (White)</h3>
      <div class="logo-container dark-bg">
        <ShangriLaLogo />
      </div>
    </div>
    
    <div class="logo-section">
      <h3>Brand Color Logo</h3>
      <div class="logo-container light-bg">
        <ShangriLaLogo color="#00a69c" />
      </div>
    </div>
    
    <div class="logo-section">
      <h3>Different Sizes</h3>
      <div class="logo-row">
        <div class="logo-container dark-bg">
          <ShangriLaLogo width="100" height="33" />
          <span class="size-label">Small</span>
        </div>
        <div class="logo-container dark-bg">
          <ShangriLaLogo width="200" height="65" />
          <span class="size-label">Medium</span>
        </div>
        <div class="logo-container dark-bg">
          <ShangriLaLogo width="300" height="98" />
          <span class="size-label">Large</span>
        </div>
      </div>
    </div>
    
    <div class="logo-section">
      <h3>Flower Logo Only</h3>
      <div class="logo-row">
        <div class="logo-container dark-bg">
          <ShangriLaFlower width="100" height="100" />
          <span class="size-label">White</span>
        </div>
        <div class="logo-container light-bg">
          <ShangriLaFlower width="100" height="100" color="#00a69c" />
          <span class="size-label">Primary Color</span>
        </div>
        <div class="logo-container light-bg">
          <ShangriLaFlower width="100" height="100" color="#0d2e4d" />
          <span class="size-label">Dark Color</span>
        </div>
      </div>
    </div>
    
    <div class="code-section">
      <h3>Usage Example</h3>
      <pre><code>
// Import the logo components
import { ShangriLaLogo, ShangriLaFlower } from '@/components/logo';

// Or import just the full logo (default export)
import ShangriLaLogo from '@/components/logo';

// In your template:
&lt;ShangriLaLogo 
  width="200"
  height="65"
  color="#00a69c"
  className="my-custom-class"
/&gt;

// Flower only version
&lt;ShangriLaFlower
  width="100"
  height="100"
  color="#00a69c"
  className="my-custom-class"
/&gt;
      </code></pre>
    </div>
  </div>
</template>

<script setup>
import ShangriLaLogo from './ShangriLaLogo.vue';
import ShangriLaFlower from './ShangriLaFlower.vue';
</script>

<style scoped>
.logo-demo {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  font-family: var(--shangri-la-body-font, 'Montserrat', sans-serif);
}

h2, h3 {
  color: var(--shangri-la-deep-blue, #0d2e4d);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  margin-bottom: 2rem;
}

.logo-container {
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
}

.dark-bg {
  background-color: var(--shangri-la-teal-dark, #00756e);
}

.light-bg {
  background-color: var(--shangri-la-bg-light, #f8f9fa);
  border: 1px solid #eaeaea;
}

.logo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.logo-row .logo-container {
  flex: 1;
  min-width: 200px;
}

.size-label {
  position: absolute;
  bottom: 5px;
  right: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.light-bg .size-label {
  color: rgba(0, 0, 0, 0.5);
}

.code-section {
  background-color: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
}

pre {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  border: 1px solid #eaeaea;
}

code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
}

@media (max-width: 768px) {
  .logo-row {
    flex-direction: column;
  }
}
</style>
