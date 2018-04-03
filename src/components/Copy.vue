<template>
<div class="copy-component">
  <el-tooltip :content="content" :open-delay="delay" :effect="color" :placement="placement">
    <div class="copy" @click="copy" :data-clipboard-text="content">
      <slot></slot>
    </div>
  </el-tooltip>
</div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  props: {
    content: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      default: 300
    },
    color: {
      type: String,
      default: 'light'
    },
    placement: {
      type: String,
      default: 'top'
    }
  },
  methods: {
    copy () {
      let clipboard = new Clipboard('.copy')

      clipboard.on('success', e => {
        this.$message.success('复制图片路径成功')
        e.clearSelection()
        clipboard.destroy()
      })

      clipboard.on('error', e => {
        this.$message.error('复制图片路径失败')
        console.error('Action:', e.action)
        clipboard.destroy()
      })
    }
  }
}
</script>

<style lang="scss">
.copy-component {
  .copy {
    cursor: pointer;
  }
}
</style>
