<template>
  <section
    class="section relative flex-center flex-col align-center max-h-screen h-screen overflow-hidden"
  >
    <div
      class="absolute flex-center flex-col align-center max-h-screen h-screen overflow-hidden top-0 left-0 right-0 bottom-0 z-10"
    >
      <img src="/images/svg/404.svg" alt="404 image" />
      <h2
        class="mb-3 mt-[60px] text-center text-white text-[32px] leading-130 font-bold"
      >
        {{ $t("error_404") }}
      </h2>
      <p class="mb-8 text-center text-gray text-xl leading-130">
        {{ $t("error_404_description") }}
      </p>
      <div class="flex-center cursor-pointer">
        <router-link
          to="/"
          class="px-[18px] py-3 gap-2 text-white bg-green-500 rounded-[10px] hover:bg-green transition-300 cursor-pointer flex items-center z-10"
        >
          <span class="icon-home text-white" />
          {{ $t("back_to_home") }}
        </router-link>
      </div>
    </div>

    <!--    pattern-->
    <div
      class="pattern absolute top-0 left-0 right-0 bottom-0 z-0 flex-center flex-col align-center max-h-screen h-screen overflow-hidden"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="821"
        height="800"
        viewBox="0 0 821 800"
        fill="none"
      >
        <path
          opacity="0.3"
          d="M479.583 592.192C501.73 580.257 519.913 547.489 519.913 519.916V288.349C519.913 260.483 501.73 247.615 479.583 259.87V592.192ZM479.583 592.192L341.417 667.532L479.583 592.192ZM40.6142 96.2058L40.6169 96.2043L178.751 20.8639L178.754 20.8622C189.688 14.8116 199.513 15.0228 206.586 20.0216C213.685 25.0375 218.193 34.9968 218.193 48.8168V759.739C218.193 773.404 213.684 788.391 206.409 801.451C199.131 814.516 189.122 825.591 178.179 831.488L178.177 831.489L40.0423 906.831L40.0391 906.833C29.1045 912.883 19.28 912.672 12.2061 907.673C5.10779 902.657 0.6 892.698 0.6 878.878V167.956C0.6 154.29 5.1088 139.304 12.384 126.243C19.6612 113.179 29.671 102.103 40.6142 96.2058ZM780.958 -160.164L780.962 -160.166C791.897 -166.217 801.721 -166.005 808.794 -161.007C815.893 -155.991 820.4 -146.032 820.4 -132.212V759.448C820.4 773.112 815.891 788.098 808.617 801.159C801.34 814.223 791.33 825.299 780.387 831.196L780.384 831.197L642.219 906.539L642.215 906.541C631.28 912.592 621.456 912.381 614.382 907.382C607.284 902.366 602.777 892.407 602.777 878.587V-13.0437C602.777 -26.7085 607.285 -41.6943 614.56 -54.7552C621.837 -67.8197 631.847 -78.8954 642.79 -84.7925L643.106 -84.9624V-84.9936L780.958 -160.164ZM341.702 335.738L341.704 335.737L479.87 260.396L479.873 260.395C490.808 254.344 500.633 254.555 507.707 259.554C514.805 264.57 519.313 274.529 519.313 288.349V519.916C519.313 533.58 514.804 548.565 507.529 561.626C500.252 574.691 490.242 585.766 479.298 591.664L479.296 591.665L341.13 667.006L341.127 667.007C330.192 673.059 320.368 672.848 313.294 667.849C306.196 662.834 301.689 652.874 301.689 639.054V407.488C301.689 393.823 306.197 378.837 313.472 365.776C320.749 352.711 330.758 341.635 341.702 335.738Z"
          stroke="url(#paint0_linear_5119_26375)"
          stroke-width="1.2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_5119_26375"
            x1="410.5"
            y1="-165.333"
            x2="410.5"
            y2="912"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0.56" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.section {
  background: #080a15;
  backdrop-filter: blur(42px);
}

.section::after {
  content: "";
  width: 100%;
  height: 160px;
  position: absolute;
  flex-shrink: 0;
  bottom: -224px;
  border-radius: 1440px;
  background: linear-gradient(
    180deg,
    #0fd647 21.35%,
    rgba(15, 214, 71, 0.7) 100%
  );
  filter: blur(450px);
}
</style>
