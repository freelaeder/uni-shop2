<template>
	<view>
		<view class="scroll-view-container">
			<!-- 左侧滚动视图区域 -->
			<scroll-view scroll-y="true" class="srcoll-left" :style="{height: wh +'px'}">
				<view class='scroll-left-item active'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
				<view class='scroll-left-item'>xxxx</view>
			</scroll-view>
			<!-- 右侧滚动视图区域 -->
			<scroll-view scroll-y="true" :style="{height: wh +'px'}">
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
				<view>yyyy</view>
			</scroll-view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// wh是当前屏幕可用的高低
				wh: 0,
				// 分类列表
				cateList: [],


			};
		},
		onLoad() {
			// 获取当前系统屏幕信息
			const sysInfo = uni.getSystemInfoSync()
			// console.log(sysInfo);
			this.wh = sysInfo.windowHeight
			// 获取分类列表的数据
			this.getCateList()
		},
		methods: {
			// 获取分类列表数据
			async getCateList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/categories')
				// console.log(res)
				// 判断是否成功
				if(res.meta.status != 200 ) return uni.$showMsg()
				// 赋值
				this.cateList = res.message
				
			}
		}

	}
</script>

<style lang="scss">
	// 外层大盒子
	.scroll-view-container {
		display: flex;

		//  左侧滚动视图区域 -
		.srcoll-left {
			width: 120px;

			// 左侧的每一项
			.scroll-left-item {
				line-height: 60px;
				text-align: center;
				background-color: #f7f7f7;
				font-size: 12px;

				// 激活的样式
				&.active {
					background-color: #fff;
					position: relative;

					// 左侧的横线
					&::before {
						position: absolute;
						content: "";
						display: block;
						width: 3px;
						height: 30px;
						background-color: #c00000;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
					}
				}
			}
		}
	}
</style>
