"use client"

import RestrictedWrapper from "@/components/layouts/RestrictedWrapper"

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <RestrictedWrapper>
        {children}
    </RestrictedWrapper>
  )
}

export default layout