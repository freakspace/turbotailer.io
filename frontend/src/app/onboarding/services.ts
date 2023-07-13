
export const createWooCommerce = async ( 
    token: string, 
    storeName: string, 
    baseUrl: string
    ) => {
    const response = await fetch(
        `http://127.0.0.1:8000/api/stores/create_woocommerce/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify({
            store_name: storeName,
            base_url: baseUrl,
          }),
        }
      );

    return response
}

export const updateWooCommerce = async (
    token: string, 
    storeId: string,  
    storeName?: string | null | undefined, 
    baseUrl?: string | undefined,
    consumerKey?: string | null, 
    consumerSecret?: string | null,
    ) => {
    const response = await fetch(
        `http://127.0.0.1:8000/api/stores/update_woocommerce/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + token,
          },
          body: JSON.stringify({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            store_id: storeId,
            store_name: storeName,
            base_url: baseUrl
          }),
        }
      );

    return response
}


export const verifyConnection = async (
  token: string, 
  storeId: string,  
  ) => {
  const response = await fetch(
    `http://127.0.0.1:8000/api/stores/ping_connection/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        store_id: storeId,
      }),
    }
  );

  return response
};