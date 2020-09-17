<template>
  <fd-container centered class="h-full">
    <div class="h-full flex items-center" v-if="loading">
      <fd-spinner />
    </div>

    <fd-section v-else>
      <template #header>
        <fd-section-header>
          <fd-section-title>{{ salesOrderTitle }}</fd-section-title>
        </fd-section-header>
      </template>
      <fd-panel>
        <fd-breadcrumb slot="title">
          <fd-breadcrumb-item :to="{ name: 'home' }">Home</fd-breadcrumb-item>
          <fd-breadcrumb-item disabled>Customer</fd-breadcrumb-item>
        </fd-breadcrumb>
        <!-- <div slot="title" class="flex items-center">
          <fd-button
            styling="light"
            compact
            icon="arrow-left"
            @click="$router.go(-1)"
          ></fd-button>
          <div class="ml-6 mt-2">Customer Details</div>
        </div> -->

        <fd-container fluid>
          <fd-col :span="4">
            <div
              class="flex flex-row items-center mb-3"
              v-for="(field, index) in customerAddressInfoFields"
              :key="index"
            >
              <fd-icon :name="field.icon" class="mr-3" />
              <fd-link
                class="cursor-pointer"
                target="_blank"
                v-if="field.href"
                :href="field.href"
                >{{ field.text }}</fd-link
              >
              <div v-else>{{ field.text }}</div>
            </div>
          </fd-col>
          <fd-col :span="4">
            <div
              class="flex flex-row items-center mb-3"
              v-for="(field, index) in customerInfoFields"
              :key="index"
            >
              <fd-icon :name="field.icon" class="mr-3" />
              <div class="mr-3">{{ `${field.text}:` }}</div>
              <fd-badge filled :type="field.value ? 'warning' : 'success'">{{
                field.value ? "Yes" : "No"
              }}</fd-badge>
            </div>
          </fd-col>
        </fd-container>
      </fd-panel>
      <fd-panel v-if="customer" title="Orders" class="mt-4">
        <fd-table :headers="orderItemsHeaders" :items="orders" striped>
          <template #row="{ toggle, item }">
            <fd-table-row @click="toggle">
              <template #orderId>
                <fd-table-cell>
                  <router-link
                    :to="{
                      name: 'order',
                      params: {
                        id: item.id,
                      },
                    }"
                    >{{ item.displayId }}</router-link
                  >
                </fd-table-cell>
              </template>
              <template #type>
                <fd-table-cell>
                  {{ item.type.name }}
                </fd-table-cell>
              </template>
              <template #processingStatus>
                <fd-table-cell>
                  <fd-status
                    :statusIcon="statusIcons[item.processingStatus.code]"
                    >{{ item.processingStatus.name }}</fd-status
                  >
                </fd-table-cell>
              </template>
              <template #amount>
                <fd-table-cell>
                  {{ `${item.currency.code} ${item.netAmount}` }}
                </fd-table-cell>
              </template>

              <template #pricedExt>
                <fd-table-cell>
                  <fd-checkbox
                    disabled
                    size="sm"
                    :on="item.isExternallyPriced"
                  ></fd-checkbox>
                </fd-table-cell>
              </template>
              <template #fulDate>
                <fd-table-cell>
                  {{ formatDate(item.requestedFulfillmentDate) }}
                </fd-table-cell>
              </template>
              <template #itemsCount>
                <fd-table-cell>
                  <router-link
                    :to="{
                      name: 'order',
                      params: {
                        id: item.id,
                      },
                    }"
                  >
                    {{ `${item.items.length} Items` }}
                  </router-link>
                </fd-table-cell>
              </template>
            </fd-table-row>
          </template>
        </fd-table>
      </fd-panel>
    </fd-section>
  </fd-container>
</template>

<script>
import { getSalesOrder, getCustomer, getCustomerOrders } from "@/api";
import moment from "moment";

export default {
  name: "Items",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  created() {
    this.refresh();
  },
  data() {
    return {
      selectedTab: "orders",
      orders: [],
      loading: false,
      nextPageLink: undefined,
      statusIcons: {
        C: "available",
        B: "away",
        A: "offline",
      },
      customer: null,
      orderItemsHeaders: [
        {
          id: "orderId",
          label: "Order Number",
        },
        {
          id: "type",
          label: "Order Type",
        },
        {
          id: "processingStatus",
          label: "Processing Status",
        },
        {
          id: "amount",
          label: "Net Amount",
        },
        {
          id: "pricedExt",
          label: "Externally Priced (Y/N)",
          alignment: "center",
        },
        {
          id: "fulDate",
          label: "Fulfillment Date",
        },
        {
          id: "itemsCount",
          label: "Items",
        },
      ],
      customerAddressInfoFields: [],
      customerInfoFields: [],
    };
  },
  computed: {
    salesOrderTitle() {
      return `Customer ${this.customer.displayId}`;
    },
  },
  methods: {
    async refresh() {
      try {
        this.loading = true;
        this.customer = await getCustomer(this.id);
        this.constructCustomerAddressFields();
        this.constructCustomerInfoFields();
        const { items, next } = await getCustomerOrders(
          this.customer.displayId
        );
        this.orders = items;
        this.nextPageLink = next;
        // load customer orders
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      return moment(date).format("MMM Do YY");
    },
    constructCustomerAddressFields() {
      const { addressData } = this.customer;
      if (!this.customer || !addressData || addressData.length === 0) {
        return;
      }

      const { emailAddresses, phoneNumbers, websites } = addressData[0];

      if (emailAddresses && emailAddresses.length) {
        this.customerAddressInfoFields.push({
          icon: "email",
          text: emailAddresses[0].address,
        });
      }

      if (phoneNumbers && phoneNumbers.length) {
        phoneNumbers.forEach((item) => {
          this.customerAddressInfoFields.push({
            icon: item.isMobile ? "iphone" : "phone",
            text: item.number,
          });
        });
      }

      if (websites && websites.length) {
        this.customerAddressInfoFields.push({
          icon: "internet-browser",
          text: websites[0].url,
          href: websites[0].url,
        });
      }
    },

    constructCustomerInfoFields() {
      const { customerInformation } = this.customer;
      this.customerInfoFields.push({
        icon: "customer-order-entry",
        text: "Order Blocked",
        value: customerInformation.isOrderBlocked,
      });

      this.customerInfoFields.push({
        icon: "shipping-status",
        text: "Delivery Blocked",
        value: customerInformation.isDeliveryBlocked,
      });

      this.customerInfoFields.push({
        icon: "money-bills",
        text: "Billing Blocked",
        value: customerInformation.isBillingBlocked,
      });
    },
  },
};
</script>
