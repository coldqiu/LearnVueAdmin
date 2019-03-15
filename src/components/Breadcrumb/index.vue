<template>
  <!--<el-scrollbar wrap-class="">-->
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  <!--</el-scrollbar>-->
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { generateTitle } from '@/utils/i18n'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // 默认 登陆后跳转到 /Dashboard 这时 路由没有 meta信息，只有name,redirect,regex
      let matched = this.$route.matched.filter(item => item.name)

      const first = matched[0]
      // 为什么加这个 if 判断， 去掉也可以吧？！ 恩应该不能去掉，
      // 登陆后重定向 会执行这个 if 从而给原本只有 name,redirect,regex 的$route.matched
      // 加上 { path: '/dashboard', meta: { title: 'Dashboard' }} 等数据,
      // 当正常（不是重定向）访问这个路由不会执行 if 中的内容，...
      // 为了在 breadcrumb中的 左侧 加一个 路由
      // 全部都加上首页路由
//      if (first && first.name !== 'dashboard') {
//      if (first && first.name !== 'Dashboard') {
      if (first && first.name) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }
      // 这个 filter 的作用？ 哪来的 item.meta.breadcrumb 可删掉吧
      // 暂且 放过这些细节， 先把握整体 3.13 breadcrumb 组件暂告一段时间，
      // 毕竟今天是为了理解 国际化的(已经基本了解整个流程）
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    },
    generateTitle
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
