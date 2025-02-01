<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import router from '@/router'

interface LoginForm {
  userMail: string
  code: string
}

const loginForm = ref<LoginForm>({
  userMail: 'test@gmail.com',
  code: '123456',
})
const loginFormRef = ref<FormInstance>()
const signInFormRef = ref<FormInstance>()
const loading = ref(false)
const checkedAgree = ref(false)
const signInDialog = ref(false)
const userAgreementDialog = ref(false)
const form = ref({
  userMail: '',
  userName: '',
  code: '',
  inviter: '',
})

const loginInRules = ref<FormRules>({
  userMail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  code: [
    { required: true, message: '请输入正确的验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度不正确', trigger: 'blur' },
  ],
})
const signInRules = ref<FormRules>({
  userMail: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] },
  ],
  userName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 6, max: 20, message: '昵称长度应在 6 到 20 个字符之间', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度不正确', trigger: 'blur' },
  ],
})

const signIn = async () => {
  await signInFormRef.value.validate((valid) => {
    if (valid) {
    }
  })
}

const getCode = () => {
  ElMessage.success('验证码已发送至您的邮箱')
}

const handleLogin = async () => {
  if (!checkedAgree.value) {
    ElMessage.error('请先同意用户协议')
    return
  }
  if (!loginFormRef.value) return

  await loginFormRef.value.validate((valid) => {
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
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginInRules"
          label-width="0"
          size="large"
        >
          <el-form-item prop="userMail">
            <div class="form-each-box">
              <p class="text">邮箱：</p>
              <div class="input">
                <el-input v-model="loginForm.userMail" placeholder="请输入邮箱" />
              </div>
            </div>
          </el-form-item>
          <el-form-item prop="code">
            <div class="form-each-box">
              <p class="text">验证码：</p>
              <div class="input">
                <el-input v-model="loginForm.code" type="password" placeholder="请输入密码" />
                <el-link class="forget" :underline="false" @click="getCode">获取验证码</el-link>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="check-agree">
          <div class="check-agree-user">
            <el-checkbox v-model="checkedAgree"></el-checkbox>
            <span
              >我已阅读并同意<span class="user-agreement" @click="userAgreementDialog = true"
                >用户协议</span
              ></span
            >
          </div>
          <span>|</span>
          <div>
            <span class="user-agreement" @click="signInDialog = true">注册用户</span>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="signInDialog" title="用户注册" width="500">
      <el-form ref="signInFormRef" :rules="signInRules" :model="form" label-width="auto">
        <el-form-item prop="userMail" label="邮箱">
          <el-input v-model="form.userMail" />
        </el-form-item>
        <el-form-item prop="userName" label="昵称">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item prop="code" label="验证码">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item prop="inviter" label="邀请人">
          <el-input v-model="form.inviter" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="signInDialog = false">取消</el-button>
          <el-button type="primary" @click="signIn">注册</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="userAgreementDialog" title="用户协议" width="500">
      <el-scrollbar class="user-agreement"> </el-scrollbar>
      <!-- <div class="paragraph">
          <p class="title"></p>
          <p class="info"></p>
        </div> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="userAgreementDialog = false">确定</el-button>
        </div>
      </template>
    </el-dialog>
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
      padding-top: 20px;
      color: #333;
      .form-each-box {
        display: flex;
        width: 100%;
        :deep(.el-input__wrapper) {
          box-shadow: none !important;
          border-radius: 0;
        }
        .text {
          text-align: right;
          width: 15%;
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
  .user-agreement {
    height: 200px;
    overflow: auto;
    .paragraph {
      margin-bottom: 20px;
      .title {
        font-weight: bold;
      }
      .info {
        font-size: 14px;
        line-height: 24px;
      }
    }
  }
}
</style>
