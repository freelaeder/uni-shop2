<template>
	<view>
		<!-- 搜索组件 -->
		<my-search></my-search>
		<view class="scroll-view-container">
			<!-- 左侧滚动视图区域 -->
			<scroll-view scroll-y="true" class="srcoll-left" :style="{height: wh +'px'}">
				<block v-for="(item,i) in cateList" :key="i">
					<!-- 如果索引等于active 添加 active 类名 -->
					<view :class="['scroll-left-item' ,i == active ? 'active': '']" @click="activeChanged(i)">
						{{item.cat_name}}</view>
				</block>
			</scroll-view>
			<!-- 右侧滚动视图区域 -->
			<scroll-view scroll-y="true" :style="{height: wh +'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in cateLevel2" :key="i2">
					<!-- 二级分类的标题 -->
					<view class="cate-lv2-title">
						/ {{item2.cat_name}} /
					</view>
					<!-- 当前二级分类下的三级分类 大盒子 -->
					<view class="cate-lv3-list">
						<!-- 三级分类的每一项 -->
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodList(item3)">
							<!-- 三级分类的图片 -->
							<image :src="item3.cat_icon"></image>
							<!-- 文字 -->
							<text> {{item3.cat_name}}</text>
						</view>
						
					</view>
				</view>

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
				// 激活的索引
				active: 0,
				// 二级分类
				cateLevel2: [],
				// scrollop 距离top的距离
				scrollTop:0,
				




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
				console.log(res)
				// 判断是否成功
				if (res.meta.status != 200) return uni.$showMsg
				// 赋值
				this.cateList = res.message
				// 二级分类赋值
				this.cateLevel2 = res.message[0].children

			},
			// 点击切换 active 样式
			activeChanged(i) {
				this.active = i
				// 点击的时候 二级分类也要相对应的改变
				this.cateLevel2 = this.cateList[i].children
				// scrollTop 赋值为0
				// 如果每次赋值一样，不会生效
				// this.scrollTop=0
				this.scrollTop = this.scrollTop == 0 ? 1 : 0
			},
			gotoGoodList(e){
				uni.navigateTo({
					 url: '/subpkg/good_list/good_list?cid=' + e.cat_id
				})
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

		// 右侧滚动视图区域
		.cate-lv2-title {
			padding: 15px 0;
			font-weight: bold;
			font-size: 12px;
			text-align: center;
		}
		// 三级分类
		.cate-lv3-list {
			display: flex;
			flex-wrap: wrap;
			.cate-lv3-item{
				display: flex;
				width: 33.33%;
				flex-direction: column;
				text-align: center;
				align-items: center;
				margin-bottom: 12px;
				image {
					width: 60px;
					height: 60px;
				}
				text {
					font-size: 12px;
				}
			}
		}
	}
</style>