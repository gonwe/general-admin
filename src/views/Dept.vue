<template>
  <div class="base-warpper">
    <div class="query-form">
      <el-form :inline="true" ref="queryFrom" :model="queryDept">
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="queryDept.deptName" placeholder="部门名称"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getDeptList()">查询</el-button>
          <el-button @click="handleReset('queryFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>

      <!-- 表格主体 -->
      <el-table :data="deptList" row-key="_id" default-expand-all>
        <el-table-column v-for="item of columns" :key="item.prop" :prop="item.prop" :label="item.label"
          :width="item.width" :formatter="item.formatter">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" icon-color="#FF0000"
              :title="`删除${scope.row.deptName}?`" @confirm="handleDel(scope.row._id)">
              <template #reference>
                <el-button type="danger" size="mini">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="action == 'create' ? '新增部门' : '编辑部门'" v-model="deptModel">
        <el-form :model="deptForm" ref="deptFormAdd" :rules="rules">

          <el-form-item label="上级部门" :label-width="110" prop="parentId">
            <el-cascader placeholder="请选择上级部门" :options="deptList" v-model="deptForm.parentId"
              :props="{ checkStrictly: true, label: 'deptName', value: '_id' }" clearable></el-cascader>
          </el-form-item>

          <el-form-item label="部门名称" :label-width="110" prop="deptName">
            <el-input v-model="deptForm.deptName" placeholder="请输入部门名称"></el-input>
          </el-form-item>

          <el-form-item label="部门负责人" :label-width="110" prop="userName">
            <el-select v-model="deptForm.user" placeholder="请选择负责人" @change="handleChange" clearable>
              <el-option v-for="item in userList" :key="item.userId" :label="item.userName" :value="item.userId" />
            </el-select>

          </el-form-item>
          <el-form-item label="负责人邮箱" :label-width="110">
            <el-input v-model="deptForm.userEmail" placeholder="请输入邮箱" disabled></el-input>
          </el-form-item>

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
  name: "dept",
  data() {
    return {
      queryDept: {},
      deptModel: false,
      deptList: [],
      userList: [],
      deptForm: {
        deptName: "",
        userName: "",
        userEmail: "",
      },
      action: "", // create: 创建 edit:编辑 delete:删除
      rules: {
        parentId: [{ required: false, message: "请选择上级部门", trigger: "change" }],
        deptName: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 2, max: 10, message: "最大输入8个字符", trigger: "blur" },
        ],
        userName: [{ required: true, message: "请选择负责人", trigger: "change" }],
      },
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
        },
        {
          label: "部门负责人",
          prop: "userName",
        },
        {
          label: "创建时间",
          prop: "createTime",
          width: 180,
          formatter: (row, colunm, value) => {
            return utils.formatDate(new Date(value));
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          width: 180,
          formatter: (row, colunm, value) => {
            return utils.formatDate(new Date(value));
          },
        },
      ],

    };
  },

  mounted() {
    this.getDeptList();
    this.getUserList();
  },
  methods: {

    async getDeptList() {
      try {
        let list = await this.$api.getDeptList(this.queryDept);
        this.deptList = list;
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    async getUserList() {
      try {
        this.userList = await this.$api.getAllUserList();
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    handleAdd() {
      this.action = "create";
      this.deptModel = true;
    },

    handleEdit(row) {
      this.action = "edit";
      this.deptModel = true;
      console.log(row);
      this.$nextTick(() => {
        Object.assign(this.deptForm, row, {
          user: parseInt(row.userId),
        });

      });
    },

    handleSumbit() {
      this.$refs.deptFormAdd.validate(async (vaild) => {
        if (vaild) {
          let { deptForm, action } = this;
          delete deptForm.user;
          let params = { ...deptForm, action };
          let ret = await this.$api.deptSumbit(params);
          if (ret) {
            this.$message.success("操作成功");
            this.handleClose();
            this.getDeptList();
          };
        }
      });
    },

    async handleDel(_id) {
      try {
        await this.$api.deptSumbit({ _id, action: "delete" });
        this.$message("删除成功！");
      } catch (error) {
      } finally {
        this.getDeptList();
      }
    },

    handleChange(val) {
      console.log(val);
      const { userName, userEmail, userId } = this.userList.filter(item => item.userId === val)[0];
      Object.assign(this.deptForm, { userName, userEmail, userId });
    },


    handleClose() {
      this.deptModel = false;
      delete this.deptForm.user;
      this.handleReset("deptFormAdd");
    },

    handleReset(form) {
      this.$refs[form].resetFields();
    },
  },
};
</script>