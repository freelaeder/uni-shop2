<template>
	<view>
		<view class="my-search-container" :style="{'background-color':bgcolor}" @click="searchBoxHandlder">
			<view class="my-search-box" :style="{'border-radius':radius +'px'}">
				<uni-icons type="search" size="17"></uni-icons>
				<text class="placeholder">搜索</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "my-search",
		data() {
			return {

			};
		},
		// 外界传递的值
		props: {
			// 背景颜色
			bgcolor: {
				type: String,
				default: '#C00000'
			},
			// 圆角尺寸
			radius: {
				type: Number,
				default: 18, // px

			}

		},
		// 方法
		methods:{
			searchBoxHandlder(){
				// console.log('000');
				// 绑定调用的 myclick 触发btnSearch 该事件
				//  <my-search @myclick='btnSearch' ></my-search>
				this.$emit('myclick')
			}
		}
		
	}
</script>

<style lang="scss">
	// 搜索框
	.my-search-container {
		height: 50px;
		// background-color: #c00000;
		display: flex;
		align-items: center;
		text-align: center;
		padding: 0 10px;

		.my-search-box {
			width: 100%;
			line-height: 30px;
			background-color: #fff;
			// border-radius: 16px;

			.placeholder {
				margin-left: 5px;
				font-size: 15px;
			}
		}
	}
</style>
