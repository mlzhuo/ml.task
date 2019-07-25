import { config } from './config'
import Fly from 'flyio/dist/npm/wx'

const flyFetch = new Fly()

export async function request(method, resource, body) {
  try {
    const formatedBody = body ? JSON.stringify(body) : undefined
    const fetchResponse = await flyFetch.request(
      config.apiURL + resource,
      formatedBody,
      {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return fetchResponse
  } catch (e) {
    console.log('request exception:', e)
  }
}

export async function jsonRequest(method, resource, body) {
  try {
    const response = await request(method, resource, body)
    if (!response) {
      return
    }    
    if (response.statusText === 'request:ok') {
      return response.data
    } else {
      console.log('apiError:')
    }
  } catch (e) {
    console.error('jsonRequest exception:', e)
  }
}
