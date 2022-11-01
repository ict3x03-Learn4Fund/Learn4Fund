import React from 'react'
import { Grid } from "react-loader-spinner";

export const useLoader = () => {
  return (
    <Grid
            height="80"
            width="80"
            color="gray"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
  )
}
