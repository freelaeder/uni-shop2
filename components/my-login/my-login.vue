<template>
	<view class="login-container">
		<!-- 提示登录的按钮 -->
		<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
		<!-- 登录按钮 -->
		<button @click="getUserProfile" type="primary" class="btn-login">一键登录</button>
		<!-- 登录提示 -->
		<view class="tips-text">
			登录后尽享受更多权益
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo']),
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			// 用户授权登录，获取信息
			getUserProfile() {
				// desc 声明获取用户个人信息后的用途，不超过30个字符
				// https://uniapp.dcloud.io/api/plugins/login.html#getuserprofile

				// 两种方法   定义变量保存 that 因为函数没有this ,
				// 但是箭头函数没有this，会使用上一级this

				// const that = this
				// uni.getUserProfile({
				// 	desc: '登录',
				// 	success(res) {
				// 		that.updateUserInfo(res)
				// 	},
				// 	fail(res) {
				// 		// console.log('--');
				// 		uni.$showMsg('您取消了授权哟')
				// 	}
				// })
				uni.getUserProfile({
					desc: '登录',
					success: (res) => {
						this.updateUserInfo(res)
						// console.log(this,'this箭头函数');
						this.getToken(res)
					},
					fail(res) {
						// console.log('--');
						uni.$showMsg('您取消了授权哟')
					}
				})
			},
			// 获取token
			async getToken(info) {
				const [err, res] = await uni.login().catch(err => err)
				if (err || res.errMsg !== "login:ok") return uni.$showMsg('登录失败')
				const query = {
					code: res.code,
					// code: '62a7e46b-05d5d280-40eb9c85',
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}
				console.log(query,'query');
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
				console.log(loginResult);
				// if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败')
				const token =
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnP'
				// 保存token到vuex
				this.updateToken(token)
				//跳转页面
				this.navigateBack()
			},
			navigateBack(){
				// redirectInfo 存在并且 
				if(this.redirectInfo && this.redirectInfo.openType === 'switchTab'){
					uni.switchTab({
						url:this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}


		}

	}
</script>

<style lang="scss">
	.login-container {
		// 登录盒子样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		//登录按钮样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #c00000;
		}

		//按钮下方提示的信息样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}

	}
</style>
