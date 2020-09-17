import axios from "axios";

const apiKey =
  process.env.VUE_APP_PUBLIC_API_KEY ||
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJkZW1vLmFwaS5ncmFwaC5zYXAiLCJzdWIiOiJkZW1vQGdyYXBoLnNhcCIsImF1ZCI6ImRlbW8uYXBpLmdyYXBoLnNhcCIsImlhdCI6MTU2MzgwMjEyMCwiZXhwIjo0Njg4MDA0NTIwLCJqdGkiOiI5OGMxM2E4MC0xNTQwLTQ3MDUtODg3MC0wYzM1NmQ2MjE0MDMifQ.JohYTPz1_CX0Q79ubkqyIC8NNOZF9cPSS0G89TUKQiDs0P407H6L0rlS6bijOkzek1h7JWno0jOBGoUQSAmSR0WX2abCwh26T3np2UxBkOx6ROkm_mpr-MtsGyOXM_9JPuZYv1nOnuuBYIOg-0zduO5ePuyWN29iEpmaCw1I6XxDp1_hzFAjS8GcKOmV8ilTrPTy_2UFc39qRLnur_bKtQb8-NleYHcv9uXChK3WEvEx7-NbCofKdkf_VVzuKpsDzzn2CvG2pKo3fFU_FLV56PA2D5kiprRz8FJyEUjslWPZCht0awQMRs7ml_e-srP3XykuXWMBBBV15yHNP8HdVA";

const client = axios.create({
  baseURL: process.env.VUE_APP_API_ENDPOINT || "https://api.graph.sap",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
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

export async function getSalesOrder(id) {
  const { data } = await client.get(`beta/SalesOrders/${id}`);
  return data;
}

export async function getCustomers() {
  const { data } = await client.get("beta/Customers");
  return data;
}

export async function getCustomer(id) {
  const { data } = await client.get(`beta/Customers/${id}`);
  return data;
}

export async function getCustomerOrders(customerId) {
  // TODO: use $filter with customerId when it will be added to the API
  const { data } = await client.get("beta/CustomerOrders");
  return {
    items: data.value,
    next: data["@odata.nextLink"],
  };
}

export async function getCustomerOrder(id) {
  // TODO: use $filter with customerId when it will be added to the API
  const { data } = await client.get(`beta/CustomerOrders/${id}`);
  return data;
}

export async function getProduct(id) {
  const { data } = await client.get(`beta/Products/${id}`);
  return data;
}
