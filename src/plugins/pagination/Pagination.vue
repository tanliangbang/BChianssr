<template>
  <div :class="pagination.total>0?'pagination':'none'" >
      <ul>
        <li ><a :class="pagination.current===1?'disabled':''" v-on:click="prePage">上一页</a></li>
        {{dealTotalPage()}}
        <li v-on:click="toPage(1)" v-if="pagination.current>4&&pagination.total>6"><a :class="pagination.current===1?'active':''">1</a></li>
        <li v-if="pagination.current>4&&pagination.total>6" class="ellipsis"></li>
        <li v-for="(item) in [1,2,3,4,5]" :key="item.id">
          <a v-if="pagination.total<=7&&item<=pagination.total"  v-on:click="toPage(item)" :class="pagination.current===item?'active':''" >{{item}}</a>
          <a v-if="pagination.total>7&&pagination.current<5"  v-on:click="toPage(item)" :class="pagination.current===item?'active':''" >{{item}}</a>
          <a v-if="pagination.total>7&&pagination.current>=5&&pagination.current<pagination.total-3" v-on:click="toPage(pagination.current+item-3)" :class="pagination.current===pagination.current+item-3?'active':''" >{{pagination.current+item-3}}</a>
          <a v-if="pagination.total>7&&pagination.current>=pagination.total-3" v-on:click="toPage(pagination.total-6+item)" :class="pagination.current===pagination.total-6+item?'active':''" >{{pagination.total-6+item}}</a>
        </li>
        <li v-if="pagination.total>7&&pagination.current < (pagination.total-3)" class="ellipsis"></li>
        <li v-on:click="toPage(pagination.total)"  v-if="pagination.total>=6"><a :class="pagination.current===pagination.total?'active':''">{{pagination.total}}</a></li>
        <li> <a :class="pagination.current===pagination.total?'disabled':''" v-on:click="nextPage">下一页</a></li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pagination'],
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    toPage (num) {
      this.pagination.onShowSizeChange(num)
      this.pagination.current = num
      window.scrollTo(0, 0)
    },
    dealTotalPage () {
      if (this.pagination.totalSize > 0) {
        let totalSize = this.pagination.totalSize
        let pageSize = this.pagination.pageSize
        let total = totalSize % pageSize === 0 ? totalSize / pageSize : parseInt(totalSize / pageSize) + 1
        this.pagination.total = total
      }
    },
    prePage () {
      if (this.pagination.current <= 1) {
        return false
      }
      this.toPage(this.pagination.current - 1)
    },
    nextPage () {
      if (this.pagination.total === this.pagination.current) {
        return false
      }
      this.toPage(this.pagination.current + 1)
    }
  },
  update () {
  }
}
</script>

<style lang="less" scoped>
@import "../../style/common";
  .pagination{
    margin:20px 0px;
    ul{
      font-size: 14px;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.65);
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      text-align: center;
      list-style: none;
      .active{
        background:@mainColor;
        color:#fff;
      }
      .ellipsis{
        font-size:30px;
        margin:0px 20px;
        padding:0px;
        color:@mainColor;
        position:relative;
      }
      .ellipsis:after{
        content: '...';
        left:-15px;
        top:-5px;
        position:absolute;
      }
      .disabled{
          cursor: not-allowed;
      }
      .disabled:hover{
          background:#fff;
          color:@mainColor;
      }
      li{
        line-height: 36px;
        background-image: none;
        display: inline;
        list-style-type: none;
        user-select: none;
       >a{
         padding: 8px 12px;
         cursor: pointer;
         line-height: 1.42857143;
         background-color: #fff;
         color: @mainColor;
         border: 1px solid @mainColor;
         white-space: nowrap;
         margin:0px 8px;
         -webkit-transition: all 0.28s ease;
         transition: all 0.28s ease;
       }
       >a:hover{
         background:@mainColor;
         color:#fff;
       }
      }
    }
  }
  .none{
    display:none;
  }
</style>
