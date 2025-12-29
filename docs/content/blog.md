---
title: Blog
sidebar: false
layout: home
---

<script setup>
import { data as posts } from "../data/blogs.data";
import Blog from "../components/Blog/index.vue"
</script>

<Blog :data="posts"/>

