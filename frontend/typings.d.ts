export interface ICard {
    title: string
    subtitle: string
  }

export interface IStep {
  is_finished: boolean
  number: number
  description: string
}

export interface IWooCommerceType {
  consumer_key: string,
  consumer_secret: string,
  base_url: string
}

export interface IStore {
    id: string
    store_type: IWooCommerceType
    channels: IChannel[]
    name: string
    is_active: bool
    model: string
}

type FieldValue = null | string | string[];

export interface IChannel {
  channel: string
  fields: string[]
  id: string | undefined
  store: string | undefined
}

export interface INavItem {
  name: string;
  component: JSX.Element;
}