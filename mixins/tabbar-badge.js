// 混合 数字徽标 方法

import {
	mapGetters
} from 'vuex'

// 抽离数字徽标方法
export default {
	computed: {
		...mapGetters('m_cart', ['total'])
	},
	onShow() {
		this.setBadge()
	},
	methods: {
		// 设置·数字徽标
		setBadge() {
			uni.setTabBarBadge({
				// 代表几个下标
				index: 2,
				// 注意必须是字符串
				text: this.total + ''
			})
		}
	},
	
}
