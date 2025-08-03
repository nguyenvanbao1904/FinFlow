import { useCallback, useState } from "react";
import { authApis, publicApis } from '../configs/apis';
const useApi = () =>{
   const [isLoading, setIsLoading] = useState(false);

   const callApi =  useCallback(async (method, endpoint, data = null, isPublicApi = false)=>{
        setIsLoading(true);
        try{
            let response;
            switch (method.toUpperCase()) {
                case 'GET':
                    response = isPublicApi ? await publicApis.get(endpoint) : await authApis().get(endpoint);
                    break;
                case 'POST':
                    response = isPublicApi ? await publicApis.post(endpoint, data) : await authApis().post(endpoint, data);
                    break;
                case 'PUT':
                    response = isPublicApi ? await publicApis.put(endpoint, data) : await authApis().put(endpoint, data);
                    break;
                case 'DELETE':
                    response = isPublicApi ? await publicApis.delete(endpoint) : await authApis().delete(endpoint);
                    break;
                default:
                    throw new Error(`Unsupported method: ${method}`);
                }
            return response.data;
        }catch (err) {
            console.error(`API ${method} to ${endpoint} failed:`, err);
            
            const errorMessage = err.response?.data?.message || 'An unexpected error occurred.';
            
            // Ném lỗi để component có thể bắt và xử lý
            throw new Error(errorMessage);

        }finally {
            setIsLoading(false);
        }
   }, [])

   return { isLoading, callApi };
}

export default useApi;