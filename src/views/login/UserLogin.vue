<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import router from '@/router'

interface LoginForm {
  userMail: string
  password: string
}

const loginForm = ref<LoginForm>({
  userMail: 'test@gmail.com',
  password: '123456',
})

const loginFormRef = ref<FormInstance>()

const rules = ref<FormRules>({
  userMail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应在 6 到 20 个字符之间', trigger: 'blur' },
  ],
})

const loading = ref(false)
const checkedAgree = ref(false)

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!checkedAgree.value) {
    ElMessage.error('请先同意用户协议')
    return
  }
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      loading.value = true
      // 这里添加实际的登录逻辑，token现在也只是用了用户名
      setTimeout(() => {
        localStorage.setItem('user', loginForm.value.userMail)
        localStorage.setItem('token', loginForm.value.userMail)
        ElMessage.success('登录成功')
        loading.value = false
        router.push('/main')
      }, 1000)
    }
  })
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="title-box">
        <p class="title">我言</p>
        <div class="title-line"></div>
        <div class="title-line"></div>
      </div>
      <div class="form-box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
          <el-form-item prop="userMail">
            <div class="form-each-box">
              <p class="text">邮箱：</p>
              <div class="input">
                <el-input v-model="loginForm.userMail" placeholder="请输入邮箱" />
              </div>
            </div>
            <!-- <el-input v-model="loginForm.userMail" placeholder="邮箱" :prefix-icon="User" /> -->
          </el-form-item>
          <el-form-item prop="password">
            <div class="form-each-box">
              <p class="text">密码：</p>
              <div class="input">
                <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" />
                <el-link class="forget" :underline="false">忘记密码？</el-link>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="login-button"
              @click="handleLogin(loginFormRef)"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="check-agree">
          <div class="check-agree-user">
            <el-checkbox v-model="checkedAgree"></el-checkbox>
            <span>我已阅读并同意<span class="user-agreement">用户协议</span></span>
          </div>
          <span>|</span>
          <div>
            <span class="user-agreement">注册用户</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;

  .login-box {
    width: 400px;
    height: 700px;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .title-box {
      width: calc(100%-80px);
      height: 70px;
      border-radius: 8px;
      border: 3px solid #999;
      padding: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .title {
        font-size: 36px;
        font-weight: bold;
      }
      .title-line {
        border-bottom: 3px solid #000;
      }
    }
    .form-box {
      padding: 0 40px;
      padding-top: 20px;
      color: #333;
      .form-each-box {
        display: flex;
        width: 100%;
        .text {
        }
        .input {
          flex: 1;
          border-bottom: 1px solid #000;
          display: flex;
          .forget {
            font-size: 12px;
            width: 80px;
          }
        }
      }
      .check-agree {
        display: flex;
        font-size: 14px;
        line-height: 32px;
        justify-content: space-between;
        .check-agree-user {
          display: flex;
          gap: 4px;
        }
        .user-agreement {
          color: #409eff;
          cursor: pointer;
        }
        .user-agreement:hover {
          color: #7ebbff;
        }
      }
    }

    .login-button {
      width: 100%;
    }
  }
}
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  // border-bottom: 1px solid black;
  border-radius: 0;
}
</style>
