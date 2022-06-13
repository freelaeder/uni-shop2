export default {
	// 开启命名空间
	namespaced: true,

	state: () => ({
		// 购物车的数组，用来存储购物车每个商品数据的对应信息
		// 每个商品对象包含如下6个属性
		// {goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	mutations: {
		addToCart(state, goods) {
			// 判断当前存在与否
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 如果传递的值不存在添加
			// console.log(findResult,'0000000');
			if (!findResult) {
				state.cart.push(goods)

			} else {
				findResult.goods_count++
			}
			// console.log(state.cart);
			// 调用持久化存储
			this.commit('m_cart/saveToStorage')
		},
		// 持久化存储
		saveToStorage(state) {
			// 将数组转化为字符串
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		// 更新购物车的勾选状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_state = goods.goods_state
			}
			// 调用持久化存储
			this.commit('m_cart/saveToStorage')
		},
		// 更新购物车的数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				// 调用持久化存储
				this.commit('m_cart/saveToStorage')
			}
		},
		// 删除商品
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id != goods_id)
			this.commit('m_cart/saveToStorage')
		},
		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			// 循环更新购物车每件商品的勾选状态
			state.cart.forEach(x => x.goods_state = newState)
			// 调用持久化存储
			this.commit('m_cart/saveToStorage')

		}
	},
	getters: {
		// 统计当前所用商品数量
		total(state) {
			let c = 0
			state.cart.forEach(x => c += x.goods_count)
			return c
		},
		// 选中商品的数量
		checkedCount(state) {
			// 先使用filter 过滤出勾选的商品
			// 在使用reduce 将勾选的商品总数量返回
			return state.cart.filter(x => x.goods_state).reduce((total, item) =>
				total += item.goods_count, 0)
		},

		// 已勾选的商品总价
		checkedGoodsAmout(state) {
			// 先使用 filter 方法，从购物车中过滤器已勾选的商品
			// 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
			// reduce() 的返回值就是已勾选的商品的总价
			// 最后调用 toFixed(2) 方法，保留两位小数
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item
				.goods_price, 0).toFixed(2)

		}
	}
}
