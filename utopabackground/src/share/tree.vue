<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-tree 
		:data="treeData" 
		:props="defaultProps"
		@node-click="handleNodeClick"
		node-key="id"
		:draggable="draggable"
		default-expand-all
		@node-drop="handleDrop"
		:allow-drop="allowDrop"
		 @node-drag-end="handleDragEnd"
		></el-tree>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["draggable"],
  inject:['reload'],
  data() {
    return {
      defaultProps: {
        label: "name",
        children: "childs",
        value: "id"
	  },
    };
  },
  created() {
	this.initTree();
  },
  methods: {
    ...mapActions("treeEle", ["initTree","save"]),
     handleNodeClick(data) {
	 },
      handleDrop(draggingNode, dropNode, dropType, ev) {
		  this.$store.commit('treeEle/dragObj',{draggingNode, dropNode, dropType});
      },
      allowDrop(draggingNode, dropNode, type) {
        if (draggingNode.data.parentId == dropNode.data.parentId) {
          return type !== 'inner';
        }
      },
      
	   handleDragEnd(draggingNode, dropNode, dropType, ev) {
		//  console.log(draggingNode, dropNode, dropType)
		if(dropType !=='none'){
			this.save({catalogs:this.catalogs}).then(v=>{this.reload()}).catch(v=>{this.reload()})
		}
        
      },
    
  },
  computed: {
    ...mapState("treeEle", { treeData: "treeData",catalogs:"catalogs" })
  },
  watch: {}
};
</script>

<style scoped>
</style>
