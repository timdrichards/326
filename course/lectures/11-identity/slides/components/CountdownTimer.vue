<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    seconds?: number
    minutes?: number
    label?: string
    autoStart?: boolean
    warnAt?: number
    x?: number
    y?: number
    width?: number
  }>(),
  {
    seconds: 300,
    minutes: undefined,
    label: 'Activity',
    autoStart: false,
    warnAt: 60,
    x: 16,
    y: 14,
    width: 216,
  }
)

const initialSeconds = computed(() => {
  const sourceSeconds =
    props.minutes !== undefined
      ? Math.floor(props.minutes * 60)
      : Math.floor(props.seconds)

  return Math.max(1, sourceSeconds)
})
const remainingSeconds = ref(initialSeconds.value)
const isRunning = ref(false)
const finished = ref(false)
const rootEl = ref<HTMLElement | null>(null)
const positionX = ref(props.x)
const positionY = ref(props.y)
const panelWidth = ref(props.width)

let intervalId: number | null = null
let resumeWhenVisible = false
let visibilityObserver: IntersectionObserver | null = null
let dragPointerId: number | null = null
let resizePointerId: number | null = null
let dragStartX = 0
let dragStartY = 0
let startLeft = 0
let startTop = 0
let resizeStartX = 0
let resizeStartWidth = 0

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

const progressPercent = computed(() => {
  return Math.max(0, Math.min(100, (remainingSeconds.value / initialSeconds.value) * 100))
})

const statusText = computed(() => {
  if (finished.value) return 'Time is up'
  if (remainingSeconds.value <= props.warnAt) return 'Wrap up'
  if (isRunning.value) return 'Running'
  return 'Ready'
})

const panelStyle = computed(() => ({
  top: `${positionY.value}px`,
  right: `${positionX.value}px`,
  width: `${panelWidth.value}px`,
}))

const stopTimer = () => {
  if (intervalId !== null) {
    window.clearInterval(intervalId)
    intervalId = null
  }
  isRunning.value = false
}

const tick = () => {
  if (remainingSeconds.value <= 1) {
    remainingSeconds.value = 0
    finished.value = true
    stopTimer()
    return
  }

  remainingSeconds.value -= 1
}

const startTimer = () => {
  if (isRunning.value || remainingSeconds.value <= 0) return

  finished.value = false
  isRunning.value = true
  intervalId = window.setInterval(tick, 1000)
}

const pauseTimer = () => {
  stopTimer()
}

const resetTimer = () => {
  stopTimer()
  remainingSeconds.value = initialSeconds.value
  finished.value = false
}

const toggleTimer = () => {
  if (isRunning.value) {
    pauseTimer()
    return
  }

  startTimer()
}

watch(initialSeconds, nextValue => {
  remainingSeconds.value = nextValue
  finished.value = false
  stopTimer()
})

watch(
  () => props.x,
  value => {
    positionX.value = value
  }
)

watch(
  () => props.y,
  value => {
    positionY.value = value
  }
)

watch(
  () => props.width,
  value => {
    panelWidth.value = value
  }
)

const clampPosition = () => {
  const root = rootEl.value
  const parent = root?.offsetParent as HTMLElement | null
  if (!root || !parent) return

  const maxRight = Math.max(0, parent.clientWidth - root.offsetWidth)
  const maxTop = Math.max(0, parent.clientHeight - root.offsetHeight)

  positionX.value = Math.min(Math.max(0, positionX.value), maxRight)
  positionY.value = Math.min(Math.max(0, positionY.value), maxTop)
}

const stopDragging = () => {
  dragPointerId = null
  clampPosition()
}

const stopResizing = () => {
  resizePointerId = null
  clampPosition()
}

const onDragPointerDown = (event: PointerEvent) => {
  const target = event.target as HTMLElement | null
  if (target?.closest('button') || target?.closest('.timer-resize-handle')) return

  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartY = event.clientY
  startLeft = positionX.value
  startTop = positionY.value
  rootEl.value?.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const onResizePointerDown = (event: PointerEvent) => {
  resizePointerId = event.pointerId
  resizeStartX = event.clientX
  resizeStartWidth = panelWidth.value
  rootEl.value?.setPointerCapture(event.pointerId)
  event.preventDefault()
}

const onPointerMove = (event: PointerEvent) => {
  if (dragPointerId === event.pointerId) {
    positionX.value = Math.max(0, startLeft - (event.clientX - dragStartX))
    positionY.value = Math.max(0, startTop + (event.clientY - dragStartY))
    clampPosition()
    return
  }

  if (resizePointerId === event.pointerId) {
    panelWidth.value = Math.min(420, Math.max(160, resizeStartWidth - (event.clientX - resizeStartX)))
    clampPosition()
  }
}

const onPointerUp = (event: PointerEvent) => {
  if (dragPointerId === event.pointerId) {
    stopDragging()
  }

  if (resizePointerId === event.pointerId) {
    stopResizing()
  }
}

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)

  visibilityObserver = new IntersectionObserver(
    entries => {
      const isVisible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.6)

      if (!isVisible) {
        resumeWhenVisible = isRunning.value
        stopTimer()
        return
      }

      if ((resumeWhenVisible || props.autoStart) && !finished.value && remainingSeconds.value > 0) {
        startTimer()
      }
      resumeWhenVisible = false
    },
    { threshold: [0.6] }
  )

  if (rootEl.value) {
    visibilityObserver.observe(rootEl.value)
  }
})

onBeforeUnmount(() => {
  stopTimer()
  visibilityObserver?.disconnect()
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
  window.removeEventListener('pointercancel', onPointerUp)
})
</script>

<template>
  <div
    ref="rootEl"
    class="countdown-timer"
    :class="{
      'is-running': isRunning,
      'is-warning': remainingSeconds <= warnAt && !finished,
      'is-finished': finished,
    }"
    :style="panelStyle"
    @pointerdown="onDragPointerDown"
  >
    <div class="timer-topline">
      <span class="timer-label">{{ label }}</span>
      <span class="timer-status">{{ statusText }}</span>
    </div>

    <div class="timer-face">
      {{ formattedTime }}
    </div>

    <div class="timer-progress" aria-hidden="true">
      <div class="timer-progress-fill" :style="{ width: `${progressPercent}%` }" />
    </div>

    <div class="timer-controls">
      <button class="timer-button timer-button-primary" @click="toggleTimer">
        {{ isRunning ? 'Pause' : remainingSeconds === initialSeconds ? 'Start' : 'Resume' }}
      </button>
      <button class="timer-button" @click="resetTimer">Reset</button>
    </div>

    <div
      class="timer-resize-handle"
      title="Drag to resize"
      @pointerdown.stop="onResizePointerDown"
    />
  </div>
</template>

<style scoped>
.countdown-timer {
  position: absolute;
  top: 0.9rem;
  right: 1rem;
  z-index: 30;
  min-width: 10rem;
  max-width: min(26rem, calc(100% - 1rem));
  padding: 0.6rem 0.68rem 0.68rem;
  border: 1px solid rgb(255 255 255 / 0.26);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 0.3), rgb(255 255 255 / 0.12)),
    linear-gradient(135deg, rgb(14 116 144 / 0.16), rgb(15 23 42 / 0.18));
  box-shadow:
    0 12px 28px rgb(15 23 42 / 0.12),
    inset 0 1px 0 rgb(255 255 255 / 0.28);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.countdown-timer:active {
  cursor: grabbing;
}

.timer-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.timer-label,
.timer-status {
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.timer-label {
  color: rgb(15 23 42 / 0.72);
  font-weight: 700;
}

.timer-status {
  color: rgb(14 116 144 / 0.9);
  font-weight: 600;
}

.timer-face {
  margin-bottom: 0.48rem;
  color: rgb(15 23 42 / 0.94);
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  font-size: 1.45rem;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  line-height: 1;
}

.timer-progress {
  height: 0.3rem;
  margin-bottom: 0.54rem;
  overflow: hidden;
  background: rgb(255 255 255 / 0.3);
  border-radius: 999px;
  box-shadow: inset 0 1px 2px rgb(15 23 42 / 0.08);
}

.timer-progress-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0ea5e9, #10b981);
  transition: width 0.9s linear, background-color 0.3s ease;
}

.timer-controls {
  display: flex;
  gap: 0.35rem;
}

.timer-button {
  appearance: none;
  border: 1px solid rgb(15 23 42 / 0.08);
  border-radius: 999px;
  padding: 0.28rem 0.56rem;
  background: rgb(255 255 255 / 0.45);
  color: rgb(15 23 42 / 0.88);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.timer-button:hover {
  transform: translateY(-1px);
  background: rgb(255 255 255 / 0.62);
}

.timer-button-primary {
  background: rgb(14 116 144 / 0.14);
  border-color: rgb(14 116 144 / 0.18);
  color: rgb(12 74 110 / 0.95);
}

.timer-resize-handle {
  position: absolute;
  right: 0.18rem;
  bottom: 0.18rem;
  width: 0.95rem;
  height: 0.95rem;
  border-radius: 999px;
  background:
    linear-gradient(135deg, rgb(14 116 144 / 0.65), rgb(255 255 255 / 0.75));
  box-shadow: 0 2px 10px rgb(15 23 42 / 0.16);
  cursor: nwse-resize;
}

.is-warning .timer-status {
  color: rgb(180 83 9 / 0.95);
}

.is-warning .timer-progress-fill {
  background: linear-gradient(90deg, #f59e0b, #f97316);
}

.is-finished .timer-status {
  color: rgb(185 28 28 / 0.95);
}

.is-finished .timer-progress-fill {
  background: linear-gradient(90deg, #ef4444, #fb7185);
}
</style>
