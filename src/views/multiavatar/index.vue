<template>
  <div class="multiavatar">
    <div class="avatar" v-html="svg" v-if="input" />
    <div class="avatar loading" v-else>
      <i class="el-icon-loading"></i>
    </div>
    <div class="input">
      <el-input class="input-text" v-model="input" />
    </div>
    <div class="tools">
      <div :class="`icon ${rotate ? 'rotate' : ''}`" @click="refresh">
        <i class="el-icon-refresh"></i>
      </div>
      <div class="icon" @click="downloadPng(input)">
        <i class="el-icon-download"></i>
      </div>
    </div>
  </div>
</template>

<script>
import multiavatar from '@multiavatar/multiavatar'
import randomName from 'chinese-random-name'
import sha256 from 'crypto-js/sha256'

import '../../utils/saveSvgAsPng.js'

export default {
  name: 'MultiAvatar',
  data () {
    return {
      svg: '',
      input: '',
      avatarRandom: false,
      timeClicked: '',
      rotate: false
    }
  },
  created () {
    const name = randomName.generate()
    this.newIdenticon(name)
  },
  watch: {
    input (val) {
      const svgCode = multiavatar(val, false) // 第二个参数数背景
      this.svg = svgCode
    }
  },
  methods: {
    refresh () {
      this.newIdenticon()
    },
    download (selector, name) {
      this.htmlToImage(selector, name)
    },
    newIdenticon (name) {
      const _this = this
      this.avatarRandom = true
      // spinStart();
      this.timeClicked = Date.now()

      if (!name) {
        this.rotate = true
      }

      var randomHash = sha256('' + Math.random()).toString().substring(0, 20)
      var randomHashConstructed = ''

      function runIt () {
        setTimeout(function () {
          if (randomHashConstructed.length < 18) {
            var lastChar = randomHash.substring(randomHash.length - 1)
            randomHash = randomHash.slice(0, -1)
            // console.log(randomHash);

            randomHashConstructed += lastChar
            // console.log(randomHashConstructed)

            // getNewIdenticon(randomHashConstructed)
            if (name) {
              _this.input = name
            } else {
              _this.input = randomHashConstructed
            }
            runIt()
          } else {
            var timeFinished = Date.now()
            var timeDiff = timeFinished - _this.timeClicked
            // if spinner is stuck on spinning, try lowering the below number
            if (timeDiff > 100) {
              // spinStop()
              _this.rotate = false
            }
          }
        }, 6)
      }
      runIt()
    },
    downloadPng (id, whiteBg) {
      var wrapper = document.createElement('div')

      let svg
      let fileName

      svg = multiavatar(id)
      fileName = 'Multiavatar-' + id

      wrapper.innerHTML = svg

      var svgContent = wrapper.firstChild

      if (whiteBg) {
        // eslint-disable-next-line
        saveSvgAsPng(svgContent, fileName + '-white.png', {scale: 3.465, backgroundColor: 'white'})
      } else {
        // eslint-disable-next-line
        saveSvgAsPng(svgContent, fileName + '.png', {scale: 3.465})
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.multiavatar {
  padding-top: 80px;
  text-align: center;
}
.avatar {
  width: 260px;
  height: 260px;
  margin: 0 auto;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 70px;
}
.input {
  width: 240px;
  margin: 30px auto 0;
}
.input-text /deep/ .el-input__inner {
  border: 0;
  color: aquamarine;
  width: 100%;
  text-align: center;
  padding: 6px 0 4px;
  border: 0;
  border-bottom: 1px solid #acacac;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #111;
  background-color: hsla(0,0%,100%,0);
  font-family: SF Mono,Monaco,Andale Mono,Lucida Console,Bitstream Vera Sans Mono,Courier New,Courier,monospace;
  font-size: 18px;
}
.input input:focus {
  outline: none;
}
.tools {
  width: 240px;
  margin: 20px auto 0;
  display: flex;
  justify-content: space-around;
}
.tools .icon{
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-radius: 50%;
  background-color: #6a6b6c;
  font-size: 26px;
  color: white;
}
.icon:hover {
  opacity: 0.8;
}
.rotate .el-icon-refresh{
  animation: rotate linear infinite 0.2s;
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
