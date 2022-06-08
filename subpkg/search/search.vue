<template>
	<view>
		<!-- 自定义Placeholder -->
		<view class="my-search-box">
			<!-- :focus = true 可以实现输入框自动聚焦 -->
			<uni-search-bar cancelButton='none' v-model="searchValue" :focus="true" :radius="100" @input="input">
			</uni-search-bar>
		</view>
		<!-- 搜索建议列表 -->
		<view class="sugg-list" v-if="searchReslts.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchReslts.goods" :key="i" @click="gotoDetail(item)">
				<view class="sugg-name">
					{{item.goods_name}}
				</view>
				<!-- 右侧的图标 -->
				<uni-icons type="right" size="16"></uni-icons>
			</view>
		</view>
		<!-- // 搜索历史-->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<!-- 右侧的图标 -->
				<uni-icons type="trash-filled" size="16" @click="clean"></uni-icons>

			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<view class="tag-view">
					<!-- 改为之后的计算属性 -->
					<uni-tag @click="gotoTag(item)" :inverted="true" v-for="(item,i) in histories" :text="item" :key="i"
						type="primary" />
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 防抖处理
				timer: null,
				// 用户输入的关键词
				kw: '',
				// 搜索的结果
				searchReslts: [],
				// 搜索历史
				searchHistory: ['apple', 'a', 'c'],
				// 搜索的默认值
				searchValue: '',
			};
		},
		onLoad() {
			// 将本地的kw 赋值给searchHistory
			this.searchHistory = JSON.parse(uni.getStorageSync('kw') || '[]')
		},

		methods: {
			// 获取用户输入的内容
			input(e) {
				// 防抖
				clearTimeout(this.timer)
				this.timer = setTimeout(() => {
					this.kw = e

					// 调用搜索的方法
					this.getSearchList()
					// 保存 搜索历史
					this.saveSearchList()
				}, 500)
			},
			async getSearchList() {
				// 判断搜索关键词是否为空
				if (this.kw.length === 0) {
					this.searchReslts = []
					return
				}
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/goods/search', {
					query: this.kw
				})
				if (res.meta.status !== 200) return uni.$showMsg()
				console.log(res);
				this.searchReslts = res.message
			},
			// 点击搜索获取详情
			gotoDetail(e) {
				// console.log(e.goods_id);
				uni.navigateTo({
					url: '/subpkg/good_detail/good_detail?goods_id=' + e.goods_id
				})
			},
			// 点击tag时
			gotoTag(e) {
				// this.searchValue = e
				uni.navigateTo({
					url: '/subpkg/good_list/good_list?query=' + e
				})
			},
			// 保存搜索历史
			saveSearchList() {
				// this.searchHistory.push(this.kw)

				const set = new Set(this.searchHistory)
				// 移除原先的. 目的为了让之前就有的显示在前面,并且删除之前
				set.delete(this.kw)
				// 添加最新的
				set.add(this.kw)
				// 集合转化为数组
				this.searchHistory = Array.from(set)
				// 将历史数据进持久化存储
				uni.setStorageSync('kw', JSON.stringify(this.searchHistory))


			},
			// clean 清空搜索记录
			clean() {
				this.searchHistory = []
				uni.setStorageSync('kw', '[]')
			}

		},
		computed: {
			// 处理搜索历史最新的在最前面
			histories() {
				// 反转
				return [...this.searchHistory].reverse()
			}
		}
	}
</script>

<style lang="scss">
	.my-search-box {
		background-color: #C00000;
		position: sticky;
		top: 0;
	}

	//搜索建议
	.sugg-list {

		padding: 0 5px;

		.sugg-item {
			padding: 13px 0;
			font-size: 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			border-bottom: 1px solid #efefef;

			.sugg-name {
				// 溢出部分隐藏
				overflow: hidden;
				// 文字不允许换行
				white-space: nowrap;
				// 文本溢出后,使用.. 代替
				text-overflow: ellipsis;
				margin-right: 3px;
			}
		}
	}

	// 搜索历史
	.history-box {
		padding: 0 5px;
		position: sticky;
		top: 10px;

		.history-title {
			display: flex;
			justify-content: space-between;
			padding: 0 5px;
			align-items: center;
			height: 40px;
			font-size: 13px;
			border-bottom: 1px solid #efefef;
		}

		.history-list {
			display: flex;
			flex-wrap: wrap;

			// uni-tag 可以作为类名
			.uni-tag {
				// 新版的tag是 text margin-top 不生效
				display: inline-block;
				margin: 5px;
			}
		}
	}
</style>
