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
            <el-button @click="handleOpenPermisson(scope.row)" type="primary" size="mini">设置权限</el-button>
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
            <el-input type="textarea" rows="2" v-model="addroleForm.remark" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="handleSumbit()">确 定</el-button>
          </span>
        </template>
      </el-dialog>

      <el-dialog title="设置权限" v-model="permissionModel">
        <el-form :model="permissionForm">

          <el-form-item label="角色名称" :label-width="110" prop="roleName">
            {{ crurentRoleName }}
          </el-form-item>
          <el-form-item label="权限列表" :label-width="110" prop="permissionlist">
            <el-tree ref="permissionTree" :data="menuList" show-checkbox default-expand-all
              :props="{ label: 'menuName' }" node-key="_id" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="permissionModel = false">取 消</el-button>
            <el-button type="primary" @click="handleUpdateSumbit()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import utils from "../utils/utils";

type RoleType = {
  _id: string;
  roleName: string;
  remark: string;
  createTime: string;
  updateTime: string;
  permissionlist: string[];
};

type MenuType = {
  _id: string;
  menuName: string;
  children: MenuType[];
};

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
      permissionModel: false,
      roleList: [],
      actionMaps: {},
      action: "", // create: 创建 edit:编辑 delete:删除
      crurentRoleName: "",
      crurentRoleId: "",
      addroleForm: {
        // roleName: "",
        // permissionlist: {},
        // remark: "",
      },
      permissionForm: {},
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
          formatter: (row) => {
            const list = row.permissionList?.halfCheckedKeys || [];
            let permission: string[] = []
            if (list && list.length > 0) {
              list.map((key) => {
                if (this.actionMaps[key]) permission.push(this.actionMaps[key])
              });
            }
            return permission.join(",");
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

      // Menu列表
      menuList: [],
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    // 获取角色
    async getRoleList() {
      try {
        let { list, page } = await this.$api.getRoleList({ ...this.queryRole, ...this.pager });
        this.roleList = list;
        this.pager = page;
      } catch (error) {
        this.$message.error(error.message);
      }
    },

    // 获取菜单
    async getMenuList() {
      try {
        this.menuList = await this.$api.getMenuList();
        this.actionMaps = this.getActionMaps(JSON.stringify(this.menuList));
        console.log(this.actionMaps);

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
          this.$message.success("操作成功");
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

    handleCurrentChange(curent) {
      this.pager.pageNum = curent;
      this.getRoleList();
    },


    // 编辑角色
    handleEdit(index, row) {
      this.action = "edit";
      this.roleModel = true;
      console.log(row);
      this.$nextTick(() => {
        this.addroleForm = { _id: row._id, roleName: row.roleName, remark: row.remark };
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
    handleReset(form: string | number) {
      this.$refs[form].resetFields();
    },

    getActionMaps(data) {
      data = JSON.parse(data);
      let actionMaps = {};
      let deep = (data) => {
        // data.map((item) => {
        //   if (item.children && item.action) {
        //     actionMaps.set(item._id, item.menuName);
        //   } else if (item.children && !item.action) {
        //     // actionMaps.set(item._id, item.menuName);
        //     deep(item.children);
        //   }
        // });
        while (data.length > 0) {
          let item = data.pop();
          if (item.children && item.action) {
            actionMaps[item._id] = item.menuName;
          } else if (item.children && !item.action) {
            // actionMaps.set(item._id, item.menuName);
            deep(item.children);
          }
        }
      };
      deep(data);
      return actionMaps
    },


    handleOpenPermisson(role) {
      this.permissionModel = true;
      const { _id, roleName } = role;
      this.crurentRoleName = roleName;
      this.crurentRoleId = _id;
      const checkedKeys = role.permissionList.checkedKeys
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(checkedKeys);
      });
    },

    handleUpdateSumbit() {
      const node: MenuType[] = this.$refs.permissionTree.getCheckedNodes();
      let checkedKeys: string[] = [];
      let HalfCheckedKeys: string[] = this.$refs.permissionTree.getHalfCheckedKeys();
      let parentKeys: string[] = [];

      node.map((item) => {
        if (!item.children) {
          checkedKeys.push(item._id)
        } else {
          parentKeys.push(item._id)
        }
      });

      let params = {
        _id: this.crurentRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: HalfCheckedKeys.concat(parentKeys),
        }
      }

      console.log(params);


      try {
        let ret = this.$api.roleUpdatePermission(params);
         this.permissionModel = false;
        this.getRoleList();
        this.$message.success("设置权限成功！")
      } catch (error) {
        this.$message.error(error)
      }

    }
  },
};
</script>

<style scoped>
</style>
