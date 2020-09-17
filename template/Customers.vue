<template>
  <div class="h-full">
    <fd-container fluid centered class="w-full h-full">
      <fd-container centered class="h-full mt-4">
        <fd-section>
          <template #header>
            <fd-section-header>
              <fd-section-title>Customers</fd-section-title>
            </fd-section-header>
          </template>
          <fd-panel>
            <fd-table
              selection-mode="multiple"
              :headers="headers"
              :items="items"
              striped
            >
              <template #row="{ toggle, item }">
                <fd-table-row @click="toggle">
                  <template #customerId>
                    <fd-table-cell>
                      <router-link
                        :to="{
                          name: 'orders',
                          params: {
                            id: item.id,
                          },
                        }"
                        >{{ item.displayId }}</router-link
                      >
                    </fd-table-cell>
                  </template>
                  <template #organization>
                    <fd-table-cell>
                      {{ item.organization.nameDetails.formattedOrgNameLine1 }}
                    </fd-table-cell>
                  </template>
                </fd-table-row>
              </template>
            </fd-table>
          </fd-panel>
        </fd-section>
      </fd-container>
    </fd-container>
  </div>
</template>

<script>
import { getCustomers } from "@/api";
import ShellBar from "@/components/ShellBar";

export default {
  name: "Home",
  components: {
    ShellBar,
  },
  created() {
    this.refresh();
  },
  data() {
    return {
      headers: [
        {
          id: "customerId",
          label: "Customer ID",
        },
        {
          id: "organization",
          label: "Organization",
        },
      ],
      items: [],
    };
  },
  methods: {
    async refresh() {
      const { value } = await getCustomers();
      this.items = value;
    },
  },
};
</script>

<style lang="scss" scoped></style>
