<template>
  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane label="Learners">
      <el-row v-for="(item, index) in learners" :key="index">
        <el-col :span="18">
          <el-checkbox v-model="items.learners" v-html="item"></el-checkbox>
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>

<script>
import { Tabs, TabPane, Row, Col, Checkbox } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
export default {
  components: {
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-row": Row,
    "el-col": Col,
    "el-checkbox": Checkbox,
  },
  props: ["translation"],
  data() {
    return {
      activeName: "first",
      items: {
        learners: [],
        examples: [],
        meanings: [],
      },
    };
  },
  computed: {
    learners() {
      return this.translation.learners;
    },
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style>
</style>