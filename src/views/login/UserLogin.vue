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

const handleLogin = async (formEl: FormInstance | undefined) => {
  console.log(formEl?.validate)
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
      <p class="title">我言</p>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" size="large">
        <el-form-item prop="userMail">
          <el-input v-model="loginForm.userMail" placeholder="邮箱" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
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
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 40px;
    }

    .login-button {
      width: 100%;
    }
  }
}
</style>
