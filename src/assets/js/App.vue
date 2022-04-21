<template>
  <el-tabs class="main-card" type="card">
    <el-tab-pane label="Learners">
      <el-row
        class="translation-item"
        v-for="(item, index) in learners"
        :key="index"
        @click.native="itemClicked(item)"
        :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
      >
        <span v-html="item"></span>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Examples">
      <el-row
        class="translation-item"
        v-for="(item, index) in examples"
        :key="index"
        @click.native="itemClicked(item)"
        :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
      >
        <span v-html="item"></span>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="Meanings">
      <el-row
        class="translation-item"
        v-for="(item, index) in meanings"
        :key="index"
        @click.native="itemClicked(item)"
        :style="`background-color:${isIncluesSeleted(item) ? '#98e8f5' : ''}`"
      >
        <span v-html="item"></span>
      </el-row>
    </el-tab-pane>
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
      items: [],
    };
  },
  computed: {
    learners() {
      return this.translation.learners;
    },
    examples() {
      return this.translation.examples;
    },
    meanings() {
      return this.translation.meanings;
    },
  },
  mounted() {
    console.log("mounted: ", this.translation);
  },
  methods: {
    isIncluesSeleted(item) {
      return this.items.indexOf(item) !== -1;
    },
    itemClicked(item) {
      if (this.isIncluesSeleted(item)) {
        let itemIndex = this.items.indexOf(item);
        this.items.splice(itemIndex, 1);
      } else this.items.push(item);
      console.log("item: ", item.replace(/<[^>]*>/g, ""));
    },
  },
};
</script>

<style scoped>
.translator-wraper [role="tablist"] {
  position: fixed;
  transform: translateY(-40px);
}
.translation-item {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 4px;
  margin: 0 0 4px 4px;
  cursor: pointer;
}

.main-card {
  overflow-y: scroll;
}
.main-card::-webkit-scrollbar {
  display: none;
}
</style>