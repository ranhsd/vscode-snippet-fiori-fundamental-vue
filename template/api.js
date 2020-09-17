import axios from "axios";

const client = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.VUE_APP_PUBLIC_API_KEY}`,
  },
});

export async function getProducts(top, skip) {
  return await client.get("beta/Customers", {
    params: {
      $top: top,
      $skip: skip,
    },
  });
}

export async function getSalesOrders() {
  const {
    data: { value },
  } = await client.get("beta/SalesOrders", {
    params: {},
  });

  return value;
}

export async function getSalesOrder(id){
  const { data } = await client.get(`beta/SalesOrders/${id}`);
  return data;
}

export async function getCustomers(){
  const { data } = await client.get("beta/Customers");
  return data;
}

export async function getCustomer(id){
  const { data } = await client.get(`beta/Customers/${id}`);
  return data;
}

export async function getCustomerOrders(customerId){
  // TODO: use $filter with customerId when it will be added to the API
  const { data } = await client.get("beta/CustomerOrders");
  return {
    items: data.value,
    next: data["@odata.nextLink"]
  };
}

export async function getCustomerOrder(id){
  // TODO: use $filter with customerId when it will be added to the API
  const { data } = await client.get(`beta/CustomerOrders/${id}`);
  return data;
}

export async function getProduct(id){
  const { data } = await client.get(`beta/Products/${id}`);
  return data;  
}
