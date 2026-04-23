# Beangle BUI 标签参考

Beangle BUI 提供了丰富的 Freemarker 标签，用于快速构建现代化的 Web 应用界面。本文档详细介绍了所有可用的标签及其使用方法。

## 标签分类

### 1. 基础标签

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.anchor` | 锚点链接 | `[@b.anchor href="!info?id=4" target="_blank"]链接文本[/@]` |
| `@b.div` | 异步容器 | `[@b.div href="!info?id=1" id="infoDiv"/]` |
| `@b.hairLine` | 分隔线 | `[@b.hairLine/]` |
| `@b.iframe` | 内联框架 | `[@b.iframe src="/page" width="100%" height="500px"/]` |

### 2. 布局标签

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.row` | 行容器 | `[@b.row][@b.col]内容[/@][/@]` |
| `@b.col` | 列容器 | `[@b.col span="6"]内容[/@]` |
| `@b.boxcol` | 带边框的列 | `[@b.boxcol title="标题"]内容[/@]` |
| `@b.card` | 卡片容器 | `[@b.card][@b.cardHeader]标题[/@][@b.cardBody]内容[/@][/@]` |
| `@b.cardHeader` | 卡片头部 | `[@b.cardHeader]标题[/@]` |
| `@b.cardBody` | 卡片内容 | `[@b.cardBody]内容[/@]` |
| `@b.cardFooter` | 卡片底部 | `[@b.cardFooter]底部内容[/@]` |
| `@b.cardTools` | 卡片工具 | `[@b.cardTools]工具按钮[/@]` |
| `@b.nav` | 导航容器 | `[@b.nav][@b.navitem]菜单项[/@][/@]` |
| `@b.navbar` | 导航栏 | `[@b.navbar][@b.navitem]菜单项[/@][/@]` |
| `@b.navitem` | 导航项 | `[@b.navitem href="/page"]菜单项[/@]` |
| `@b.tabs` | 标签页容器 | `[@b.tabs][@b.tab]标签内容[/@][/@]` |
| `@b.tab` | 标签页 | `[@b.tab title="标签1"]内容[/@]` |
| `@b.toolbar` | 工具栏 | `[@b.toolbar title="工具栏"]工具栏内容[/@]` |

### 3. 表单标签

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.form` | 表单容器 | `[@b.form action="!save" method="post"][/@]` |
| `@b.field` | 表单字段 | `[@b.field name="name" label="姓名"][@b.textfield name="name"/][/@]` |
| `@b.fieldset` | 字段集 | `[@b.fieldset title="基本信息"][/@]` |
| `@b.textfield` | 文本输入框 | `[@b.textfield name="name" value="默认值" placeholder="请输入"/]` |
| `@b.password` | 密码输入框 | `[@b.password name="password" placeholder="请输入密码"/]` |
| `@b.textarea` | 文本域 | `[@b.textarea name="description" rows="4" placeholder="请输入描述"/]` |
| `@b.select` | 下拉选择框 | `[@b.select name="category" options="${categories}" value="${selected}"/]` |
| `@b.select2` | 增强下拉选择框 | `[@b.select2 name="tags" options="${tags}" multiple="true"/]` |
| `@b.checkbox` | 复选框 | `[@b.checkbox name="enabled" value="true" checked="${user.enabled}"]启用[/@]` |
| `@b.checkboxes` | 复选框组 | `[@b.checkboxes name="roles" options="${roles}" values="${user.roles}"/]` |
| `@b.radios` | 单选框组 | `[@b.radios name="gender" options="${genders}" value="${user.gender}"/]` |
| `@b.file` | 文件上传 | `[@b.file name="avatar" accept="image/*"/]` |
| `@b.date` | 日期选择器 | `[@b.date name="birthday" format="YYYY-MM-DD" value="${user.birthday}"/]` |
| `@b.time` | 时间选择器 | `[@b.time name="time" format="HH:mm" value="${event.time}"/]` |
| `@b.email` | 邮箱输入框 | `[@b.email name="email" value="${user.email}" placeholder="请输入邮箱"/]` |
| `@b.url` | URL输入框 | `[@b.url name="website" value="${user.website}" placeholder="请输入网址"/]` |
| `@b.number` | 数字输入框 | `[@b.number name="age" value="${user.age}" min="0" max="120"/]` |
| `@b.range` | 范围输入框 | `[@b.range name="score" value="${score}" min="0" max="100"/]` |
| `@b.submit` | 提交按钮 | `[@b.submit value="保存" class="btn-primary"/]` |
| `@b.reset` | 重置按钮 | `[@b.reset value="重置" class="btn-default"/]` |

### 4. 数据展示标签

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.grid` | 数据表格 | `[@b.grid items="${users}" var="user"][/@]` |
| `@b.gridbar` | 表格工具栏 | `[@b.gridbar]工具栏内容[/@]` |
| `@b.pagebar` | 分页栏 | `[@b.pagebar pagination="${pagination}"/]` |
| `@b.messages` | 消息容器 | `[@b.messages/][@b.actionmessage/][@b.actionerror/]` |
| `@b.actionmessage` | 成功消息 | `[@b.actionmessage/]` |
| `@b.actionerror` | 错误消息 | `[@b.actionerror/]` |

### 5. 高级组件

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.dialog` | 对话框 | `[@b.dialog id="confirmDialog" title="确认" width="400px"/][/@]` |
| `@b.combobox` | 组合框 | `[@b.combobox name="user" options="${users}" value="${selectedUserId}"/]` |
| `@b.startend` | 起止时间选择 | `[@b.startend name="dateRange" startName="startDate" endName="endDate"/]` |
| `@b.recaptcha` | 验证码 | `[@b.recaptcha siteKey="${siteKey}"/]` |

## 标签使用示例

### 1. 表单示例

```html
[@b.form action="!save" method="post" class="form-horizontal"]
  [@b.field name="name" label="姓名" class="col-sm-3"]
    [@b.textfield name="name" value="${user.name}" class="form-control"/]
  [/@]
  [@b.field name="email" label="邮箱" class="col-sm-3"]
    [@b.email name="email" value="${user.email}" class="form-control"/]
  [/@]
  [@b.field name="gender" label="性别" class="col-sm-3"]
    [@b.radios name="gender" options="${genders}" value="${user.gender}"/]
  [/@]
  [@b.field name="roles" label="角色" class="col-sm-3"]
    [@b.checkboxes name="roles" options="${roles}" values="${user.roles}"/]
  [/@]
  [@b.field name="birthday" label="生日" class="col-sm-3"]
    [@b.date name="birthday" format="YYYY-MM-DD" value="${user.birthday}" class="form-control"/]
  [/@]
  [@b.field name="description" label="描述" class="col-sm-3"]
    [@b.textarea name="description" rows="4" value="${user.description}" class="form-control"/]
  [/@]
  [@b.field label="" class="col-sm-3"]
    [@b.submit value="保存" class="btn btn-primary"/]
    [@b.reset value="重置" class="btn btn-default"/]
  [/@]
[/@]
```

### 2. 数据表格示例

```html
[@b.grid items="${users}" var="user" id="userGrid"]
  [@b.gridbar]
    bar.addItem("${b.text('action.new')}", action.add());
    bar.addItem("${b.text('action.modify')}", action.edit());
    bar.addItem("${b.text('action.delete')}", action.remove());
  [/@]
  [@b.row]
    [@b.boxcol/]
    [@b.col property="name" title="登录名"/]
    [@b.col property="fullname" title="姓名"/]
    [@b.col property="email" title="邮箱"/]
    [@b.col property="createdAt" title="创建时间"]${user.createdAt?string("yyyy-MM-dd")}[/@]
    [@b.col property="status" title="状态"]
      [#if user.enabled]启用[#else]禁用[/#if]
    [/@]
  [/@]
  [@b.pagebar pagination="${pagination}"/]
[/@]
```

### 3. 导航菜单示例

```html
[@b.navbar class="navbar-inverse"]
  [@b.navitem title="首页" href="/" class="active"/]
  [@b.navitem title="用户管理" href="/security/user"/]
  [@b.navitem title="角色管理" href="/security/role"/]
  [@b.navitem title="菜单管理" href="/security/menu"/]
  [@b.navitem title="系统设置" href="/system/setting"/]
[/@]
```

### 4. 卡片示例

```html
[@b.card class="card-primary"]
  [@b.cardHeader]
    <h4 class="card-title">用户信息</h4>
    [@b.cardTools]
      <button class="btn btn-sm btn-default" onclick="editUser()">编辑</button>
    [/@]
  [/@]
  [@b.cardBody]
    <div class="form-horizontal">
      <div class="form-group">
        <label class="col-sm-3 control-label">姓名:</label>
        <div class="col-sm-9">${user.fullname}</div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">邮箱:</label>
        <div class="col-sm-9">${user.email}</div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">创建时间:</label>
        <div class="col-sm-9">${user.createdAt?string("yyyy-MM-dd HH:mm:ss")}</div>
      </div>
    </div>
  [/@]
  [@b.cardFooter]
    <button class="btn btn-primary" onclick="saveUser()">保存</button>
    <button class="btn btn-default" onclick="cancelEdit()">取消</button>
  [/@]
[/@]
```

### 5. 对话框示例

```html
[@b.dialog id="confirmDialog" title="确认操作" width="400px"]
  <div class="modal-body">
    <p>确定要执行此操作吗？</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
    <button type="button" class="btn btn-primary" onclick="confirmAction()">确定</button>
  </div>
[/@]

<script>
function showConfirm() {
  $('#confirmDialog').modal('show');
}

function confirmAction() {
  // 执行确认操作
  $('#confirmDialog').modal('hide');
}
</script>
```

## 主题支持

Beangle BUI 支持主题定制，默认使用 Bootstrap 主题。主题文件位于：

```
static/themes/
      themename/icons/[16x16|48x48]/any.png
      themename/any.css
```

### 主题相关标签

| 标签 | 功能描述 | 使用示例 |
|------|----------|----------|
| `@b.css` | 引入主题 CSS | `[@b.css href="custom.css"/]` |
| `@b.iconurl` | 获取图标 URL | `${b.iconurl("actions/save.png")}` |
| `@b.theme.ui` | 获取当前主题名称 | `${b.theme.ui}` |

## 国际化支持

| 标签/方法 | 功能描述 | 使用示例 |
|-----------|----------|----------|
| `b.text(key)` | 无参国际化文本 | `${b.text("action.save")}` |
| `b.text(key, val1)` | 带一个参数的国际化文本 | `${b.text("user.name", user.name)}` |
| `b.text(key, val1, val2)` | 带两个参数的国际化文本 | `${b.text("user.age", user.name, user.age)}` |

## URL 生成

| 方法 | 功能描述 | 使用示例 |
|------|----------|----------|
| `b.url(path)` | 生成 URL | `${b.url("!delete?id=1")}` |
| `b.url(action, method)` | 生成 Action URL | `${b.url("user", "edit")}` |

## 最佳实践

1. **合理使用布局标签**：使用 `row`、`col` 等标签构建响应式布局
2. **表单验证**：结合客户端和服务端验证，提供良好的用户体验
3. **主题定制**：根据项目需求定制主题，保持视觉一致性
4. **国际化**：使用 `b.text()` 方法实现多语言支持
5. **异步操作**：使用 `@b.div`、`@b.form` 等标签实现异步交互
6. **代码组织**：将复杂页面拆分为多个组件，提高代码可维护性
7. **性能优化**：合理使用缓存，减少重复渲染
8. **兼容性**：考虑不同浏览器的兼容性问题
9. **可访问性**：确保页面符合 Web 可访问性标准
10. **测试**：对标签使用进行充分测试，确保功能正常