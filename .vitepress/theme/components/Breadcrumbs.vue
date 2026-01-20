<template>
  <nav class="VPBreadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumb-list">
      <li v-for="(item, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <a v-if="item.link" :href="item.link" class="breadcrumb-link">{{ item.text }}</a>
        <span v-else class="breadcrumb-current">{{ item.text }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

const breadcrumbs = computed(() => {
  const path = page.value.relativePath
  const segments = path.split('/')
  
  const result = []
  let currentPath = ''
  
  result.push({
    text: '首页',
    link: '/'
  })
  
  for (let i = 0; i < segments.length - 1; i++) {
    currentPath += segments[i]
    const text = segments[i].charAt(0).toUpperCase() + segments[i].slice(1)
    result.push({
      text: text,
      link: '/' + currentPath + '/'
    })
    currentPath += '/'
  }
  
  const fileName = segments[segments.length - 1].replace(/\.md$/, '')
  const pageTitle = frontmatter.value.title || fileName.charAt(0).toUpperCase() + fileName.slice(1)
  
  result.push({
    text: pageTitle,
    link: null
  })
  
  return result
})
</script>

<style scoped>
.VPBreadcrumbs {
  padding: 0px 16px 4px
  margin: 0;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--vp-c-brand);
}

.breadcrumb-current {
  color: var(--vp-c-text-1);
  font-weight: 500;
}

.breadcrumb-separator {
  margin: 0 8px;
  color: var(--vp-c-text-3);
}

@media (max-width: 768px) {
  .VPBreadcrumbs {
    padding: 8px 16px;
  }
  
  .breadcrumb-list {
    font-size: 12px;
  }
}
</style>
