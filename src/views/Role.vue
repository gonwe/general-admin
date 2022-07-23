<template>
  <div class="base-warpper">
    <div class="query-form">
      <el-form :inline="true" ref="queryFrom" :model="queryRole">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryRole.roleName" placeholder="角色名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getRoleList()">查询</el-button>
          <el-button @click="handleReset('queryFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>

      <!-- 表格主体 -->
      <el-table :data="roleList">
        <el-table-column v-for="item of columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button @click="handleEdit(2, scope.row)">编辑</el-button>
            <el-button @click="handleSet(scope.row)" type="primary" size="mini">设置权限</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>


      </el-table>
      <div class="pagination">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange"
          :currentPage="pager.pageNum" :total="pager.total">
        </el-pagination>
      </div>
      <el-dialog :title="action == 'create' ? '新增角色' : '编辑角色'" v-model="roleModel">
        <el-form :model="addroleForm" ref="roleFormAdd" :rules="rules">

          <el-form-item label="角色名称" :label-width="110" prop="roleName">
            <el-input v-model="addroleForm.roleName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="备注说明" :label-width="110" prop="remark">
            <el-input v-model="addroleForm.remark" placeholder="请输入"></el-input>
          </el-form-item>
          <!-- <el-form-item label="权限列表" :label-width="110" prop="permissionlist">
            <el-input v-model="addroleForm.permissionlist" placeholder="请输入"></el-input>
          </el-form-item> -->
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="handleSumbit()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import utils from "../utils/utils";

export default {
  name: "role",
  data() {
    return {
      queryRole: {},
      pager: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      roleModel: false,
      roleList: [],
      action: "", // create: 创建 edit:编辑 delete:删除
      addroleForm: {
        roleName: "",
        permissionlist: [],
        remark: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 2, max: 10, message: "最大输入8个字符", trigger: "blur" },
        ],
      },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionlist",
          formatter: (row,columns,value) => {
            return value.permissionlist.join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 180,
          formatter: (row, colunm, value) => {
            return utils.formatDate(new Date(value));
          },
        },
      ],
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取角色
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleList(this.queryRole);
        this.roleList = list;
        this.pager = page;
      } catch (error) {
        throw new Error(error);
      }
    },

    // 提交角色
    handleSumbit() {
      this.$refs.roleFormAdd.validate(async (vaild) => {
        if (vaild) {
          let { addroleForm, action } = this;
          let params = { ...addroleForm, action };
          await this.$api.roleSumbit(params);
          this.handleClose();
          this.getRoleList();
        }
      });
    },

    // 新增角色
    handleAdd(type, row) {
      this.action = "create";
      this.roleModel = true;
    },

    /** 设置权限 */
    handleSet(row) {
      this.action = "edit";
      this.roleModel = true;
      this.$nextTick(() => {
        Object.assign(this.addroleForm, row);
      });
    },

    /** 删除权限 */
    async handleDel(_id) {
      await this.$api.roleSumbit({ _id, action: "delete" });
      this.$message("删除成功！");
      this.getRoleList();
    },

    /** 角色关闭 */
    handleClose() {
      this.roleModel = false;
      this.handleReset("roleFormAdd");
    },
    /** 搜索重置 */
    handleReset(form) {
      this.$refs[form].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
