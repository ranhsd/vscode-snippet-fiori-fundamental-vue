import Vue from "vue";
import Router from "vue-router";
import HelloWorldPage from "@/pages/HelloWorldPage";
import Customers from "@/pages/Customers";
import Orders from "@/pages/Orders";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "customers",
      component: Customers
    },
    {
      path: "/orders/:id",
      name: 'orders',
      props: true,
      component: Orders
    },
    {
      path: "/order/:id",
      name: "order",
      props: true,
      component: () => import("@/pages/OrderItems.vue")
    }      
  ]
});
