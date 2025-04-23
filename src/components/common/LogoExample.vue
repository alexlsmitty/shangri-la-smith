<template>
  <div class="logo-example">
    <h2>Logo Usage Examples</h2>
    
    <div class="example-row">
      <div class="example">
        <h3>Default (White)</h3>
        <div class="dark-bg">
          <ShangriLaLogo />
        </div>
      </div>
    </div>
    
    <div class="example-row">
      <div class="example">
        <h3>Custom Size</h3>
        <ShangriLaLogo :width="300" :height="100" color="#00a69c" />
      </div>
      
      <div class="example">
        <h3>Resort Teal</h3>
        <ShangriLaLogo :width="300" :height="100" color="#00a69c" />
      </div>
    </div>
    
    <div class="example-row">
      <div class="example">
        <h3>Light Background</h3>
        <ShangriLaLogo :width="300" :height="100" color="#000000" />
      </div>
      
      <div class="example">
        <h3>Accent Color</h3>
        <ShangriLaLogo :width="300" :height="100" color="#ff7d5e" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ShangriLaLogo from './ShangriLaLogo.vue';
</script>

<style scoped>
.logo-example {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.example-row {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.example {
  flex: 1;
  min-width: 300px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.dark-bg {
  background-color: #00695c;
  padding: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
}
</style>
