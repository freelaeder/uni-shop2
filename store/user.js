export default {
	// 开启命名空间
	namespaced: true,
	// 数据
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登录之后的token 字符串
		token: uni.getStorageSync('token') || '',
		// 用户的信息对象
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向object对象 {openType,from}
		redirectInfo: null


	}),
	//方法
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		// 持久保存 address
		saveAddressToStorage(state) {
			uni.setStorageSync('address', JSON.stringify(state.address))
		},
		// 更新用户数据
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo
			// 调用持久化保存
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 持久化保存
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		updateToken(state, token) {
			state.token = token
			this.commit('m_user/saveTokenToStorage')
		},
		saveTokenToStorage(state) {
			uni.setStorageSync('token', state.token)
		},
		// 更新重定向信息对象
		updateRedirectInfo(state, info) {
			state.redirectInfo = info
		}

	},
	getters: {
		addstr(state) {
			if (!state.address.provinceName) return ''
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address
				.detailInfo
		}
	}
}
