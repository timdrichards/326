<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>

<template>
  <div class="course-callout">
    <strong v-if="title">{{ title }}</strong>
    <slot />
  </div>
</template>

<style scoped>
.course-callout {
  border-left: 6px solid var(--c326-accent, #0b6e4f);
  background: #f3f7f5;
  padding: 0.8rem 1rem;
  margin: 0.75rem 0;
}
</style>
