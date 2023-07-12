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
  consumer_key: boolean,
  consumer_secret: boolean,
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

export interface IChannel {
  id: string
  channel: string
  is_active: bool
}