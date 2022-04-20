<template>
  <el-tabs class="main-card" type="card" @tab-click="handleClick">
    <el-tab-pane label="Learners">
      <el-row
        class="translation-item"
        v-for="(item, index) in learners"
        :key="index"
      >
        <span v-html="item"></span>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Config">Config</el-tab-pane>
    <el-tab-pane label="Role">Role</el-tab-pane>
    <el-tab-pane label="Task">Task</el-tab-pane>
  </el-tabs>
</template>

<script>
import { Tabs, TabPane, Row, Checkbox, CheckboxGroup } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
export default {
  components: {
    "el-tabs": Tabs,
    "el-tab-pane": TabPane,
    "el-row": Row,
    "el-checkbox": Checkbox,
    "el-checkbox-group": CheckboxGroup,
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

<style scoped>
.translation-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 4px;
  margin: 0 0 4px 4px;
}

.main-card {
  overflow-y: scroll;
}
.main-card::-webkit-scrollbar{
  display: none;
}
</style>