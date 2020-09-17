<template>
  <div v-if="loading" class="h-full flex items-center">
    <fd-spinner />
  </div>
  <fd-container v-else centered class="h-full">
    <fd-section>
      <template #header>
        <fd-section-header>
          <fd-section-title>{{ `Order ${order.displayId}` }}</fd-section-title>
        </fd-section-header>
      </template>
      <fd-panel>
        <fd-breadcrumb slot="title">
          <fd-breadcrumb-item :to="{ name: 'home' }">Home</fd-breadcrumb-item>
          <fd-breadcrumb-item @click="$router.go(-1)">Customer</fd-breadcrumb-item>
          <fd-breadcrumb-item>Order</fd-breadcrumb-item>
        </fd-breadcrumb>
        <!-- <div slot="title" class="flex items-center">
          <fd-button
            styling="light"
            compact
            icon="arrow-left"
            @click="$router.go(-1)"
          ></fd-button>
          <div class="ml-6 mt-2">Order Details</div>
        </div> -->
        <fd-container fluid>
          <fd-col
            :span="4"
            v-for="(value, name) in orderDetails"
            :key="`column${name}`"
          >
            <div
              class="flex flex-row items-center mb-3"
              v-for="(field, index) in value"
              :key="index"
            >
              <!-- <fd-icon :name="field.icon" class="mr-3" /> -->
              <fd-link
                class="cursor-pointer"
                target="_blank"
                v-if="field.href"
                :href="field.href"
                >{{ field.text }}</fd-link
              >
              <div class="mr-3">{{ `${field.title}:` }}</div>
              <processing-status-cell
                v-if="field.fieldType === 'status'"
                :statusCode="field.code"
                :statusText="field.text"
              />
              <div v-else>{{ field.text }}</div>
            </div>
          </fd-col>
        </fd-container>
      </fd-panel>

      <fd-panel class="mt-3" title="Order Items">
        <fd-table :headers="orderItemsHeaders" :items="order.items" striped>
          <template #row="{ toggle, item }">
            <fd-table-row @click="toggle">
              <template #id>
                <fd-table-cell>
                  {{ item.id }}
                </fd-table-cell>
              </template>
              <template #name>
                <fd-table-cell>
                  {{ item.text }}
                </fd-table-cell>
              </template>
              <template #type>
                <fd-table-cell>
                  {{ item.type.name }}
                </fd-table-cell>
              </template>
              <template #quantity>
                <fd-table-cell>
                  {{ item.quantity }}
                </fd-table-cell>
              </template>
              <template #status>
                <processing-status-cell statusCode="A" statusText="Open" />
              </template>
              <template #product>
                <fd-table-cell>
                  <fd-button styling="light" @click="showProduct(item)"
                    >Show Product</fd-button
                  >
                </fd-table-cell>
              </template>
            </fd-table-row>
          </template>
        </fd-table>
      </fd-panel>
    </fd-section>
    <fd-modal name="party" ref="productModal" :title="productTitle">
      <fd-container class="overflow-x-hidden"> </fd-container>
    </fd-modal>
  </fd-container>
</template>

<script>
import { getCustomerOrder, getProduct } from "@/api";
import processingStatusCell from "@/components/ProcessingStatusCell";
import moment from "moment";
export default {
  name: "OrderPage",
  components: {
    processingStatusCell,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      order: null,
      product: null,
      productTitle: "",
      loading: false,
      loadingProduct: false,
      showModal: true,
      orderItemsHeaders: [
        {
          id: "id",
          label: "Item ID",
        },
        {
          id: "name",
          label: "Name",
        },
        {
          id: "type",
          label: "Type",
        },
        {
          id: "quantity",
          label: "Quantity",
        },
        {
          id: "status",
          label: "Status",
        },
        {
          id: "product",
        },
      ],
      orderDetails: {},
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    async refresh() {
      try {
        this.loading = true;
        this.order = await getCustomerOrder(this.id);
        this.constructOrderDetails();
      } finally {
        this.loading = false;
      }
    },
    async showProduct(item) {
      // load product from api

      try {
        this.loadingProduct = true;
        this.product = await getProduct(item.product.id);
        this.productTitle = `Product ${this.product.displayId}`;
        this.$refs.productModal.open();
      } finally {
        this.loadingProduct = false;
      }
    },
    constructOrderDetails() {
      const orderDetails1 = [];
      const orderDeatils2 = [];

      orderDetails1.push({
        title: "Fulfillment Date",
        text: moment(this.order.requestedFulfillmentDate).format("MMM Do YY"),
        fieldType: "text",
      });

      orderDetails1.push({
        title: "Net Amount",
        text: `${this.order.currency.code} ${this.order.netAmount}`,
        fieldType: "text",
      });

      orderDetails1.push({
        title: "Processing Status",
        text: this.order.processingStatus.name,
        code: this.order.processingStatus.code,
        fieldType: "status",
      });

      orderDeatils2.push({
        title: "Order Type",
        text: this.order.type.name,
      });

      orderDeatils2.push({
        title: "Distribution Channel",
        text: this.order.distributionChannel.code,
      });

      orderDeatils2.push({
        title: "Cancellation Status",
        fieldType: "status",
        code: this.order.cancellationStatus.code,
        text: this.order.cancellationStatus.name,
      });

      this.orderDetails = {
        col1: orderDetails1,
        col2: orderDeatils2,
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
{ id: "processingStatus", label: "Processing Status", },
