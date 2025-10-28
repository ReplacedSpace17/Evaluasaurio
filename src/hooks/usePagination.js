import { useCallback, useEffect, useState } from "react";

export function usePagination(endPoint, load = true) {
  const [path, setPath] = useState(endPoint)
  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [loadFirst, setLoadFirst] = useState(load);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (currentPath) => {
    if (!currentPath) {
      setHasMore(false)
      setIsLoading(false)
      return;
    }

    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(currentPath)
      if (!res.ok){
        throw new Error(`HTTP ${res.status}`)
      }
      const json = await res.json()
      setData(oldData => [...oldData, ...json.data])
      
      setPath(json.links.next)
      setHasMore(json.links.next !== null)

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const nextPage = useCallback(() => {
    if (hasMore || !isLoading){
      fetchData(path); 
    }    
  }, [hasMore, isLoading, fetchData, path])

  const changePath = (newPath) => {
    fetchData(newPath)
  }

  const fecthInit = () => {
    if(!loadFirst){
      setLoadFirst(true);
      fetchData(path)
    }
  }

  useEffect(() => {
    if(loadFirst){
      fetchData(endPoint)
    }
  }, [])

  return {
    nextPage: hasMore ? nextPage : () => {},
    data,
    error,
    isLoading,
    hasMore,
    changePath,
    fecthInit,
    setData,
    loadFirst
  }
}