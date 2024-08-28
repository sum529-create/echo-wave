import Vue from "vue";
import App from "./App.vue";
import router from "./router";

function parseCustomDateToTimestamp(dateString) {
  if (!dateString || typeof dateString !== "string") {
    throw new Error("Invalid date string provided.");
  }

  try {
    // '오전' 또는 '오후'로 문자열을 분리
    const period = dateString.includes("오후") ? "오후" : "오전";
    const [datePart, timePartWithPeriod] = dateString.split(period);

    if (!datePart || !timePartWithPeriod) {
      throw new Error("Date or time part is missing.");
    }

    const [year, month, day] = datePart.split(".").map((part) => part.trim());
    const [hour, minute, second] =
      timePartWithPeriod.split(" ").length > 1
        ? timePartWithPeriod.split(":")
        : [timePartWithPeriod, "00"]; // Assuming seconds are missing, default to "00"

    if (!year || !month || !day || !hour || !minute) {
      throw new Error("Date or time components are missing or invalid.");
    }

    // 24시간 형식으로 변환
    let hour24 = parseInt(hour, 10);
    if (period === "오후" && hour24 !== 12) {
      hour24 += 12; // PM일 때 12시간 추가
    } else if (period === "오전" && hour24 === 12) {
      hour24 = 0; // AM일 때 12시를 0으로 변환
    }

    // ISO 8601 형식의 문자열로 변환
    const isoDateString = `${year.padStart(4, "0")}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}T${hour24
      .toString()
      .padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;

    // 타임스탬프로 변환
    const timestamp = new Date(isoDateString).getTime();

    if (isNaN(timestamp)) {
      throw new Error("Invalid date format.");
    }

    return timestamp;
  } catch (error) {
    console.error("Error parsing date string:", error);
    return null;
  }
}

const globalMixin = {
  methods: {
    moveToPage(r) {
      this.$router.push({ path: r });
    },
    parseCustomDateToTimestamp,
  },
};

Vue.mixin(globalMixin);

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
