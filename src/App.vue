<script>
export default {};
</script>

<style lang="wxss">
.nav-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.nav-li {
  padding: 10px;
  border-radius: 7px;
  width: 45%;
  margin: 0 2.5% 20px;
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
}

.nav-li::after {
  content: "";
  position: absolute;
  z-index: -1;
  background-color: inherit;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: -10%;
  border-radius: 10px;
  opacity: 0.2;
  transform: scale(0.9, 0.9);
}

.nav-li.cur {
  color: #fff;
  background: rgb(94, 185, 94);
  box-shadow: 4px 4px 6px rgba(94, 185, 94, 0.4);
}

.nav-title {
  font-size: 20px;
  font-weight: 300;
  color: #fff;
}

.nav-title::first-letter {
  /* font-size: 22px;
  font-weight: 700;
  margin-right: 4px; */
}

.nav-name {
  font-size: 16px;
  text-transform: Capitalize;
  margin-top: 20px;
  position: relative;
}

.nav-name::before {
  content: "";
  position: absolute;
  display: block;
  width: 40px;
  height: 6px;
  background: #fff;
  bottom: 0;
  right: 0;
  opacity: 0.5;
}

.nav-name::after {
  content: "";
  position: absolute;
  display: block;
  width: 100px;
  height: 1px;
  background: #fff;
  bottom: 0;
  right: 40px;
  opacity: 0.3;
}

.nav-li text {
  position: absolute;
  right: 0;
  top: 5px;
  font-size: 22px;
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
}

.text-light {
  font-weight: 300;
}

@keyframes show {
  0% {
    transform: translateY(-50px);
  }

  60% {
    transform: translateY(40px);
  }

  100% {
    transform: translateY(0px);
  }
}

@-webkit-keyframes show {
  0% {
    transform: translateY(-50px);
  }

  60% {
    transform: translateY(40px);
  }

  100% {
    transform: translateY(0px);
  }
}
.container {
  height: 100%;
  box-sizing: border-box;
}
</style>
