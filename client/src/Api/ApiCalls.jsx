import axios from 'axios'

const Api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URI}`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
const fetchData = async (endpoint) => {
  try {
    const response = await Api.get(endpoint)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

export const FetchAllAreaNames = () => fetchData('/area/get-names')
export const FetchLatestProperties = () => fetchData('/property/get-latest')
export const FetchTopAreas = () => fetchData('/area/top-areas')
export const FetchPropertiesForRent = () => fetchData('/property/for-rent')
export const FetchTopTypes = () => fetchData('/type/get-top')
export const FetchAllDevelopers = () => fetchData('/developer/get-all')
export const FetchDeveloper = (id) => fetchData(`/developer/get/${id}`)
export const FetchProperty = (id) => fetchData(`/property/get/${id}`)
export const FetchAllOffers = () => fetchData(`/offers/get-all`)
export const FetchLatestLaunches = () => fetchData('/launch/get-latest')
export const FetchLaunchDetails = (id) => fetchData(`/launch/get/${id}`)
export const FetchTopCompounds = () => fetchData('/compound/get-top')
export const FetchAllLaunches = () => fetchData('/launch/get-all')
export const FetchAllCompoundsNames = () => fetchData('/compound/get-names')
export const FetchAllTypesNames = () => fetchData('/type/get-all')
export const FetchPropertyToCompare = (storedPropertyIds) => fetchData(`/property/compare?ids=${storedPropertyIds.join(',')}`)
export const FetchAreaDetails = (areaId, page = 1, pageSize = 10) => {
  return fetchData(`/area/get/${areaId}?page=${page}&pageSize=${pageSize}`)
}
export const FetchDeveloperLaunch = (developerId) =>
  fetchData(`/launch/developer-launch/${developerId}`)
export const FetchCompound = (compoundId) =>
  fetchData(`/compound/get/${compoundId}`)
export const SearchProperties = async (searchParams) => {
  const { compound, type, beds, price } = searchParams
  const response = await Api.get('/property/search', {
    params: { compound, type, beds, price },
  })
  return response.data.data
}

const sendData = async (endpoint, data) => {
  try {
    const response = await Api.post(endpoint, data)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error)
    throw error
  }
}

export const AcademyRequest = (data) => sendData('/requests/academy', data)
export const ContactRequest = (data) => sendData('/requests/contact', data)
export const propertyRequest = (data) => sendData('/requests/property', data)
export default Api