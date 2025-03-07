<template>
    <div ref="container" class="route-base">
        
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import type { RouteRenderer } from '../services/router-register'

const props = defineProps<{
    renderer: RouteRenderer,
}>()

const container = ref<HTMLElement | null>(null)

onMounted(async () => {
    await nextTick();
    container.value && props.renderer.mount(container.value)
})

onUnmounted(() => {
    props.renderer.dispose()
})
</script>