
export const createWooCommerce = async ( 
    token: string, 
    storeName: string, 
    baseUrl: string
    ) => {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/create_woocommerce/`,
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
        `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/update_woocommerce/`,
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
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/ping_connection/`,
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


export const getStoreChannelFields = async (
  token: string, 
  channelId: string,  
  ) => {

    
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/get_channel_fields/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        channel_id: channelId,
      }),
    }
  );

  return response
};


export const setStoreChannelFields = async (
  token: string, 
  channelId: string,  
  fields: string[]
  ) => {

    
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/set_channel_fields/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      },
      body: JSON.stringify({
        channel_id: channelId,
        fields: fields
      }),
    }
  );

  return response
};

// Fetch all the available channels and fields the user can select depending on storetype
export const getAvailableChannelsAndFields = async (
  token: string, 
  storeId: string,  
  ) => {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/stores/get_available_channels_and_fields/`,
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