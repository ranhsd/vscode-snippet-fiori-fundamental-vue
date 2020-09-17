<template>
  <fd-table-cell>
    <fd-status :statusIcon=statusIcons[statusCode]>{{ statusText }}</fd-status>
  </fd-table-cell>
</template>

<script>
export default {
  name: "ProcessingStatusCell",
  props: {
    statusCode: {
      type: String,
      required: true,
    },
    statusText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      statusIcons: {
        C: "available",
        B: "away",
        A: "offline",
      },
    };
  },
};
</script>

<style lang="scss" scoped></style>
